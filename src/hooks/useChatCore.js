import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../services/service";
import * as db from "../services/db";
import { mapMessageData } from "../services/chatUtils";
import toast from "react-hot-toast";

/**
 * Custom hook to manage the core chat logic, sockets, and unified state.
 */
export const useChatCore = (myProfile, setMyProfile, activeChat, setActiveChat, setAddUserStatus, setIsAddUserModalOpen, setAddUserEmail, addUserEmail) => {
  const chunksRef = useRef({});
  const [socket, setSocket] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messagesData, setMessagesData] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const activeChatRef = useRef(activeChat);
  useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);

  const processedIdsRef = useRef(new Set());
  const recentContentRef = useRef(new Map()); 
  
  // NEW: Throttling Refs for user-status to stop re-render spam
  const statusThrottleRef = useRef(null);
  const pendingStatusDataRef = useRef(null);

  // NEW: Ref to track the user we are currently trying to add
  const addUserEmailRef = useRef(addUserEmail);
  useEffect(() => { addUserEmailRef.current = addUserEmail; }, [addUserEmail]);

  // SYSTEM: Clear unread count when chat becomes active
  useEffect(() => {
    if (!activeChat || !myProfile.id) return;
    
    setContacts(prev => {
      const idx = prev.findIndex(c => String(c.id) === String(activeChat));
      if (idx === -1 || (prev[idx].unread || 0) === 0) return prev;
      
      const updated = [...prev];
      updated[idx] = { ...updated[idx], unread: 0 };
      
      // Persist the cleared status
      setTimeout(() => db.saveContacts(myProfile.id, updated).catch(console.error), 0);
      return updated;
    });
  }, [activeChat, myProfile.id]);

  // Socket management & Listeners
  useEffect(() => {
    if (!myProfile.id) return;

    const newSocket = io(BASE_URL, {
      transports: ["websocket"], // FORCED WEBSOCKET: Prevents 400 Errors on Render/Cloud hosts
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 2000,
      timeout: 20000, // Increased timeout to handle slow Render cold starts
    });
    setSocket(newSocket);
    
    // FRIEND'S PROTOCOL: Emit only the ID string
    newSocket.emit("user-online", myProfile.id);
    newSocket.emit("get-all-messages", myProfile.id);

    // --- Sending Helper ---
    const dispatchSocketMessage = (payload) => {
      if (!newSocket) return;
      newSocket.emit("send-private-message", payload);
    };

    // --- Listeners ---
    newSocket.on("connect", () => {
      console.log("🚀 Socket Connected Successfully:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket Connection Error:", err.message);
      if (err.message.includes("xhr poll error")) {
        console.warn("Detected polling failure, socket will attempt fallback (if configured).");
      }
    });

    newSocket.on("receive-private-message", (data) => {
      // SYSTEM: Internal message receipt log
      if (process.env.NODE_ENV === 'development') {
        console.debug("📩 Incoming Message:", { from: data.fromEmail || data.fromUserId, type: data.type });
      }

      const isMe = String(data.fromUserId) === String(myProfile.id);
      
      // OPTIMIZATION: Suppress echoes of our own messages (handled via confirmation)
      if (isMe) return;

      const contactId = String(data.fromUserId || data.fromEmail || "unknown");
      
      // CRITICAL FIX: Ensure contactEmail is actually an email
      const rawEmail = data.fromEmail || data.fromUserId;
      const contactEmail = (rawEmail && String(rawEmail).includes("@")) ? String(rawEmail) : null;
      
      // CRITICAL: Stop overwriting names with emails. Prefer real names if available.
      // Preference: name > email > id
      const contactName = data.fromName || contactEmail || contactId;
      const contactAvatar = data.fromAvatar || data.fromProfileImage;


      const msgObj = mapMessageData(data, myProfile.id, chunksRef, "them");
      
      // ABSOLUTE DEDUPLICATION: Use the Content Hash from chatUtils
      const dedupeKey = `${contactId}_${msgObj.contentHash}`;
      const now = Date.now();
      
      if (msgObj.type !== 'loading' && msgObj.type !== 'text') {
        const isMedia = msgObj.type === 'image' || msgObj.type === 'video' || msgObj.type === 'document';
        const lastSeen = recentContentRef.current.get(dedupeKey);
        // Only block media if same content arrives within 10s
        if (isMedia && lastSeen && (now - lastSeen < 10000)) {
          console.warn("Blocked duplicate media:", dedupeKey);
          return;
        }
        if (processedIdsRef.current.has(msgObj.id)) {
          console.warn("Blocked duplicate ID:", msgObj.id);
          return;
        }
        
        if (isMedia) recentContentRef.current.set(dedupeKey, now);
        processedIdsRef.current.add(msgObj.id);
      }
      
      setMessagesData(prevMsgs => {
        const list = prevMsgs[contactId] || [];
        const existingIdx = list.findIndex(m => String(m.id) === String(msgObj.id));
        
        const newList = (existingIdx !== -1)
          ? list.map((m, i) => i === existingIdx ? { ...m, ...msgObj, status: "delivered" } : m)
          : [...list, { ...msgObj, status: "delivered" }];
        
        // Performance: Run DB save in background
        setTimeout(() => db.saveMessages(myProfile.id, contactId, newList).catch(console.error), 0);
        return { ...prevMsgs, [contactId]: newList };
      });

      // --- Notification System ---
      const isActive = String(activeChatRef.current) === String(contactId);
      if (!isMe && !isActive) {
        toast(`💬 New message ${data.wasPending ? "(Cached)" : ""} from ${contactName || "Someone"}`, {
          icon: '✉️',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }

      setContacts(prevContacts => {
        const existingById = prevContacts.find(c => String(c.id) === contactId);
        const existingByEmail = contactEmail ? prevContacts.find(c => String(c.id) === contactEmail || c.email === contactEmail) : null;
        
        const previewText = msgObj.type === 'loading' 
          ? `📥 Receiving ${msgObj.progress}%...` 
          : (msgObj.text || (msgObj.type === 'image' ? '📷 Photo' : msgObj.type === 'video' ? '🎥 Video' : msgObj.type === 'document' ? '📄 Document' : 'Message'));

        let updated;
        if (existingById) {
          updated = prevContacts.map(c => String(c.id) === contactId ? { ...c, name: data.fromName || contactName || c.name, email: contactEmail || c.email, avatar: contactAvatar || c.avatar, message: previewText, time: "Just now", online: true, unread: (isMe || String(activeChatRef.current) === contactId ? (c.unread || 0) : (c.unread || 0) + 1) } : c);
        } else if (existingByEmail) {
          const oldId = String(existingByEmail.id);
          if (String(activeChatRef.current) === oldId) setActiveChat(contactId);
          updated = prevContacts.map(c => String(c.id) === oldId ? { ...c, id: contactId, email: contactEmail || existingByEmail.email, name: data.fromName || contactName || c.name, avatar: contactAvatar || c.avatar, message: previewText, time: "Just now", online: true } : c);
        } else {
          const name = data.fromName || contactName || contactEmail || contactId || "New Contact";
          const avatar = contactAvatar || name.charAt(0).toUpperCase();
          updated = [...prevContacts, { id: contactId, email: contactEmail, name, message: previewText, time: "Just now", unread: isMe ? 0 : 1, online: true, avatar }];
        }
        
        /* PREVIOUS CONNECTION LOGIC:
        setTimeout(() => db.saveContacts(myProfile.id, updated).catch(console.error), 0);
        return updated;
        */

        // NEW: Also handle modal closure if this message is from the user we are adding
        const currentlyAdding = addUserEmailRef.current;
        if (currentlyAdding && (contactEmail === currentlyAdding || contactId === currentlyAdding)) {
           setAddUserStatus({ type: 'success', msg: 'Connected!' });
           setTimeout(() => {
             setIsAddUserModalOpen(false);
             setAddUserEmail("");
             setAddUserStatus(null);
           }, 800);
        }

        setTimeout(() => db.saveContacts(myProfile.id, updated).catch(console.error), 0);
        return updated;
      });
    });
    
     /* PREVIOUS MESSAGE-SENT LISTENER:
     newSocket.on("message-sent", (data) => {
       ...
     });
     */

    newSocket.on("message-sent", (data) => {
      // SYSTEM: Success confirmation from server
      console.log(`✅ Message ${data.status === 'cached' ? 'Queued' : 'Delivered'}:`, data.msgId);
      
      const contactId = String(data.toUserId || data.toEmail);
      
      setMessagesData(prev => {
        const list = prev[contactId] || [];
        // Map server status: 'cached' -> 'sent' (one check), 'delivered' -> 'delivered' (two checks)
        const resolvedStatus = data.status === "cached" ? "sent" : "delivered";
        
        return {
          ...prev,
          [contactId]: list.map(m => (m.id === data.msgId) ? { ...m, status: resolvedStatus } : m)
        };
      });

      // SEARCH/ADD CONTACT SUCCESS
      const currentlyAdding = addUserEmailRef.current;
      if (currentlyAdding && (data.toEmail === currentlyAdding || String(data.toUserId) === String(currentlyAdding))) {
        setAddUserStatus({ type: 'success', msg: data.status === "cached" ? "Connected (Offline)" : "Connected!" });
        
        setContacts(prev => {
          if (prev.find(c => String(c.id) === contactId)) return prev;
          
          const emailValue = (data.toEmail && data.toEmail.includes("@")) 
            ? data.toEmail 
            : (currentlyAdding && currentlyAdding.includes("@") ? currentlyAdding : null);

          // Preference: name > email > id
          const displayName = data.toName || emailValue || contactId;

          const updated = [...prev, { 
            id: contactId, 
            email: emailValue, 
            name: displayName, 
            message: data.reason || "Start chatting!", 
            time: "Just now", 
            online: data.status === "delivered", 
            avatar: (emailValue || contactId).charAt(0).toUpperCase() 
          }];
          
          setTimeout(() => db.saveContacts(myProfile.id, updated).catch(console.error), 0);
          return updated;
        });

        setTimeout(() => {
          setIsAddUserModalOpen(false);
          setAddUserEmail("");
          setAddUserStatus(null);
        }, 800);
      }
    });

    newSocket.on("all-messages", (data) => {
      if (!Array.isArray(data)) return;
      
      // Batch all updates into a single render cycle
      const tempMessages = {};
      const pendingContacts = [];

      data.forEach(msg => {
        const msgObj = mapMessageData(msg, myProfile.id, chunksRef);
        const contactId = String(String(msg.fromUserId) === String(myProfile.id) ? msg.toUserId : msg.fromUserId);
        const targetId = contactId || msg.toEmail;
        
        if (!targetId || targetId === "undefined") return;
        
        if (msgObj.type !== 'loading' && processedIdsRef.current.has(msgObj.id)) return;
        if (msgObj.type !== 'loading') {
          processedIdsRef.current.add(msgObj.id);
        }

        if (!tempMessages[targetId]) tempMessages[targetId] = [];
        tempMessages[targetId].push(msgObj);
        
        const rawEmail = (String(msg.fromUserId) === String(myProfile.id) ? msg.toEmail : msg.fromEmail);
        const emailValue = (rawEmail && String(rawEmail).includes("@")) ? String(rawEmail) : null;
        
        // Preference: name > email > id
        const name = (String(msg.fromUserId) === String(myProfile.id) ? (msg.toName || emailValue || targetId) : (msg.fromName || emailValue || targetId));
        
        const avatar = (String(msg.fromUserId) === String(myProfile.id) ? (msg.toAvatar || msg.toProfileImage) : (msg.fromAvatar || msg.fromProfileImage)) || String(targetId).charAt(0).toUpperCase();

        pendingContacts.push({ 
          id: targetId, 
          name, 
          email: emailValue, 
          message: msgObj.text || "History", 
          time: "History", 
          unread: 0, 
          online: false, 
          avatar 
        });
      });

      // Apply batch updates
      setMessagesData(prev => {
        const next = { ...prev };
        Object.keys(tempMessages).forEach(tid => {
          next[tid] = [...(next[tid] || []), ...tempMessages[tid]];
          setTimeout(() => db.saveMessages(myProfile.id, tid, next[tid]).catch(console.error), 0);
        });
        return next;
      });

      setContacts(prev => {
        let updated = [...prev];
        let changed = false;
        pendingContacts.forEach(pc => {
          const idx = updated.findIndex(c => String(c.id) === String(pc.id));
          if (idx === -1) {
             updated.push(pc);
             changed = true;
          } else {
             updated[idx] = { ...updated[idx], avatar: pc.avatar, email: pc.email || updated[idx].email };
             changed = true;
          }
        });
        if (changed) {
          setTimeout(() => db.saveContacts(myProfile.id, updated).catch(console.error), 0);
        }
        return updated;
      });
    });

    newSocket.on("message-failed", (data) => {
      // SYSTEM: Error or Offline notification
      console.warn("⚠️ Action Failed:", data.reason || "Unknown error");
      
      const isOfflineSuccess = data.reason === "User is offline" || data.reason?.toLowerCase().includes("offline");
      const contactId = String(data.toUserId && data.toUserId !== "none" ? data.toUserId : (data.toEmail || "unknown"));

      // IF OFFLINE: Mark message as 'sent' (single tick) so user knows it's at the server
      if (isOfflineSuccess) {
        setMessagesData(prev => {
          const list = prev[contactId] || [];
          return {
            ...prev,
            [contactId]: list.map(m => (m.id === data.msgId) ? { ...m, status: "sent" } : m)
          };
        });
      }
      
      // RELAXED CONDITION: If server says user is offline, we still add them to contacts
      if (isOfflineSuccess && addUserEmail) {
        setAddUserStatus({ type: 'success', msg: 'Connected (User Offline)' });
        const emailValue = (data.toEmail && data.toEmail.includes("@")) ? data.toEmail : (addUserEmail.includes("@") ? addUserEmail : null);

        setContacts(prev => {
          if (prev.find(c => String(c.id) === contactId)) return prev;
          const updated = [...prev, { 
            id: contactId, 
            name: data.toName || emailValue || contactId, 
            email: emailValue, 
            message: "User is offline", 
            time: "Just now", 
            online: false, 
            avatar: (emailValue || contactId).charAt(0).toUpperCase() 
          }];
          setTimeout(() => db.saveContacts(myProfile.id, updated).catch(console.error), 0);
          return updated;
        });

        setTimeout(() => {
          setIsAddUserModalOpen(false);
          setAddUserEmail("");
          setAddUserStatus(null);
        }, 1200);
        return;
      }

      // Only show to user if it's a search failure or modal is contextually open
      if (data.reason || data.action === 'search') {
        setAddUserStatus({ 
          type: "error", 
          msg: data.reason || "Search failed - User not found" 
        });
      }
    });

    newSocket.on("user-status", (data) => {
      // NEW: Throttle logic to prevent re-render spam
      pendingStatusDataRef.current = data;
      
      if (statusThrottleRef.current) return; // Wait for the current window to finish

      statusThrottleRef.current = setTimeout(() => {
        const latestData = pendingStatusDataRef.current;
        statusThrottleRef.current = null;
        if (!latestData) return;

        // SYSTEM: Throttled UI Update
        if (latestData.onlineUsers) {
          console.log(`👥 Contacts Sync: ${latestData.onlineUsers.length} users online`);
        }
        
        const onlineIds = (latestData.onlineUsers && Array.isArray(latestData.onlineUsers)) 
          ? new Set(latestData.onlineUsers.map(id => String(id))) 
          : null;

        if (onlineIds) {
          setContacts(prev => {
            let changed = false;
            const updated = prev.map(c => {
              const isOnline = onlineIds.has(String(c.id));
              const targetEmail = (c.email && c.email.includes("@")) ? c.email : (String(c.id).includes("@") ? c.id : null);
              const targetName = c.name || targetEmail || c.id;
              
              if (c.online !== isOnline || c.name !== targetName || c.email !== targetEmail) {
                changed = true;
                return { ...c, online: isOnline, name: targetName, email: targetEmail };
              }
              return c;
            });
            return changed ? updated : prev;
          });
          
          if (myProfile.id && onlineIds.has(String(myProfile.id))) {
            setMyProfile(prev => prev.status === "online" ? prev : { ...prev, status: "online" });
          }
        } else if (latestData.userId && latestData.userId !== "null") {
          const isOnline = latestData.status === "online";
          setContacts(prev => {
            let changed = false;
            const updated = prev.map(c => {
              if (String(c.id) === String(latestData.userId)) {
                const targetEmail = (c.email && c.email.includes("@")) ? c.email : (String(c.id).includes("@") ? c.id : null);
                const targetName = c.name || targetEmail || c.id;
                if (c.online !== isOnline || c.name !== targetName || c.email !== targetEmail) {
                   changed = true;
                   return { ...c, online: isOnline, name: targetName, email: targetEmail };
                }
              }
              return c;
            });
            return changed ? updated : prev;
          });
        }
      }, 1000); // 1-second throttle window
    });

    // BACKEND PROTOCOL: Listen for direct online list responses
    newSocket.on("online-users-list", (data) => {
      if (data.onlineUsers && Array.isArray(data.onlineUsers)) {
        const onlineIds = new Set(data.onlineUsers.map(id => String(id)));
        setContacts(prev => prev.map(c => ({
          ...c,
          online: onlineIds.has(String(c.id))
        })));
      }
    });
    
    newSocket.on("user-profile-updated", (data) => {
       setContacts(prev => prev.map(c => 
         String(c.id) === String(data.userId) 
           ? { ...c, name: data.name || c.name, avatar: data.avatar || c.avatar } 
           : c
       ));
    });

    // Fetch initial online list
    newSocket.emit("get-online-users");

    return () => newSocket.close();
  }, [myProfile.id]); // Removed activeChat to prevent disconnects on switch

  // --- Handlers ---
  const handleSendMessage = useCallback(async (text, setInput, params = {}) => {
    const input = text || "";
    const contactId = String(activeChat);
    const contact = contacts.find(c => String(c.id) === contactId);

    // GUARD: Prevents sending to invalid/initial placeholder IDs
    if (!contactId || contactId === "null" || contactId === "undefined" || contactId === "1") {
      console.warn("Blocked send to invalid contact ID:", contactId);
      return;
    }

    const msgId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Optimistic UI Update
    const rawMsg = {
      id: msgId,
      fromUserId: myProfile.id,
      toUserId: contactId,
      message: input,
      type: params.type || "text",
      createdAt: Date.now(),
      ...params
    };

    const msgObj = mapMessageData(rawMsg, myProfile.id, chunksRef, "me");
    setMessagesData(prev => {
      const contactId = String(activeChat);
      const newList = [...(prev[contactId] || []), { ...msgObj, status: "sending" }];
      setTimeout(() => db.saveMessages(myProfile.id, contactId, newList).catch(console.error), 0);
      return { ...prev, [contactId]: newList };
    });

    if (setInput) setInput("");
    
    // Network Dispatch
    if (socket) {
      const commonPayload = {
        msgId: msgId,
        fromUserId: myProfile.id,
        fromName: myProfile.name,
        fromEmail: myProfile.email,
        fromAvatar: myProfile.avatar,
        type: params.type || "text",
        fileName: params.documentName || params.fileName || "File",
        ...params
      };

      const messageContent = input || params.message || "";
      const CHUNK_SIZE = 64 * 1024; // 64KB per packet for maximum compatibility

      // CHUNKING LOGIC: If message is a large string (Base64), split it
      if (typeof messageContent === 'string' && messageContent.length > CHUNK_SIZE) {
        const totalChunks = Math.ceil(messageContent.length / CHUNK_SIZE);
        const fileId = msgId;

        for (let i = 0; i < totalChunks; i++) {
          const start = i * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, messageContent.length);
          const chunkData = messageContent.substring(start, end);
          
          // Protocol: [FILE_CHUNK:msgId:index:total]:payload
          const chunkedMsg = `[FILE_CHUNK:${fileId}:${i}:${totalChunks}]:${chunkData}`;
          
          const payload = { ...commonPayload, message: chunkedMsg };
          
          if (contact?.email && contact.email.includes("@")) {
             socket.emit("send-message-by-email", { ...payload, toEmail: contact.email, toUserId: contactId });
          } else {
             socket.emit("send-private-message", { ...payload, toUserId: contactId });
          }
        }
      } else {
        // STANDARD SEND: Message is small enough for a single packet
        const payload = { ...commonPayload, message: messageContent };
        
        if (contact?.email && contact.email.includes("@")) {
          console.log(`📤 Sending via EMAIL protocol: ${contact.email}`);
          socket.emit("send-message-by-email", { ...payload, toEmail: contact.email, toUserId: contactId });
        } else {
          console.log(`📤 Sending via ID protocol (Fallback): ${contactId}`);
          socket.emit("send-private-message", { ...payload, toUserId: contactId });
        }
      }
    }
  }, [activeChat, myProfile, socket, contacts]);

  const handleAddContact = useCallback(async (email) => {
    if (!email || !email.includes("@")) {
      setAddUserStatus({ type: 'error', msg: 'Please enter a valid email' });
      return;
    }
    setAddUserStatus({ type: 'loading', msg: 'Connecting...' });
    if (socket) {
      // FRIEND'S PROTOCOL: Use send-message-by-email for discovery
      socket.emit("send-message-by-email", {
        fromUserId: myProfile.id,
        toEmail: email,
        message: "", // Empty message to initiate
        type: "text",
        action: 'search' // Keep this if server handles it, or remove if server doesn't care
      });
    }
  }, [myProfile, socket, setAddUserStatus]);

  const handleUpdateProfile = useCallback(async (updatedData) => {
    try {
      const newProfile = { ...myProfile, ...updatedData };
      setMyProfile(newProfile);
      
      // Update LocalStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        const newUserObj = { 
          ...userObj, 
          name: updatedData.name || userObj.name,
          email: updatedData.email || userObj.email,
          profileImage: updatedData.avatar || userObj.profileImage || userObj.avatar,
          avatar: updatedData.avatar || userObj.avatar
        };
        localStorage.setItem("user", JSON.stringify(newUserObj));
      }

      // Sync with Sockets
      if (socket) {
        socket.emit("update-profile", {
          userId: myProfile.id,
          name: updatedData.name,
          avatar: updatedData.avatar,
          email: updatedData.email
        });
      }
      return { success: true };
    } catch (e) {
      console.error("Profile Update Error:", e);
      return { success: false, error: e.message };
    }
  }, [myProfile, socket, setMyProfile]);

  const handleAttachmentSubmit = useCallback(async (e, type, setInput) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of files) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target.result;
        
        if (type === 'media') {
          const isVideo = file.type.startsWith('video/');
          const payload = {
            type: isVideo ? 'video' : 'image',
            message: base64, // Direct Blob (Single-Bubble)
            fileName: file.name
          };
          if (!isVideo && base64.startsWith("data:image/")) {
             // Optional: compress image here if needed
          }
          handleSendMessage("", setInput, payload);
        } else {
          handleSendMessage("", setInput, {
            type: 'document',
            message: base64,
            documentName: file.name,
            fileName: file.name
          });
        }
      };
      reader.readAsDataURL(file);
    }
  }, [handleSendMessage]);

  const handleRemoveContact = useCallback(async (contactId) => {
    setContacts(prev => {
      const updated = prev.filter(c => String(c.id) !== String(contactId));
      db.saveContacts(myProfile.id, updated).catch(console.error);
      return updated;
    });
    if (String(activeChatRef.current) === String(contactId)) {
        setActiveChat(null);
    }
  }, [myProfile.id, setActiveChat]);

  // Initial Data Lifecycle
  useEffect(() => {
    const runMigrationAndLoad = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userObj = JSON.parse(storedUser);
          const resolvedId = userObj._id || userObj.id;
          if (!resolvedId) return;

          setMyProfile({ id: resolvedId, name: userObj.name || "User", email: userObj.email || "No email", avatar: userObj.profileImage || userObj.avatar, status: "online" });

          const savedContacts = await db.getContacts(resolvedId);
          const syncedContacts = (savedContacts || []).map(c => {
            // SANITIZE: Remove IDs that leaked into the email field
            const cleanEmail = (c.email && c.email.includes("@")) ? c.email : null;
            
            // Preference: name > email > id
            const displayName = c.name || cleanEmail || c.id;

            return (c.email === userObj.email || String(c.id) === String(resolvedId)) 
              ? { ...c, email: cleanEmail, name: displayName, avatar: userObj.profileImage || userObj.avatar || c.avatar } 
              : { ...c, email: cleanEmail, name: displayName };
          });

          setContacts(syncedContacts);
          const initialMsgs = {};
          for (const c of syncedContacts) {
             const rawMsgs = await db.getMessages(resolvedId, c.id);
             initialMsgs[c.id] = (rawMsgs || []).map(m => mapMessageData(m, resolvedId, chunksRef));
          }
          setMessagesData(initialMsgs);
        } catch (e) { console.error("Error in storage lifecycle:", e); }
      }
    };
    runMigrationAndLoad();
  }, []);

  /* PREVIOUS RETURN:
  return { 
    socket, 
    contacts, 
    messagesData, 
    ...
  };
  */

  // NEW: Memoized return to prevent ChatFlow from re-rendering unnecessarily
  return useMemo(() => ({ 
    socket, 
    contacts, 
    messagesData, 
    setContacts, 
    setMessagesData,
    handleSendMessage,
    handleAttachmentSubmit,
    handleUpdateProfile,
    handleAddContact,
    handleRemoveContact,
    uploadProgress
  }), [socket, contacts, messagesData, handleSendMessage, handleAttachmentSubmit, handleUpdateProfile, handleAddContact, handleRemoveContact, uploadProgress]);
};

