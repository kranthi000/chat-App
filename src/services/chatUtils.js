import { BASE_URL } from "./service";

/**
 * Utility: Image Compression (Ensures photos stay under ~500KB)
 */
export const compressImage = (base64) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      // Limit to 1600px max (HD)
      let w = img.width;
      let h = img.height;
      const max = 1600;
      if (w > max || h > max) {
        if (w > h) { h = Math.round((h * max) / w); w = max; }
        else { w = Math.round((w * max) / h); h = max; }
      }
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      // high quality 0.85
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => resolve(base64); // Fallback to original
    img.src = base64;
  });
};

/**
 * Utility: Media Resolver (Handles Base64, Buffers, and relative paths)
 */
export const resolveMediaURL = (path, name = null) => {
  if (!path) return name ? name.charAt(0).toUpperCase() : null;
  
  // Handle MongoDB Buffer object structure
  if (typeof path === 'object' && (path.contentType || path.data)) {
    try {
      const contentType = path.contentType || 'image/jpeg';
      const data = path.data?.data || path.data || path;
      
      if (Array.isArray(data)) {
        const bytes = new Uint8Array(data);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return `data:${contentType};base64,${btoa(binary)}`;
      }
    } catch (e) {
      console.error("Binary conversion error:", e);
    }
  }

  if (typeof path === "string" && path.length > 2) {
    if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("blob:")) return path;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${BASE_URL}/${cleanPath}`;
  }

  return name ? name.charAt(0).toUpperCase() : null;
};

/**
 * Unified Mapper: Standardizes all incoming/outgoing message objects
 * for consistent rendering across the whole app.
 */
export const mapMessageData = (data, myProfileId, chunksRef, senderOverride = null) => {
  let source = { ...data };
  
  // FAIL-SAFE: Check for CHUNKED payload (Special Protocol)
  const chunkTag = "[FILE_CHUNK:";
  if (typeof data.message === "string" && data.message.startsWith(chunkTag)) {
    try {
      const header = data.message.substring(0, data.message.indexOf("]:"));
      const payload = data.message.substring(data.message.indexOf("]:") + 2);
      const parts = header.replace(chunkTag, "").split(":");
      const fileId = parts[0];
      const index = parseInt(parts[1]);
      const total = parseInt(parts[2]);

      if (chunksRef && chunksRef.current) {
        if (!chunksRef.current[fileId]) {
          chunksRef.current[fileId] = { chunks: new Array(total).fill(null), count: 0, total };
        }
        
        if (!chunksRef.current[fileId].chunks[index]) {
          chunksRef.current[fileId].chunks[index] = payload;
          chunksRef.current[fileId].count++;
        }

        const chunkSender = senderOverride === "me" ? "me" : (String(data.fromUserId) === String(myProfileId) ? "me" : "them");
        const chunkTime = source.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (chunksRef.current[fileId].count < total) {
          return {
            id: fileId,
            contentHash: `CHASH_${fileId}`,
            type: "loading",
            progress: Math.round((chunksRef.current[fileId].count / total) * 100),
            sender: chunkSender,
            time: chunkTime,
            timestamp: Date.now()
          };
        }

        // REASSEMBLE
        const allChunksPresent = chunksRef.current[fileId].chunks.every(c => c !== null);
        if (allChunksPresent) {
          const fullBase64 = chunksRef.current[fileId].chunks.join("");
          const originalType = source.type || "image"; // Fallback to image if missing
          source.id = fileId; 
          source.contentHash = `CHASH_${fileId}`; 
          
          try {
            const parts = fullBase64.split(";base64,");
            if (parts.length === 2) {
              const contentType = parts[0].replace("data:", "");
              const b64 = parts[1];
              const byteCharacters = atob(b64);
              const byteArrays = [];
              for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
                const slice = byteCharacters.slice(offset, offset + 1024);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i);
                byteArrays.push(new Uint8Array(byteNumbers));
              }
              const blob = new Blob(byteArrays, { type: contentType });
              const url = URL.createObjectURL(blob);
              source.message = url;
              if (originalType === "image") source.imageUrl = url;
              else if (originalType === "video") source.videoUrl = url;
              else if (originalType === "document" || originalType === "file") source.documentUrl = url;
            } else {
              source.message = fullBase64;
              if (originalType === "image") source.imageUrl = fullBase64;
            }
          } catch (e) {
            console.warn("Reassembly detail error:", e);
            source.message = fullBase64;
          }
          delete chunksRef.current[fileId];
        }
      }
    } catch (e) {
      console.error("Chunk reassembly error:", e);
    }
  }

  const isMe = senderOverride === "me" || (String(source.fromUserId) === String(myProfileId));
  const rawType = source.type || source.msgType || "text";
  const msgType = rawType === "file" ? "document" : rawType;
  
  const isBlob = source.message instanceof Blob || (source.message && typeof source.message === 'object' && source.message.size > 0);
  const messageContent = isBlob ? "" : String(source.message || source.text || "");
  const isImageBase64 = messageContent.startsWith("data:image/") || messageContent.includes("video/quicktime");
  const isVideoBase64 = messageContent.startsWith("data:video/");
  const isDocumentBase64 = messageContent.startsWith("data:application/") || messageContent.startsWith("data:text/");
  const isUrl = messageContent.startsWith("http") || messageContent.startsWith("blob:");
  
  // URL MEMOIZATION: Don't recreate blob URLs if they already exist in source
  let img = source.imageUrl || (isImageBase64 ? messageContent : null) || (msgType === "image" && (isUrl || isBlob) ? (isBlob ? (source.imageUrl || URL.createObjectURL(source.message)) : messageContent) : null);
  let vid = source.videoUrl || (isVideoBase64 ? messageContent : null) || (msgType === "video" && (isUrl || isBlob) ? (isBlob ? (source.videoUrl || URL.createObjectURL(source.message)) : messageContent) : null);
  let doc = source.documentUrl || (isDocumentBase64 ? messageContent : null) || (msgType === "document" && (isUrl || isBlob) ? (isBlob ? (source.documentUrl || URL.createObjectURL(source.message)) : messageContent) : null);

  // If image contains video data (common bug when selecting from gallery)
  if (img && typeof img === 'string' && (img.startsWith('data:video/') || img.includes('video/quicktime'))) {
    vid = img;
    img = null;
  }
  
  const finalType = vid ? "video" : img ? "image" : doc ? "document" : "text"; 
  if (isBlob && !source.imageUrl && !source.videoUrl && !source.documentUrl) {
     const url = URL.createObjectURL(source.message);
     if (finalType === "video") vid = url;
     else if (finalType === "image") img = url;
     else if (finalType === "document") doc = url;
  }

  // STABLE CONTENT HASH: Use content snippet and timestamp for deduplication
  const contentSnippet = isBlob 
    ? `BLOB_${source.message.size}_${source.message.type}` 
    : messageContent.substring(0, 100).replace(/\s/g, '');
  
  // Use a more robust hash that includes timestamp if it's a new message
  // but allows for matching if it's the exact same content from the same sender in a short window.
  const contentHash = `CHASH_${source.fromUserId}_${finalType}_${contentSnippet.substring(0, 50)}`;
  
  // DETERMINISTIC FINGERPRINTING: (Bug Fix: Remove randomness to prevent multiple bubbles)
  const isMediaMsg = finalType === "image" || finalType === "video" || finalType === "document";
  const sourceTimestamp = source.createdAt || source.timestamp || Date.now();
  // Include timestamp in fingerprint for uniqueness per-message-even-from-same-sender
  const fingerprint = `FP_${source.fromUserId}_${finalType}_${sourceTimestamp}_${contentSnippet.substring(0, 20)}`;
  const finalId = String(source.id || source._id || fingerprint);

  return {
    ...source,
    id: finalId,
    contentHash,
    text: source.caption || (finalType === "text" ? source.message : null) || source.text || null,
    sender: isMe ? "me" : "them",
    time: source.time || new Date(source.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: source.createdAt || Date.now(),
    type: finalType,
    imageUrl: finalType === "image" ? resolveMediaURL(img) : null,
    videoUrl: finalType === "video" ? resolveMediaURL(vid) : null,
    documentUrl: finalType === "document" ? resolveMediaURL(doc) : null,
    documentName: source.documentName || source.fileName || source.name || "File",
  };
};
