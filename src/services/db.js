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

      // Store for pending: { id (auto), toUserId, payload }
      db.createObjectStore("pending", { keyPath: "id", autoIncrement: true });
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });
};

/**
 * Save contacts for a specific user
 * @param {string} userId
 * @param {Array} contacts
 */
export const saveContacts = async (userId, contacts) => {
  if (!userId) return;
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["contacts"], "readwrite");
    const store = transaction.objectStore("contacts");
    
    // Ensure userId is strictly present in the object
    const data = { userId, contacts };
    console.log("DB: Saving contacts for userId:", userId, data);
    if (!data.userId) return reject(new Error("userId is required for local storage"));
    
    const request = store.put(data);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get contacts for a specific user
 * @param {string} userId
 * @returns {Array}
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
 * @param {string} userId 
 * @param {string} contactId 
 * @param {Array} messages 
 */
export const saveMessages = async (userId, contactId, messages) => {
  if (!userId || !contactId) return;
  const db = await initDB();
  const compositeId = `${userId}_${contactId}`;
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["messages"], "readwrite");
    const store = transaction.objectStore("messages");
    
    // Ensure compositeId is strictly present in the object
    const data = { compositeId, messages };
    console.log("DB: Saving messages for compositeId:", compositeId, data);
    if (!data.compositeId) return reject(new Error("compositeId is required for local storage"));

    const request = store.put(data);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get messages between current user and a specific contact
 * @param {string} userId 
 * @param {string} contactId 
 * @returns {Array}
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
 * @param {object} payload - The socket payload to be sent later
 */
export const savePendingMessage = async (payload) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const request = store.add({
      toUserId: String(payload.toUserId || payload.toEmail),
      payload,
      timestamp: Date.now()
    });
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};

/**
 * Get all pending messages for a specific recipient
 * @param {string} toUserId 
 */
export const getPendingMessages = async (toUserId) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["pending"], "readonly");
    const store = transaction.objectStore("pending");
    const results = [];

    // Use a cursor to find all pending messages for this user
    const request = store.openCursor();
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        if (String(cursor.value.toUserId) === String(toUserId)) {
          results.push(cursor.value);
        }
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    request.onerror = () => reject(request.error);
  });
};

/**
 * Delete a message from the pending queue after it's sent
 * @param {number} id - The auto-incremented ID of the pending message
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
