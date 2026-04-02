import React from 'react';
import EmojiPicker from 'emoji-picker-react';
import { SendIcon } from "./ChatIcons";

export const ChatWindowHeader = ({ currentContact, setShowContactInfo, showContactInfo }) => (
  <div className="h-[88px] border-b border-gray-800/60 px-8 flex items-center justify-between flex-shrink-0 bg-[#0B0F19]/60 backdrop-blur-2xl z-20 shadow-sm relative">
    <div
      className="flex items-center gap-4 cursor-pointer group"
      onClick={() => setShowContactInfo(!showContactInfo)}
    >
      <div className="relative">
        {currentContact.avatar?.length <= 2 ? (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center text-white font-bold text-xl shadow-md ring-2 ring-transparent group-hover:ring-indigo-500 transition-all duration-300">
            {currentContact.avatar}
          </div>
        ) : (
          <img src={currentContact.avatar} alt={currentContact.name} className="w-12 h-12 rounded-full shadow-md object-cover ring-2 ring-transparent group-hover:ring-indigo-500 transition-all duration-300" />
        )}
        {currentContact.online && (
          <div className="absolute bottom-0 right-[-2px] w-3.5 h-3.5 bg-green-500 border-2 border-[#0B0F19] rounded-full shadow-sm"></div>
        )}
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-100 tracking-wide group-hover:text-indigo-400 transition-colors drop-shadow-sm">{currentContact.name}</h2>
        <span className={`text-sm font-medium ${currentContact.online ? 'text-green-400' : 'text-gray-500'}`}>
          {currentContact.online ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
    <div className="flex items-center gap-3 text-gray-400">
      <button className="p-2.5 bg-gray-800/40 hover:bg-gray-700/60 hover:text-white rounded-xl transition-all shadow-sm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.35 2 2 0 0 1 3.61 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.12-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      </button>
      <button className="p-2.5 bg-gray-800/40 hover:bg-gray-700/60 hover:text-white rounded-xl transition-all shadow-sm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
      </button>
      <div className="w-px h-6 bg-gray-700 mx-1"></div>
      <button 
        onClick={() => setShowContactInfo(!showContactInfo)}
        className="p-2.5 hover:bg-gray-800 hover:text-white rounded-xl transition-all"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="5" r="1.5"></circle><circle cx="12" cy="19" r="1.5"></circle></svg>
      </button>
    </div>
  </div>
);

export const MessageBubble = ({ msg, currentContact, setViewingMedia }) => {
  const isEmojiOnly = msg.text && /^(\p{Extended_Pictographic}|\p{Emoji_Modifier}|\u200D|\uFE0F|\s)+$/u.test(msg.text) && !msg.imageUrl && !msg.videoUrl && !msg.documentUrl && !/[a-zA-Z0-9]/.test(msg.text);

  return (
    <div key={msg.id} className={`flex w-full ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex max-w-[70%] ${msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
        {msg.sender === 'them' && (
          <div className="flex-shrink-0 mt-auto mr-3">
             {currentContact.avatar?.length <= 2 ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  {currentContact.avatar}
                </div>
              ) : (
                <img src={currentContact.avatar} alt="avatar" className="w-8 h-8 rounded-full shadow-md object-cover" />
              )}
          </div>
        )}
        <div className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-3.5 rounded-[22px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all hover:scale-[1.005] overflow-hidden flex flex-col relative ${msg.sender === 'me'
            ? 'bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 text-white border-t border-indigo-400/20 shadow-indigo-500/10'
            : 'bg-white/[0.05] backdrop-blur-2xl text-gray-100 border border-white/10 hover:bg-white/[0.08] shadow-black/20'
            } ${isEmojiOnly || (!msg.text && (msg.imageUrl || msg.videoUrl)) ? '!bg-transparent !shadow-none !border-none !p-0' : ''}`}>

            {/* Loading State */}
            {msg.type === 'loading' && (
              <div className="flex flex-col items-center justify-center p-6 bg-white/5 border border-indigo-500/20 rounded-2xl min-w-[220px]">
                <div className="relative mb-3">
                  <div className="w-12 h-12 border-4 border-indigo-500/10 border-t-indigo-400 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[9px] font-black text-indigo-400">{msg.progress}%</span>
                  </div>
                </div>
                <p className="text-xs font-black text-indigo-300 tracking-tight text-center">Receiving Content...</p>
                <div className="w-full h-1.5 bg-gray-800 rounded-full mt-4 overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500" style={{ width: `${msg.progress}%` }}></div>
                </div>
              </div>
            )}

            {/* Image */}
            {msg.imageUrl && !msg.imageUrl.startsWith('data:video/') && (
              <img
                src={msg.imageUrl} alt="attachment"
                onClick={() => setViewingMedia({ type: 'image', url: msg.imageUrl })}
                className={`max-w-[240px] sm:max-w-xs rounded-[20px] object-cover border border-white/10 shadow-2xl cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${msg.text ? 'mb-2 mt-1' : ''}`}
                onError={(e) => { e.target.style.display = 'none'; e.target.insertAdjacentHTML('afterend', '<div class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-xs text-center min-w-[200px]">📷 Image failed to load</div>'); }}
              />
            )}

            {/* Video */}
            {msg.videoUrl && (
              <div className="relative group cursor-pointer" onClick={() => setViewingMedia({ type: 'video', url: msg.videoUrl })}>
                <video preload="metadata" className={`max-w-[240px] sm:max-w-xs rounded-[20px] border border-white/10 shadow-2xl ${msg.text ? 'mb-2 mt-1' : ''}`}>
                  <source src={msg.videoUrl} />
                </video>
                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-1"><path d="M8 5v14l11-7z"></path></svg>
                  </div>
                </div>
              </div>
            )}

            {/* Document */}
            {msg.documentUrl && (
              <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/10 mb-1 max-w-[260px] sm:max-w-[300px]">
                <div className="w-10 h-10 shrink-0 bg-indigo-500/20 text-indigo-100 flex items-center justify-center rounded-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                </div>
                <div className="overflow-hidden text-white">
                  <p className="text-[13px] font-bold truncate drop-shadow-md">{msg.documentName || "File"}</p>
                  <a href={msg.documentUrl} download={msg.documentName || "file"} className="text-[10px] font-black uppercase tracking-widest text-[#a5b4fc] hover:text-white mt-1 inline-block transition-colors">Download</a>
                </div>
              </div>
            )}

            {/* Text Message */}
            {msg.text && (
              <div className={`leading-relaxed break-words tracking-wide flex flex-col ${isEmojiOnly ? 'text-[50px] leading-tight drop-shadow-sm active:scale-110 transition-transform' : 'text-[14.5px]'} ${!msg.imageUrl && !msg.videoUrl && !msg.documentUrl ? '' : 'px-1 pb-1'}`}>
                <span className={isEmojiOnly ? "emoji-native" : ""} style={isEmojiOnly ? { color: 'initial', filter: 'none' } : {}}>{msg.text}</span>
              </div>
            )}

            {/* Time inside bubble (WhatsApp/Telegram Style) */}
            {!isEmojiOnly && (
              <div className={`flex justify-end -mt-1 opacity-50 ${msg.sender === 'me' ? 'text-white/80' : 'text-gray-400'}`}>
                <span className="text-[9px] font-black uppercase tracking-widest">{msg.time}</span>
              </div>
            )}
          </div>
          {isEmojiOnly && <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1 px-1">{msg.time}</span>}
        </div>
      </div>
    </div>
  );
};

export const MessageList = ({ currentMessages, currentContact, setViewingMedia, messagesEndRef }) => (
  <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 z-10" style={{ scrollbarWidth: "none" }}>
    {currentMessages.map((msg) => (
      <MessageBubble key={msg.id} msg={msg} currentContact={currentContact} setViewingMedia={setViewingMedia} />
    ))}
    <div ref={messagesEndRef} />
  </div>
);

export const ChatInputArea = ({ 
  messageInput, setMessageInput, handleSendMessage, 
  showEmojiPicker, setShowEmojiPicker, settings,
  showAttachmentMenu, setShowAttachmentMenu,
  fileInputRef, imageInputRef, handleAttachmentSubmit
}) => (
  <div className="p-6 bg-gradient-to-t from-[#090d16] via-[#0B0F19]/90 to-transparent flex flex-col justify-end z-20">
    <div className="w-full max-w-4xl mx-auto bg-[#171f2d]/80 backdrop-blur-2xl border border-gray-700/60 rounded-3xl flex items-center px-3 py-3 shadow-2xl focus-within:ring-2 ring-fuchsia-500/40 focus-within:bg-[#1a2333]/90 transition-all duration-300">
      
      {/* Attachments */}
      <div className="relative">
        <button
          onClick={(e) => { e.stopPropagation(); setShowAttachmentMenu(!showAttachmentMenu); }}
          className={`transition-colors p-2.5 rounded-2xl hover:bg-gray-800/60 flex items-center justify-center ${showAttachmentMenu ? 'text-fuchsia-400 bg-gray-800/60' : 'text-gray-400 hover:text-fuchsia-400'}`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
        </button>
        {showAttachmentMenu && (
          <div onClick={(e) => e.stopPropagation()} className="absolute bottom-full left-0 mb-4 w-56 bg-[#1F2937] border border-gray-700 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in-up origin-bottom-left">
            <button onClick={() => { fileInputRef.current?.click(); setShowAttachmentMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-white rounded-xl transition-all">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg></div>
              Document
            </button>
            <button onClick={() => { imageInputRef.current?.click(); setShowAttachmentMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-200 hover:bg-gray-800 hover:text-white rounded-xl transition-all mt-1">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></div>
              Photos & Videos
            </button>
          </div>
        )}
      </div>

      <input type="file" ref={fileInputRef} className="hidden" multiple onChange={(e) => handleAttachmentSubmit(e, 'document')} />
      <input type="file" accept="image/*,video/*" ref={imageInputRef} className="hidden" multiple onChange={(e) => handleAttachmentSubmit(e, 'media')} />

      <input
        type="text" placeholder="Type a message..."
        className="bg-transparent outline-none flex-1 px-4 text-gray-100 placeholder-gray-500 font-medium text-[15px] h-full"
        value={messageInput} onChange={(e) => setMessageInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
      />

      {/* Emoji Picker */}
      <div className="relative">
        <button
          onClick={(e) => { e.stopPropagation(); setShowEmojiPicker(!showEmojiPicker); }}
          className={`transition-colors p-2.5 mr-2 rounded-2xl flex items-center justify-center ${showEmojiPicker ? 'text-amber-400 bg-gray-800/60' : 'text-gray-400 hover:text-amber-400 hover:bg-gray-800/60'}`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
        </button>
        {showEmojiPicker && (
          <div onClick={(e) => e.stopPropagation()} className="absolute bottom-full right-0 mb-4 z-50 animate-fade-in-up origin-bottom-right drop-shadow-2xl">
            <EmojiPicker theme={settings.darkMode ? 'dark' : 'light'} onEmojiClick={(emojiData) => setMessageInput(prev => prev + emojiData.emoji)} />
          </div>
        )}
      </div>

      {/* Send Button */}
      <button onClick={() => handleSendMessage()} className="w-11 h-11 bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-500 rounded-2xl flex items-center justify-center text-white hover:from-fuchsia-400 hover:to-amber-400 shadow-lg shadow-rose-500/30 transition-all transform hover:scale-105 active:scale-95 border-t border-fuchsia-400/30">
        <SendIcon />
      </button>
    </div>
  </div>
);
