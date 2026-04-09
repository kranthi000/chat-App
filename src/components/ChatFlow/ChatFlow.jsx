import React, { useState, useEffect, useRef, memo, useMemo, useCallback } from "react";
import { useChatCore } from "../../hooks/useChatCore";
import * as db from "../../services/db";
import EmojiPicker from "emoji-picker-react";
import { 
  Search, 
  MoreVertical, 
  MessageSquare, 
  CircleDashed, 
  Smile, 
  Paperclip, 
  Mic, 
  Send, 
  ArrowLeft,
  X,
  Plus,
  Check,
  CheckCheck,
  UserPlus,
  FileBox,
  FileText,
  Menu,
  Settings,
  LogOut,
  ArrowRight
} from "lucide-react";

/**
 * MessageBubble: Memoized component for chat messages to prevent expensive re-renders.
 */
const MessageBubble = memo(({ msg, isMe }) => {
  return (
    <div className={`flex w-full group/msg animate-fade-in-up ${isMe ? 'justify-end pl-12' : 'justify-start pr-12'}`}>
      <div className={`relative max-w-full lg:max-w-[70%] p-3.5 rounded-3xl shadow-xl transition-all duration-300 ${
        isMe 
        ? 'bg-gradient-to-br from-[#00c978] to-[#00a896] text-white rounded-tr-none' 
        : 'bg-white/10 backdrop-blur-md text-white border border-white/5 rounded-tl-none'
      }`}>
        
        {/* Media Rendering */}
        <div className="space-y-2">
          {msg.type === 'text' && <p className="text-[14.5px] leading-relaxed break-words">{msg.text}</p>}
          {msg.type === 'image' && (
            <img src={msg.imageUrl} alt="media" className="max-w-full rounded-2xl shadow-lg hover:scale-[1.01] transition-transform duration-300 cursor-pointer" />
          )}
          {msg.type === 'video' && (
             <video src={msg.videoUrl} controls className="max-w-full rounded-2xl shadow-lg" />
          )}
          {msg.type === 'document' && (
            <div className="flex items-center gap-3 p-3 bg-black/20 rounded-2xl border border-white/5 group/doc transition-all cursor-pointer">
              <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl text-white/70 group-hover/doc:bg-[#00c978]/20 group-hover/doc:text-[#00c978] transition-all">
                <Paperclip size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{msg.documentName || "File Document"}</p>
                <p className="text-[10px] text-white/40">File</p>
              </div>
            </div>
          )}
        </div>

        {/* Timestamp & Status */}
        <div className={`flex items-center gap-1.5 mt-1 transition-all ${isMe ? 'justify-end' : 'justify-start'}`}>
          <span className="text-[10px] font-medium text-white/40">{msg.time}</span>
          {isMe && (
            <span className="flex items-center">
              {msg.status === 'sending' ? (
                <CircleDashed size={13} className="animate-spin text-white/20" />
              ) : msg.status === 'sent' ? (
                <Check size={15} className="text-white/40" strokeWidth={3} />
              ) : (
                <CheckCheck size={15} className="text-[#00c978]" strokeWidth={3} />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

/**
 * ContactItem: Memoized component for sidebar contacts.
 */
const ContactItem = memo(({ contact, isActive, onClick }) => {
  return (
    <div 
      onClick={() => onClick(contact.id)}
      className={`group relative flex items-center p-3 rounded-2xl cursor-pointer transition-all duration-300 ${
        isActive ? 'bg-[#00c978]/10 ring-1 ring-[#00c978]/20' : 'hover:bg-white/5'
      }`}
    >
      <div className="relative">
        <img 
          src={contact.avatar || `https://ui-avatars.com/api/?name=${contact.name}&background=random`} 
          alt={contact.name} 
          className="w-14 h-14 rounded-2xl object-cover" 
        />
        {contact.online && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#00c978] border-4 border-[#1e293b] rounded-full"></div>
        )}
      </div>
      
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className={`font-semibold truncate transition-colors ${isActive ? 'text-[#00c978]' : 'text-white'}`}>
            {contact.name || contact.email || "Unknown User"}
          </h3>
          <p className="text-[9px] text-white/20 font-mono truncate tracking-tight">{contact.id}</p>
          <span className="text-[11px] text-white/30 whitespace-nowrap ml-2">
            {contact.time || "Just now"}
          </span>
        </div>
        
        {contact.name && contact.email && contact.name !== contact.email && (
            <p className="text-[10px] text-white/40 truncate mt-0.5">{contact.email}</p>
        )}

        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-white/40 truncate pr-2">
            {contact.message || "Start a new conversation"}
          </p>
          {contact.unread > 0 && (
            <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-[#00c978] text-white text-[10px] font-bold rounded-full px-1 shadow-[0_0_12px_#00c97855]">
              {contact.unread}
            </span>
          )}
        </div>
      </div>
      
      {isActive && (
        <div className="absolute left-0 w-1 h-8 bg-[#00c978] rounded-full"></div>
      )}
    </div>
  );
});
const ChatFlow = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [myProfile, setMyProfile] = useState({ id: "", name: "", email: "", avatar: "" });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [addUserEmail, setAddUserEmail] = useState("");
  const [addUserStatus, setAddUserStatus] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const {
    contacts,
    messagesData,
    handleSendMessage,
    handleAttachmentSubmit,
    handleUpdateProfile,
    handleAddContact,
    handleRemoveContact,
    uploadProgress
  } = useChatCore(
    myProfile, 
    setMyProfile, 
    activeChat, 
    setActiveChat, 
    setAddUserStatus, 
    setIsAddUserModalOpen, 
    setAddUserEmail, 
    addUserEmail
  );

  // Sync edit state with profile
  useEffect(() => {
    if (myProfile) {
      setEditName(myProfile.name || "");
      setEditEmail(myProfile.email || "");
    }
  }, [myProfile]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData, activeChat]);

  // PERFORMANCE: Memoize filtered contacts to prevent unnecessary re-renders
  const filteredContacts = useMemo(() => {
    return contacts.filter(c => 
      c.name?.toLowerCase().includes(searchValue.toLowerCase()) || 
      c.email?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [contacts, searchValue]);

  const currentChatContact = useMemo(() => 
    contacts.find(c => String(c.id) === String(activeChat)),
    [contacts, activeChat]
  );

  const currentMessages = useMemo(() => 
    messagesData[activeChat] || [],
    [messagesData, activeChat]
  );

  const onSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      // CLEAR UI OPTIMISTICALLY: Move text first to prevent double-click issues
      const textToSend = inputValue;
      setInputValue("");
      setShowEmojiPicker(false);
      
      await handleSendMessage(textToSend);
    } catch (err) {
      console.error("Critical Send Error:", err);
      toast.error("Message failed to send. Please check connection.");
    }
  };

  const onEmojiClick = useCallback((emojiData) => {
    setInputValue(prev => prev + emojiData.emoji);
  }, []);

  const handleLogout = useCallback(() => {
     localStorage.clear();
     window.location.href = "/";
  }, []);

  const onUpdateProfile = useCallback(async () => {
    setIsSaving(true);
    const res = await handleUpdateProfile({ name: editName, email: editEmail });
    if (res.success) {
      setIsEditing(false);
    } else {
      alert("Failed to update profile: " + res.error);
    }
    setIsSaving(false);
  }, [handleUpdateProfile, editName, editEmail]);

  const handleAvatarChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      const res = await handleUpdateProfile({ avatar: base64 });
      if (!res.success) alert("Failed to update avatar");
    };
    reader.readAsDataURL(file);
  }, [handleUpdateProfile]);

  const onClearData = useCallback(async () => {
    if (window.confirm("Are you sure you want to clear all chat history and contacts? This cannot be undone.")) {
      await db.clearAllData();
      alert("All local data cleared successfully. Please reload the page to see changes.");
      window.location.reload();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center p-0 md:p-4 font-sans text-white overflow-hidden selection:bg-[#00c978]/30">
      
      {/* Main Dashboard Card */}
      <div className="w-full max-w-[1440px] h-[100vh] md:h-[92vh] bg-black/30 backdrop-blur-2xl border border-white/10 rounded-none md:rounded-[2.5rem] shadow-[0_24px_80px_rgba(0,0,0,0.6)] flex overflow-hidden relative animate-fade-in group">
        
        {/* Sidebar */}
        <aside className="w-80 md:w-[400px] flex-shrink-0 flex flex-col border-r border-white/5 bg-white/5 z-20">
          
          {/* Sidebar Header */}
          <header className="h-[72px] px-5 flex items-center justify-between border-b border-white/5 bg-white/5">
            <div 
              className="flex items-center gap-3 cursor-pointer group/avatar" 
              onClick={() => setIsProfileOpen(true)}
            >
              <div className="relative">
                <img 
                  src={myProfile.avatar || "https://ui-avatars.com/api/?name=" + (myProfile.name || "User") + "&background=00c978&color=fff"} 
                  alt="Me" 
                  className="w-11 h-11 rounded-2xl object-cover ring-2 ring-[#00c978]/30 group-hover/avatar:ring-[#00c978] transition-all duration-300" 
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00c978] border-2 border-[#1e293b] rounded-full animate-pulse"></div>
              </div>
              <div className="hidden lg:block overflow-hidden transition-all duration-300">
                <p className="text-xs font-bold text-white truncate max-w-[120px]">{myProfile.name || "User"}</p>
                <div className="flex flex-col">
                  <p className="text-[10px] text-[#00c978] truncate max-w-[120px] font-medium">{myProfile.email}</p>
                  <p className="text-[8px] text-white/20 font-mono tracking-tighter truncate max-w-[120px]">{myProfile.id}</p>
                </div>
              </div>

            </div>

            
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white">
                <CircleDashed size={22} />
              </button>
              <button 
                onClick={() => setIsAddUserModalOpen(true)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
              >
                <Plus size={22} />
              </button>
              <div className="relative">
                <button 
                   onClick={() => setShowDropdown(!showDropdown)}
                   className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
                >
                  <MoreVertical size={22} />
                </button>
                {showDropdown && (
                  <div className="absolute top-12 right-0 w-48 bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in duration-200">
                    <button className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl flex items-center gap-3 transition-colors">
                      <Settings size={18} className="text-white/40" /> Settings
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-red-500/10 text-red-400 rounded-xl flex items-center gap-3 transition-colors"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Sidebar Search */}
          <div className="p-4">
            <div className="relative group/search">
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within/search:text-[#00c978] transition-colors">
                 <Search size={18} />
               </div>
               <input 
                type="text" 
                placeholder="Search conversations" 
                className="w-full h-11 bg-white/5 rounded-2xl pl-12 pr-4 outline-none border border-transparent focus:border-[#00c978]/50 focus:bg-white/10 transition-all text-sm placeholder:text-white/20"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
            {filteredContacts.length > 0 ? (
              filteredContacts.map(contact => (
                <ContactItem 
                  key={contact.id}
                  contact={contact}
                  isActive={activeChat === contact.id}
                  onClick={setActiveChat}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center text-white/30">
                <div className="p-4 bg-white/5 rounded-3xl mb-4">
                  <UserPlus size={32} />
                </div>
                <p className="text-sm">No conversations found</p>
              </div>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col bg-[#0a0a0a]/40 relative overflow-hidden backdrop-blur-md">
          
          {/* Active Chat Header */}
          {activeChat && (
            <header className="h-[72px] px-6 flex items-center justify-between border-b border-white/5 bg-black/20 z-10">
              <div className="flex items-center gap-4 cursor-pointer group" onClick={() => {/* Extra detail? */}}>
                <div className="relative">
                  <img 
                    src={currentChatContact?.avatar || `https://ui-avatars.com/api/?name=${currentChatContact?.name}`} 
                    alt={currentChatContact?.name} 
                    className="w-11 h-11 rounded-2xl object-cover ring-1 ring-white/10 group-hover:ring-[#00c978]/50 transition-all" 
                  />
                  {currentChatContact?.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00c978] border-2 border-[#1e293b] rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-white group-hover:text-[#00c978] transition-colors">
                    {currentChatContact?.name || currentChatContact?.email || "Unknown User"}
                  </h2>
                  <div className="flex flex-col">
                    {currentChatContact?.email && currentChatContact?.name !== currentChatContact?.email && (
                      <span className="text-[11px] text-[#00c978] font-medium tracking-tight opacity-90">{currentChatContact.email}</span>
                    )}
                    <span className="text-[9px] text-white/30 font-mono tracking-tighter uppercase opacity-60">ID: {currentChatContact?.id}</span>
                    <span className="text-[11px] text-[#00c978]/80 flex items-center gap-1.5">
                      {currentChatContact?.online ? (
                         <><span className="w-1.5 h-1.5 rounded-full bg-[#00c978]"></span> Online</>
                      ) : "Offline"}
                    </span>
                  </div>

                </div>
              </div>
              
              <div className="flex items-center gap-2 text-white/50">
                <button className="p-2.5 hover:bg-white/10 rounded-xl transition-all hover:text-white"><Search size={20} /></button>
                <button className="p-2.5 hover:bg-white/10 rounded-xl transition-all hover:text-white"><MoreVertical size={20} /></button>
              </div>
            </header>
          )}

          {/* Message Feed */}
          {activeChat ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[url('https://wallpaper-house.com/data/out/10/wallpaper2you_426038.png')] bg-repeat bg-fixed bg-center opacity-90">
              <div className="absolute inset-0 bg-[#0a0a0a]/60 pointer-events-none"></div>
              
              <div className="relative z-10 space-y-4 flex flex-col">
                {currentMessages.map((msg, index) => (
                   <MessageBubble 
                      key={msg.id || `msg-${index}`} 
                      msg={msg} 
                      isMe={msg.sender === 'me'} 
                   />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          ) : (
            /* Empty State Dashboard */
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-transparent text-center">
               <div className="relative mb-12 animate-float">
                  <div className="absolute inset-0 bg-[#00c978]/20 blur-[60px] rounded-full"></div>
                  <div className="relative w-48 h-48 bg-gradient-to-br from-[#00c978]/20 to-transparent border border-white/10 backdrop-blur-3xl rounded-[3rem] flex items-center justify-center shadow-2xl">
                     <MessageSquare size={80} className="text-[#00c978] drop-shadow-[0_0_15px_#00c97855]" strokeWidth={1.5} />
                  </div>
               </div>
               
               <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
                 Welcome to ChatFlow
               </h1>
               <p className="text-white/40 max-w-md mx-auto mb-10 text-base leading-relaxed">
                 Connect with your family and friends privately. <br />
                 Search for anyone by email to start a vibrant conversation today!
               </p>

               <button 
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="group relative px-10 py-5 bg-gradient-to-r from-[#00c978] to-[#00a896] rounded-[2rem] font-bold text-lg shadow-[0_12px_48px_rgba(0,201,120,0.4)] hover:shadow-[0_16px_56px_rgba(0,201,120,0.6)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
               >
                  <div className="flex items-center gap-4 relative z-10">
                    <UserPlus size={24} />
                    <span>Search User by Email</span>
                  </div>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
               </button>
            </div>
          )}

          {/* Chat Input Area */}
          {activeChat && (
            <footer className="p-5 bg-black/40 backdrop-blur-xl border-t border-white/5 z-10">
              <form onSubmit={onSend} className="max-w-5xl mx-auto flex items-center gap-3">
                <div className="flex items-center gap-1 relative">
                   <div className="absolute bottom-16 left-0 z-50 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {showEmojiPicker && (
                        <EmojiPicker 
                          onEmojiClick={onEmojiClick}
                          theme="dark"
                          skinTonesDisabled
                          searchDisabled
                          width={320}
                          height={400}
                        />
                      )}
                   </div>
                   <button 
                     type="button" 
                     onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                     className={`p-3 transition-colors ${showEmojiPicker ? 'text-[#00c978]' : 'text-white/40 hover:text-[#00c978]'}`}
                   >
                     <Smile size={24} />
                   </button>
                   <label className="p-3 text-white/40 hover:text-[#00c978] transition-colors cursor-pointer" title="Share Media">
                      <Paperclip size={24} />
                      <input type="file" hidden multiple onChange={(e) => handleAttachmentSubmit(e, 'media', setInputValue)} accept="image/*,video/*" />
                   </label>
                   <label className="p-3 text-white/40 hover:text-[#00c978] transition-colors cursor-pointer" title="Share Document">
                      <FileText size={24} />
                      <input type="file" hidden multiple onChange={(e) => handleAttachmentSubmit(e, 'document', setInputValue)} accept=".pdf,.doc,.docx,.txt,.xls,.xlsx" />
                   </label>
                </div>
                
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Type a creative message..." 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setShowEmojiPicker(false)}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-[1.5rem] px-6 outline-none focus:border-[#00c978]/50 focus:bg-white/10 transition-all text-[15px] placeholder:text-white/20"
                  />
                </div>

                <button 
                  type="submit"
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                    inputValue.trim() 
                    ? 'bg-gradient-to-r from-[#00c978] to-[#00a896] text-white shadow-[#00c978]/30 hover:scale-110 active:scale-95' 
                    : 'bg-white/5 text-white/20 pointer-events-none opacity-50'
                  }`}
                >
                  {(inputValue.trim() || showEmojiPicker) ? <Send size={24} /> : <Mic size={24} />}
                </button>
              </form>
            </footer>
          )}
        </main>

        {/* Profile Sidebar (Gliding Drawer) */}
        <div className={`absolute top-0 left-0 w-80 md:w-[400px] h-full bg-[#111827] z-[60] shadow-2xl transition-transform duration-500 transform ${isProfileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
           <div className="h-[120px] bg-gradient-to-br from-[#00c978] to-[#00a896] p-6 flex flex-col justify-end relative">
              <button 
                onClick={() => { setIsProfileOpen(false); setIsEditing(false); }}
                className="absolute top-6 left-6 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-all"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold text-white">Profile</h1>
              <button 
                onClick={() => isEditing ? onUpdateProfile() : setIsEditing(true)}
                disabled={isSaving}
                className="absolute bottom-4 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white font-bold transition-all disabled:opacity-50"
              >
                {isSaving ? "Saving..." : isEditing ? "Save" : "Edit"}
              </button>
           </div>
           
           <div className="p-8 flex flex-col items-center gap-8 bg-[#0f172a] h-full overflow-y-auto pt-12 text-white">
              <div className="relative group/prof">
                 <div className="absolute inset-x-0 bottom-0 top-1/2 bg-[#00c978]/10 blur-[40px] rounded-full"></div>
                 <img 
                    src={myProfile.avatar || "https://ui-avatars.com/api/?name=" + (myProfile.name || "User") + "&background=00c978&color=fff"} 
                    alt="Profile" 
                    className="relative w-48 h-48 rounded-[2.5rem] object-cover ring-4 ring-white/10 group-hover/prof:ring-[#00c978] transition-all duration-500 shadow-2xl" 
                 />
                 <label className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-r from-[#00c978] to-[#00a896] rounded-2xl flex items-center justify-center shadow-xl border-4 border-[#111827] text-white hover:scale-110 transition-transform cursor-pointer">
                    <Plus size={20} />
                    <input type="file" hidden onChange={handleAvatarChange} accept="image/*" />
                 </label>
              </div>

              <div className="w-full space-y-6">
                 <div className="p-5 bg-white/5 rounded-3xl border border-white/5 group hover:border-[#00c978]/30 transition-all">
                    <p className="text-[11px] uppercase tracking-wider text-[#00c978] font-bold mb-1">Your Name</p>
                    {isEditing ? (
                       <input 
                         type="text" 
                         value={editName}
                         onChange={(e) => setEditName(e.target.value)}
                         className="w-full bg-transparent border-none outline-none text-lg text-white font-medium"
                         autoFocus
                       />
                    ) : (
                       <div className="flex justify-between items-center">
                          <p className="text-lg font-medium">{myProfile.name || "John Doe"}</p>
                          <Settings size={16} className="text-white/20 group-hover:text-[#00c978]/80 transition-colors" />
                       </div>
                    )}
                 </div>
                 
                 <div className="p-5 bg-white/5 rounded-3xl border border-white/5 group hover:border-[#00c978]/30 transition-all">
                    <p className="text-[11px] uppercase tracking-wider text-[#00c978] font-bold mb-1">About</p>
                    <p className="text-sm text-white/50 leading-relaxed italic">"Always evolving, one chat at a time."</p>
                 </div>

                 <div className="p-5 bg-white/5 rounded-3xl border border-white/5 group hover:border-[#00c978]/30 transition-all">
                    <p className="text-[11px] uppercase tracking-wider text-[#00c978] font-bold mb-1">Email Address</p>
                    {isEditing ? (
                       <input 
                         type="email" 
                         value={editEmail}
                         onChange={(e) => setEditEmail(e.target.value)}
                         className="w-full bg-transparent border-none outline-none text-sm text-white font-medium"
                       />
                    ) : (
                       <p className="text-sm font-medium">{myProfile.email}</p>
                    )}
                 </div>

                 <button 
                   onClick={onClearData}
                   className="w-full p-5 bg-red-500/10 hover:bg-red-500/20 rounded-3xl border border-red-500/20 text-red-400 text-sm font-bold transition-all flex items-center justify-center gap-3"
                 >
                    <X size={18} />
                    Clear All Chat Data
                 </button>
              </div>
              
              <p className="text-[10px] text-white/20 text-center w-full mt-auto pb-8">
                 Joined June 2024 • End-to-end encrypted
              </p>
           </div>
        </div>

        {/* Global Loading / Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="absolute top-0 left-0 h-1 bg-[#00c978] transition-all duration-300 z-[100]" style={{ width: `${uploadProgress}%` }}></div>
        )}

      </div>

      {/* New Chat / Search User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-xl animate-fade-in"
            onClick={() => setIsAddUserModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-md bg-[#1e293b]/50 border border-white/10 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden backdrop-blur-3xl animate-modal-pop">
             <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#00c978] to-[#00a896] shadow-[0_0_20px_rgba(0,201,120,0.4)]"></div>
             
             <div className="flex justify-between items-start mb-8">
                <div>
                   <h2 className="text-2xl font-black tracking-tight text-white">Join Chat</h2>
                   <p className="text-xs text-white/40 mt-1.5 font-medium italic">Discover friends by their email</p>
                </div>
                <button 
                   onClick={() => setIsAddUserModalOpen(false)}
                   className="p-3 bg-white/5 hover:bg-red-500/10 text-white/20 hover:text-red-400 rounded-2xl transition-all border border-white/5"
                >
                   <X size={20} />
                </button>
             </div>

             <div className="space-y-6">
                <div className="relative group">
                   <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#00c978] transition-all duration-300">
                      <Search size={22} className="group-focus-within:scale-110 transition-transform" />
                   </div>
                   <input 
                      type="email" 
                      placeholder="Enter user email..." 
                      className="w-full h-20 bg-black/40 border-2 border-white/5 rounded-3xl pl-16 pr-6 outline-none focus:border-[#00c978]/50 focus:bg-black/60 transition-all text-xl font-medium placeholder:text-white/5 shadow-inner"
                      value={addUserEmail}
                      onChange={(e) => setAddUserEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddContact(addUserEmail)}
                   />
                </div>

                {addUserStatus && (
                  <div className={`p-5 rounded-3xl flex items-center gap-4 animate-slide-in-right border ${
                    addUserStatus.type === 'error' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-[#00c978]/10 text-[#00c978] border-[#00c978]/20'
                  }`}>
                     <div className={`w-3 h-3 rounded-full bg-current ${addUserStatus.type === 'loading' ? 'animate-ping' : 'animate-pulse'}`}></div>
                     <span className="text-sm font-semibold tracking-wide uppercase">{addUserStatus.msg}</span>
                  </div>
                )}

                <button 
                  onClick={() => handleAddContact(addUserEmail)}
                  disabled={addUserStatus?.type === 'loading'}
                  className="group relative w-full h-20 bg-gradient-to-r from-[#00c978] to-[#00a896] text-white font-black text-xl rounded-3xl shadow-[0_15px_30px_rgba(0,201,120,0.3)] hover:shadow-[0_20px_40px_rgba(0,201,120,0.5)] hover:-translate-y-1.5 active:translate-y-0 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:translate-y-0"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <span className="relative flex items-center justify-center gap-3">
                     {addUserStatus?.type === 'loading' ? 'Connecting...' : 'Connect'}
                     {addUserStatus?.type !== 'loading' && <ArrowRight size={22} className="group-hover:translate-x-1.5 transition-transform" />}
                  </span>
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Tailwind Custom Layer for smooth scroll & animations */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 201, 120, 0.4);
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes slide-in-right {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes modal-pop {
          0% { transform: scale(0.9) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out forwards; }
        .animate-modal-pop { animation: modal-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>

    </div>
  );
};

export default ChatFlow;