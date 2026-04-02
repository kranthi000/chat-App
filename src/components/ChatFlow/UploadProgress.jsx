import React from 'react';

/**
 * Animated progress indicator for large file uploads.
 */
const UploadProgress = ({ uploadProgress }) => {
  if (!uploadProgress) return null;

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[100] w-64 bg-gray-900/90 border border-indigo-500/30 backdrop-blur-xl rounded-2xl p-4 shadow-2xl animate-bounce-in">
       <div className="flex items-center justify-between mb-2">
         <p className="text-xs font-bold text-indigo-300">Sending {uploadProgress.name}...</p>
         <p className="text-[10px] text-gray-500">{Math.round((uploadProgress.current / uploadProgress.total) * 100)}%</p>
       </div>
       <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
         <div 
           className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
           style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
         />
       </div>
    </div>
  );
};

export default UploadProgress;
