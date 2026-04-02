import React from 'react';

/**
 * Full-screen media viewer for images and videos with glassmorphic styling.
 */
const MediaLightbox = ({ media, onClose }) => {
  if (!media) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 overflow-hidden animate-zoom-in"
      onClick={onClose}
    >
      <div className="absolute top-6 right-6 flex items-center gap-4">
         {media.url && (media.type === 'image' || media.type === 'document') && (
           <a 
             href={media.url} 
             download 
             title="Download"
             className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10"
             onClick={e => e.stopPropagation()}
           >
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
           </a>
         )}
         <button 
           onClick={onClose}
           className="p-3 bg-red-500/20 hover:bg-red-500/40 text-red-100 rounded-full transition-all border border-red-500/20"
         >
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
         </button>
      </div>
      
      <div 
        className="w-full h-full flex items-center justify-center pointer-events-none"
        onClick={e => e.stopPropagation()}
      >
        {media.type === 'image' ? (
          <img 
            src={media.url} 
            alt="fullscreen" 
            className="max-h-full max-w-full object-contain shadow-2xl rounded-lg pointer-events-auto select-none" 
          />
        ) : media.type === 'video' ? (
          <video 
            controls 
            autoPlay 
            className="max-h-full max-w-full shadow-2xl rounded-lg pointer-events-auto"
          >
            <source src={media.url} />
          </video>
        ) : (
          <div className="bg-white/5 p-12 rounded-3xl border border-white/10 text-center pointer-events-auto">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 text-indigo-400 opacity-50"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            <p className="text-xl text-gray-300">File view not supported</p>
            <a href={media.url} download className="mt-4 inline-block px-6 py-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 transition-colors">Download Anyway</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaLightbox;
