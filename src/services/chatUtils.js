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

          // PROGRESS: Ensure we always update progress if not complete
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

          // FULL VERIFICATION: Ensure NO chunks are missing before reassembly
          const allChunksPresent = chunksRef.current[fileId].chunks.every(c => c !== null);
          if (!allChunksPresent) {
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
          const fullBase64 = chunksRef.current[fileId].chunks.join("");
          source.id = fileId; 
          source.contentHash = `CHASH_${fileId}`; // Link full message to the chunks
          
          // CONVERT TO BLOB FOR RELIABILITY (Especially for large videos/images)
          try {
            const parts = fullBase64.split(";base64,");
            const contentType = parts[0].replace("data:", "");
            const byteCharacters = atob(parts[1]);
            const byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
              const slice = byteCharacters.slice(offset, offset + 512);
              const byteNumbers = new Array(slice.length);
              for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }
            const blob = new Blob(byteArrays, { type: contentType });
            source.message = URL.createObjectURL(blob);
          } catch (e) {
            console.warn("Blob conversion failed, falling back to base64", e);
            source.message = fullBase64;
          }
          
          if (source.type === "image") source.imageUrl = source.message;
          else if (source.type === "video") source.videoUrl = source.message;
          else if (source.type === "document") source.documentUrl = source.message;

          delete chunksRef.current[fileId];
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

  // STABLE CONTENT HASH: Use content snippet for deduplication
  const contentSnippet = isBlob 
    ? `BLOB_${source.message.size}_${source.message.type}` 
    : messageContent.substring(0, 100).replace(/\s/g, '');
  const contentHash = `CHASH_${source.fromUserId}_${finalType}_${contentSnippet}`;
  
  // FINGERPRINTING: Create a stable ID if the server didn't provide one.
  const isChunk = typeof source.message === "string" && source.message.startsWith("[FILE_CHUNK:");
  if (isChunk && source.id) {
     return {
        ...source,
        id: String(source.id),
        contentHash,
        text: source.caption || null,
        sender: isMe ? "me" : "them",
        time: source.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: source.createdAt || Date.now(),
        type: finalType,
        imageUrl: finalType === "image" ? resolveMediaURL(img) : null,
        videoUrl: finalType === "video" ? resolveMediaURL(vid) : null,
        documentUrl: finalType === "document" ? resolveMediaURL(doc) : null,
        documentName: source.documentName || source.fileName || source.name || "File",
     };
  }

  // Stable Hash: Quantize time to nearest 100ms for text to be super responsive.
  const isMediaMsg = finalType === "image" || finalType === "video" || finalType === "document";
  const timeFingerprint = isMediaMsg ? Math.floor(Date.now() / 1000) : Date.now(); 
  const randomTag = Math.floor(Math.random() * 10000);
  const fingerprint = `FP_${source.fromUserId}_${timeFingerprint}_${randomTag}_${contentSnippet.substring(0, 20)}`;
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
