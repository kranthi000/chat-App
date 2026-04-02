import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../services/service";
import * as db from "../services/db";
import { mapMessageData, compressImage } from "../services/chatUtils";

/**
 * Custom hook to manage the core chat logic, sockets, and unified state.
 */
export const useChatCore = (myProfile, setMyProfile, activeChat, setActiveChat, setAddUserStatus, setIsAddUserModalOpen, setAddUserEmail) => {
  const chunksRef = useRef({});
  const [uploadProgress, setUploadProgress] = useState(null);
  const [socket, setSocket] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messagesData, setMessagesData] = useState({});

  /**
   * UNIFIED SENDER: Single responsible function for all socket emissions.
   * Handles both standard messages and large chunked files.
   */
  const dispatchSocketMessage = useCallback((socketInstance, payload) => {
    if (!socketInstance?.connected) return false;
    
    const isEmail = !!payload.toEmail;
    const event = isEmail ? "send-message-by-email" : "send-private-message";
    const msgContent = payload.message || "";
    const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB - "Blob" style (single message for most files)

    if (msgContent.length > CHUNK_SIZE) {
       const fileId = "FILE_" + Date.now() + "_" + Math.round(Math.random() * 1000);
       const totalChunks = Math.ceil(msgContent.length / CHUNK_SIZE);
       const sendNextChunk = (index) => {
          if (index >= totalChunks) { setUploadProgress(null); return; }
          const chunkData = msgContent.substring(index * CHUNK_SIZE, Math.min((index + 1) * CHUNK_SIZE, msgContent.length));
          setUploadProgress({ current: index + 1, total: totalChunks, name: payload.fileName || "File" });
          const chunkPayload = { ...payload };
          // Remove potential base64 fields to keep chunk overhead low
          delete chunkPayload.imageUrl; delete chunkPayload.image; delete chunkPayload.img; 
          delete chunkPayload.videoUrl; delete chunkPayload.video; 
          delete chunkPayload.documentUrl; delete chunkPayload.document; delete chunkPayload.fileUrl;
          
          chunkPayload.message = `[FILE_CHUNK:${fileId}:${index}:${totalChunks}]:${chunkData}`;
          socketInstance.emit(event, chunkPayload);
          setTimeout(() => sendNextChunk(index + 1), 80); 
       };
       sendNextChunk(0);
    } else { 
      socketInstance.emit(event, payload); 
    }
    return true;
  }, []);

  const processedIdsRef = useRef(new Set());
  const recentContentRef = useRef(new Map()); // Use Map<hash, timestamp> to deduplicate by content snippets

  // Socket management & Listeners
  useEffect(() => {
    if (!myProfile.id) return;

    const newSocket = io(BASE_URL);
    setSocket(newSocket);

    newSocket.emit("user-online", { 
      userId: myProfile.id, 
      name: myProfile.name, 
      avatar: myProfile.avatar 
    });
    newSocket.emit("get-all-messages", myProfile.id);

    // --- Listeners ---
    newSocket.on("connect", () => {
      console.log("Socket Connected:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket Connection Error:", err);
    });

    newSocket.on("receive-private-message", (data) => {
      // DEBUG: Log first to see what's actually arriving
      console.log("RECEIVE-PRIVATE-MESSAGE Payload:", data);

      const msgObj = mapMessageData(data, myProfile.id, chunksRef, "them");
      const fromId = String(data.fromUserId || data.fromEmail || "unknown");
      const fromEmail = data.fromEmail;
      
      // ABSOLUTE DEDUPLICATION: Use the Content Hash from chatUtils
      const dedupeKey = `${fromId}_${msgObj.contentHash}`;
      const now = Date.now();
      
      // ABSOLUTE DEDUPLICATION: Only block if it's a non-loading (finished) message that we've already done.
      // For TEXT messages, we use a much tighter window (handled by higher-res fingerprints in chatUtils).
      // For MEDIA/CHUNKS, we use the contentHash to ensure only one bubble appears during reassembly.
      // EMERGENCY RESTORE: Only block if it is a NON-TEXT message that we've already seen.
      // Standard messages (text) should NEVER be blocked to ensure we always receive.
      if (msgObj.type !== 'loading' && msgObj.type !== 'text') {
        const isMedia = msgObj.type === 'image' || msgObj.type === 'video' || msgObj.type === 'document';
        const lastSeen = recentContentRef.current.get(dedupeKey);
        // Only block media if same content arrives within 10s (stops triple-send)
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
      
      console.log("RECEIVE-PRIVATE-MESSAGE:", msgObj.type, "From:", fromId);

      // PREVIEW LOGIC: Show meaningful status for chunked transfers
      const previewText = msgObj.type === 'loading' 
        ? `📥 Receiving ${msgObj.progress}%...` 
        : (msgObj.text || (msgObj.type === 'image' ? '📷 Photo' : msgObj.type === 'video' ? '🎥 Video' : msgObj.type === 'document' ? '📄 Document' : 'Message'));

      setMessagesData(prevMsgs => {
        const list = prevMsgs[fromId] || [];
        const existingIdx = list.findIndex(m => String(m.id) === String(msgObj.id));
        
        let newList;
        if (existingIdx !== -1) {
          newList = [...list];
          // Always update with the latest info (progress, status)
          newList[existingIdx] = { ...newList[existingIdx], ...msgObj, status: "delivered" };
        } else {
          // Only add if it's NOT a loading bubble that we probably already added manually
          // Or if it's a regular text message that we need confirmation for
          newList = [...list, { ...msgObj, status: "delivered" }];
        }
        
        db.saveMessages(myProfile.id, fromId, newList).catch(console.error);
        return { ...prevMsgs, [fromId]: newList };
      });

      setContacts(prevContacts => {
        const existingById = prevContacts.find(c => String(c.id) === fromId);
        const existingByEmail = fromEmail ? prevContacts.find(c => String(c.id) === fromEmail || c.email === fromEmail) : null;
        
        if (existingById) {
          return prevContacts.map(c => String(c.id) === fromId ? { ...c, message: previewText, time: "Just now", online: true, unread: (String(activeChat) === fromId ? c.unread : (c.unread || 0) + 1) } : c);
        } else if (existingByEmail) {
          const oldId = String(existingByEmail.id);
          if (String(activeChat) === oldId) setActiveChat(fromId);
          return prevContacts.map(c => String(c.id) === oldId ? { ...c, id: fromId, email: fromEmail, message: previewText, time: "Just now", online: true } : c);
        } else {
          const name = data.fromName || fromEmail || "New Contact";
          const avatar = data.fromAvatar || data.fromProfileImage || name.charAt(0).toUpperCase();
          return [...prevContacts, { id: fromId, email: fromEmail, name, message: previewText, time: "Just now", unread: 1, online: true, avatar }];
        }
      });
    });

    newSocket.on("all-messages", (data) => {
      if (!Array.isArray(data)) return;
      data.forEach(msg => {
        const msgObj = mapMessageData(msg, myProfile.id, chunksRef);
        const contactId = String(String(msg.fromUserId) === String(myProfile.id) ? msg.toUserId : msg.fromUserId);
        const targetId = contactId || msg.toEmail;
        if (!targetId || targetId === "undefined") return;
        
        // DEDUPLICATION: We only dedupe history by ID, never by content hash for text 
        // to avoid accidentally blocking identical messages in conversation history.
        if (msgObj.type !== 'loading' && processedIdsRef.current.has(msgObj.id)) return;
        if (msgObj.type !== 'loading') {
          processedIdsRef.current.add(msgObj.id);
        }

        setMessagesData(prev => {
          const list = prev[targetId] || [];
          const newList = [...list, msgObj];
          db.saveMessages(myProfile.id, targetId, newList).catch(console.error);
          return { ...prev, [targetId]: newList };
        });

        setContacts(prev => {
          if (prev.find(c => String(c.id) === targetId)) {
            // Even if existing, check if we can update the avatar from history
            return prev.map(c => String(c.id) === targetId ? { ...c, avatar: msg.fromAvatar || msg.toAvatar || c.avatar } : c);
          }
          const name = (String(msg.fromUserId) === String(myProfile.id) ? (msg.toName || targetId) : (msg.fromName || targetId));
          const avatar = (String(msg.fromUserId) === String(myProfile.id) ? (msg.toAvatar || msg.toProfileImage) : (msg.fromAvatar || msg.fromProfileImage)) || targetId.charAt(0).toUpperCase();
          const updated = [...prev, { id: targetId, name, email: targetId, message: msgObj.text || "History", time: "History", unread: 0, online: false, avatar }];
          db.saveContacts(myProfile.id, updated).catch(console.error);
          return updated;
        });
      });
    });

    newSocket.on("message-sent", (data) => {
      console.log("Message Sent/User Found:", data);
      if (data.status === "delivered" || data.status === "cached") {
        setAddUserStatus({ type: "success", msg: data.status === "cached" ? "User offline - cached!" : "User discovered!" });
        const toUserId = data.toUserId;
        const toEmail = data.toEmail;
        const toName = data.toName || toEmail || "New Contact";
        const toAvatar = data.toAvatar || data.toProfileImage || toName.charAt(0).toUpperCase();

        setContacts(prevContacts => {
          const existingByEmail = toEmail ? prevContacts.find(c => c.id === toEmail || c.email === toEmail) : null;
          
          if (existingByEmail && toUserId && existingByEmail.id !== toUserId) {
            const oldId = existingByEmail.id;
            if (String(activeChat) === String(oldId)) setActiveChat(toUserId);
            
            setMessagesData(prevMsgs => {
              const oldMsgs = prevMsgs[oldId] || [];
              const updatedMsgs = { ...prevMsgs, [toUserId]: oldMsgs };
              delete updatedMsgs[oldId];
              return updatedMsgs;
            });

            const updatedList = prevContacts.map(c => c.id === oldId ? { ...c, id: toUserId, email: toEmail, avatar: toAvatar, name: toName } : c);
            db.saveContacts(myProfile.id, updatedList).catch(console.error);
            return updatedList;
          }

          const targetId = toUserId || toEmail;
          if (targetId && !prevContacts.find(c => String(c.id) === String(targetId))) {
             const updatedList = [...prevContacts, { 
               id: targetId, 
               email: toEmail,
               name: toName, 
               message: "Let's chat!", 
               time: "Just now", 
               unread: 0, 
               online: true, 
               avatar: toAvatar 
             }];
             db.saveContacts(myProfile.id, updatedList).catch(console.error);
             setActiveChat(targetId); // Auto-focus on the new friend
             return updatedList;
          }
          return prevContacts;
        });
        
        // UPDATE MESSAGE STATUS: Avoid duplicate bubbles for chunked uploads
        const targetId = String(toUserId || toEmail);
        setMessagesData(prevMsgs => {
          const list = prevMsgs[targetId] || [];
          const existingIdx = list.findIndex(m => String(m.id) === String(data.id));
          
          if (existingIdx !== -1) {
            const newList = [...list];
            newList[existingIdx] = { ...newList[existingIdx], status: "delivered" };
            db.saveMessages(myProfile.id, targetId, newList).catch(console.error);
            return { ...prevMsgs, [targetId]: newList };
          }
          // If NOT found, only add it if it's NOT a loading/chunk confirmation
          // Regular text messages might need this if they weren't added locally yet
          const magicPrefix = "[MEDIA_JSON]:";
          const isChunk = typeof data.message === "string" && data.message.includes("[FILE_CHUNK:");
          
          if (!isChunk) {
            const msgObj = mapMessageData(data, myProfile.id, chunksRef, "me");
            const newList = [...list, { ...msgObj, status: "delivered" }];
            db.saveMessages(myProfile.id, targetId, newList).catch(console.error);
            return { ...prevMsgs, [targetId]: newList };
          }
          return prevMsgs;
        });

        // --- Modal UX: Clear and Close on Success ---
        if (toEmail) { 
          setAddUserEmail(""); 
          setTimeout(() => {
            setIsAddUserModalOpen(false);
            setAddUserStatus(null);
          }, 1500); 
        }
      }
    });

    newSocket.on("message-failed", (data) => {
      console.error("Action Failed:", data);
      setAddUserStatus({ type: "error", msg: data.reason || "Search failed - User not found" });
    });

    newSocket.on("user-status", async (data) => {
      const isOnline = data.status === "online";
      console.log("User Status Broadcast:", data);
      
      // BATCH SYNC: Handle full list if provided (common in initial connection)
      const onlineIds = (data.onlineUsers && Array.isArray(data.onlineUsers)) 
        ? new Set(data.onlineUsers.map(id => String(id))) 
        : null;

      setContacts(prev => prev.map(c => {
        const contactId = String(c.id);
        
        // Match specific user update OR check against the full online list
        if (data.userId && contactId === String(data.userId)) {
          return { ...c, online: isOnline, avatar: data.avatar || data.profileImage || c.avatar, name: data.name || c.name };
        } else if (onlineIds) {
          return { ...c, online: onlineIds.has(contactId) };
        }
        return c;
      }));
      
      // Self-status sync: Ensure current user knows they are online verified by server
      if (data.userId && String(data.userId) === String(myProfile.id)) {
        setMyProfile(prev => ({ ...prev, status: data.status }));
      } else if (onlineIds && myProfile.id && onlineIds.has(String(myProfile.id))) {
        setMyProfile(prev => ({ ...prev, status: "online" }));
      }
      
      if (isOnline && data.userId) {
        try {
          const pending = await db.getPendingMessages(data.userId);
          if (pending.length > 0 && newSocket.connected) {
            console.log(`Flushing ${pending.length} pending messages for ${data.userId}`);
            for (const item of pending) {
              dispatchSocketMessage(newSocket, item.payload);
              await db.deletePendingMessage(item.id);
            }
          }
        } catch (e) { console.error("Pending flush error:", e); }
      }
    });
    
    newSocket.on("user-profile-updated", (data) => {
       console.log("Profile Update Received:", data);
       setContacts(prev => prev.map(c => 
         String(c.id) === String(data.userId) 
           ? { ...c, name: data.name || c.name, avatar: data.avatar || c.avatar } 
           : c
       ));
    });

    return () => newSocket.close();
  }, [myProfile.id, dispatchSocketMessage]);

  // Initial Data Lifecycle (Migration & Loading)
  useEffect(() => {
    const runMigrationAndLoad = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userObj = JSON.parse(storedUser);
          const resolvedId = userObj._id || userObj.id;
          if (!resolvedId) return;

          setMyProfile({ id: resolvedId, name: userObj.name || "User", email: userObj.email || "No email", avatar: userObj.profileImage || userObj.avatar, status: "online" });

          // 1. Load from IndexedDB
          const savedContacts = await db.getContacts(resolvedId);
          const syncedContacts = (savedContacts || []).map(c => 
            (c.email === userObj.email || String(c.id) === String(resolvedId)) 
              ? { ...c, avatar: userObj.profileImage || userObj.avatar || c.avatar } 
              : c
          );
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

  // --- Core Handlers ---
  const handleSendMessage = (messageInput, setMessageInput, params = null) => {
    if (!activeChat) return;
    const mediaParams = (params && typeof params === 'object' && !params.nativeEvent && params.type !== 'click') ? params : null;
    if (!messageInput.trim() && !mediaParams) return;
    
    const textToSend = messageInput.trim();
    setMessageInput(""); 

    // Standardized Media Object: Avoid redundant/triple field definitions
    const mediaData = {};
    if (mediaParams?.type === "image") {
       mediaData.imageUrl = mediaParams.imageUrl;
    } else if (mediaParams?.type === "video") {
       mediaData.videoUrl = mediaParams.videoUrl;
    } else if (mediaParams?.type === "document") {
       mediaData.documentUrl = mediaParams.documentUrl;
       mediaData.documentName = mediaParams.documentName;
    }

    // Detect large file early to synchronize IDs
    const msgContent = mediaParams ? (mediaParams.imageUrl || mediaParams.videoUrl || mediaParams.documentUrl) : "";
    const CHUNK_SIZE = 100 * 1024;
    const isLarge = msgContent && msgContent.length > CHUNK_SIZE;
    const fileId = isLarge ? ("FILE_" + Date.now() + "_" + Math.round(Math.random() * 1000)) : null;

    const chatIdString = String(activeChat);
    const msgObj = mapMessageData({
      ...mediaData,
      id: fileId || mediaParams?.id, // Use synchronized fileId if large
      type: mediaParams?.type || "text",
      message: mediaParams ? (mediaParams.imageUrl || mediaParams.videoUrl || mediaParams.documentUrl) : textToSend,
      caption: mediaParams ? textToSend : null,
      fromUserId: myProfile.id,
    }, myProfile.id, chunksRef, "me");
    
    // Ensure the ID is exactly what we need for tracking
    if (fileId) msgObj.id = fileId;

    setMessagesData(prev => {
      const newList = [...(prev[chatIdString] || []), msgObj];
      db.saveMessages(myProfile.id, chatIdString, newList).catch(console.error);
      return { ...prev, [chatIdString]: newList };
    });

    const previewText = textToSend || (msgObj.type === 'image' ? '📷 Photo' : msgObj.type === 'video' ? '🎥 Video' : msgObj.type === 'document' ? '📄 Document' : 'Message');
    setContacts(prev => {
      const updated = prev.map(c => String(c.id) === chatIdString || c.email === chatIdString ? { ...c, message: previewText, time: msgObj.time } : c);
      db.saveContacts(myProfile.id, updated).catch(console.error);
      return updated;
    });
    
    if (socket) {
      const isEmail = typeof activeChat === 'string' && activeChat.includes('@');
      const mediaContent = mediaParams ? (mediaParams.imageUrl || mediaParams.videoUrl || mediaParams.documentUrl) : null;
      const finalSocketMessage = mediaContent || textToSend || "";
      const magicMetadata = mediaParams ? `[MEDIA_JSON]:${JSON.stringify({ ...mediaData, type: mediaParams.type, caption: textToSend })}` : null;

      // PRESERVE TIME & SYNC: Explicitly include original source data
      const payload = { 
        id: msgObj.id, // Explicit ID to help receiver match chunks/replacements
        fromUserId: myProfile.id, 
        fromName: myProfile.name,      // SYNC: Sender info for receiver
        fromAvatar: myProfile.avatar,  // SYNC: Profile photo for receiver
        [isEmail ? 'toEmail' : 'toUserId']: activeChat, 
        message: finalSocketMessage, 
        metadata: magicMetadata, 
        type: mediaParams?.type || "text", 
        fileName: mediaParams?.documentName || null, 
        time: msgObj.time,
        timestamp: msgObj.timestamp,
        ...mediaData 
      };

      const targetId = String(activeChat);
      const targetContact = contacts.find(c => String(c.id) === targetId);

      // OFFLINE QUEUING: Save to DB if contact is offline
      if (!socket.connected || (targetContact && !targetContact.online)) {
        console.log(`Target ${targetId} is offline. Message queued.`);
        db.savePendingMessage(payload).catch(console.error);
        return;
      }

      // ONLINE SENDING: Dispatch through unified sender
      // This now handles images up to 10MB as single messages ("bloob" style)
      dispatchSocketMessage(socket, payload);
    }
  };

  const handleAttachmentSubmit = async (e, type, setMessageInput) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    for (const file of files) {
       const isVideo = file.type.startsWith('video/');
       const isImage = file.type.startsWith('image/');
       const reader = new FileReader();
       reader.onload = async (event) => {
         let base64 = event.target.result;
         if (isImage) { base64 = await compressImage(base64); handleSendMessage("", setMessageInput, { type: "image", imageUrl: base64 }); }
         else if (isVideo) { handleSendMessage("", setMessageInput, { type: "video", videoUrl: base64 }); }
         else { handleSendMessage("", setMessageInput, { type: "document", documentUrl: base64, documentName: file.name }); }
       };
       reader.readAsDataURL(file);
    }
    // Clear input so the same file can be re-selected if needed
    e.target.value = "";
  };

  return { socket, contacts, messagesData, handleSendMessage, handleAttachmentSubmit, uploadProgress, setUploadProgress, setContacts, setMessagesData };
};
