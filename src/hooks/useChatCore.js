import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "../services/service";
import * as db from "../services/db";
import { mapMessageData } from "../services/chatUtils";

/**
 * Custom hook to manage the core chat logic, sockets, and unified state.
 */
export const useChatCore = (myProfile, setMyProfile, activeChat, setActiveChat, setAddUserStatus, setIsAddUserModalOpen, setAddUserEmail) => {
  const chunksRef = useRef({});
  const [socket, setSocket] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [messagesData, setMessagesData] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);

  const activeChatRef = useRef(activeChat);
  useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);

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

    // --- Sending Helper ---
    const dispatchSocketMessage = (payload) => {
      if (!newSocket) return;
      newSocket.emit("send-private-message", payload);
    };

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
        const list = prevMsgs[fromId] || [];
        const existingIdx = list.findIndex(m => String(m.id) === String(msgObj.id));
        
        let newList;
        if (existingIdx !== -1) {
          newList = [...list];
          newList[existingIdx] = { ...newList[existingIdx], ...msgObj, status: "delivered" };
        } else {
          newList = [...list, { ...msgObj, status: "delivered" }];
        }
        
        db.saveMessages(myProfile.id, fromId, newList).catch(console.error);
        return { ...prevMsgs, [fromId]: newList };
      });

      setContacts(prevContacts => {
        const existingById = prevContacts.find(c => String(c.id) === fromId);
        const existingByEmail = fromEmail ? prevContacts.find(c => String(c.id) === fromEmail || c.email === fromEmail) : null;
        
        const previewText = msgObj.type === 'loading' 
          ? `📥 Receiving ${msgObj.progress}%...` 
          : (msgObj.text || (msgObj.type === 'image' ? '📷 Photo' : msgObj.type === 'video' ? '🎥 Video' : msgObj.type === 'document' ? '📄 Document' : 'Message'));

        if (existingById) {
          return prevContacts.map(c => String(c.id) === fromId ? { ...c, message: previewText, time: "Just now", online: true, unread: (String(activeChatRef.current) === fromId ? c.unread : (c.unread || 0) + 1) } : c);
        } else if (existingByEmail) {
          const oldId = String(existingByEmail.id);
          if (String(activeChatRef.current) === oldId) setActiveChat(fromId);
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

    newSocket.on("message-failed", (data) => {
      console.error("Action Failed:", data);
      setAddUserStatus({ type: "error", msg: data.reason || "Search failed - User not found" });
    });

    newSocket.on("user-status", async (data) => {
      const isOnline = data.status === "online";
      const onlineIds = (data.onlineUsers && Array.isArray(data.onlineUsers)) 
        ? new Set(data.onlineUsers.map(id => String(id))) 
        : null;

      setContacts(prev => prev.map(c => {
        const contactId = String(c.id);
        if (data.userId && contactId === String(data.userId)) {
          return { ...c, online: isOnline, avatar: data.avatar || data.profileImage || c.avatar, name: data.name || c.name };
        } else if (onlineIds) {
          return { ...c, online: onlineIds.has(contactId) };
        }
        return c;
      }));
      
      if (data.userId && String(data.userId) === String(myProfile.id)) {
        setMyProfile(prev => ({ ...prev, status: data.status }));
      } else if (onlineIds && myProfile.id && onlineIds.has(String(myProfile.id))) {
        setMyProfile(prev => ({ ...prev, status: "online" }));
      }
    });
    
    newSocket.on("user-profile-updated", (data) => {
       setContacts(prev => prev.map(c => 
         String(c.id) === String(data.userId) 
           ? { ...c, name: data.name || c.name, avatar: data.avatar || c.avatar } 
           : c
       ));
    });

    return () => newSocket.close();
  }, [myProfile.id]); // Removed activeChat to prevent disconnects on switch

  // --- Handlers ---
  const handleSendMessage = useCallback(async (text, setInput, params = {}) => {
    const input = text || "";
    // Corrected check: allow sending if text is present OR if a message file content is in params.
    if (!input.trim() && !params.message && !params.imageUrl && !params.videoUrl && !params.documentUrl) return;

    const contactId = String(activeChat);
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
      const newList = [...(prev[contactId] || []), msgObj];
      db.saveMessages(myProfile.id, contactId, newList).catch(console.error);
      return { ...prev, [contactId]: newList };
    });

    if (setInput) setInput("");
    
    // Network Dispatch
    if (socket) {
      socket.emit("send-private-message", {
        fromUserId: myProfile.id,
        toUserId: String(activeChat),
        message: input,
        type: params.type || "text",
        ...params
      });
    }
  }, [activeChat, myProfile, socket]); // Simplified dependencies. messagesData moved to functional update.

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

  return { 
    socket, 
    contacts, 
    messagesData, 
    setContacts, 
    setMessagesData,
    handleSendMessage,
    handleAttachmentSubmit,
    uploadProgress
  };
};

