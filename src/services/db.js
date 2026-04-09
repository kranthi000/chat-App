// IndexedDB Service for Local Chat Persistence
// Handles contacts and message history with no storage limits.

const DB_NAME = "ChatAppDB";
const DB_VERSION = 6; // Offline messaging support

/**
 * Initialize/Get the IndexedDB database instance
 */
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
      reject(event.target.error);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Force refresh schemas if upgrading to v5
      if (db.objectStoreNames.contains("contacts")) db.deleteObjectStore("contacts");
      if (db.objectStoreNames.contains("messages")) db.deleteObjectStore("messages");

      // Store for contacts: { userId, contacts: [...] }
      db.createObjectStore("contacts", { keyPath: "userId" });

      // Store for messages: { compositeId, messages: [...] }
      db.createObjectStore("messages", { keyPath: "compositeId" });

      // Store for pending messages (not yet confirmed by socket)
      db.createObjectStore("pending", { keyPath: "id" });
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
};

/**
 * Save contacts for a specific user
 */
export const saveContacts = async (userId, contacts) => {
  if (!userId) return;
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["contacts"], "readwrite");
    const store = transaction.objectStore("contacts");
    const data = { userId, contacts };
    if (!data.userId) return reject(new Error("userId is required for local storage"));
    const request = store.put(data);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get contacts for a specific user
 */
export const getContacts = async (userId) => {
  if (!userId) return [];
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["contacts"], "readonly");
    const store = transaction.objectStore("contacts");
    const request = store.get(userId);
    request.onsuccess = () => resolve(request.result?.contacts || []);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Save messages between current user and a specific contact
 */
export const saveMessages = async (userId, contactId, messages) => {
  if (!userId || !contactId) return;
  const db = await initDB();
  const compositeId = `${userId}_${contactId}`;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["messages"], "readwrite");
    const store = transaction.objectStore("messages");
    const data = { compositeId, messages };
    if (!data.compositeId) return reject(new Error("compositeId is required for local storage"));
    const request = store.put(data);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get messages between current user and a specific contact
 */
export const getMessages = async (userId, contactId) => {
  if (!userId || !contactId) return [];
  const db = await initDB();
  const compositeId = `${userId}_${contactId}`;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["messages"], "readonly");
    const store = transaction.objectStore("messages");
    const request = store.get(compositeId);
    request.onsuccess = () => resolve(request.result?.messages || []);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Save a message to the pending queue
 */
export const savePendingMessage = async (msg) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const request = store.put(msg);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get all pending messages
 */
export const getPendingMessages = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["pending"], "readonly");
    const store = transaction.objectStore("pending");
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Delete a message from the pending queue
 */
export const deletePendingMessage = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const request = store.delete(id);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Clear all data from IndexedDB
 */
export const clearAllData = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["contacts", "messages", "pending"], "readwrite");
    transaction.oncomplete = () => resolve(true);
    transaction.onerror = (event) => reject(event.target.error);

    transaction.objectStore("contacts").clear();
    transaction.objectStore("messages").clear();
    transaction.objectStore("pending").clear();
  });
};

