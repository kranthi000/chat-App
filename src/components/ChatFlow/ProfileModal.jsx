import React, { useState, useRef, useEffect } from "react";
import { compressImage } from "../../services/chatUtils";

/**
 * Premium Profile Modal: Centers user info prominently.
 * Features a modern glassmorphic UI with vibrant accents.
 * Now includes full "Edit Profile" capabilities for Name and Photo.
 */
const ProfileModal = ({ isOpen, onClose, user, setMyProfile, socket }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const [tempAvatar, setTempAvatar] = useState(user.avatar);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Sync with user prop changes when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempName(user.name);
      setTempAvatar(user.avatar);
      setIsEditing(false);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base4String = event.target.result;
        const compressed = await compressImage(base4String);
        setTempAvatar(compressed);
      } catch (err) {
        console.error("Image compression failed:", err);
        setTempAvatar(event.target.result); // Fallback
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!tempName.trim()) return;
    setIsSaving(true);
    
    try {
      // 1. Prepare updated object
      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = {
        ...localUser,
        name: tempName.trim(),
        avatar: tempAvatar,
        profileImage: tempAvatar // Backup field for consistency across components
      };
      
      // 2. Persist to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // 3. Update global state in ChatFlow
      setMyProfile(prev => ({
        ...prev,
        name: tempName.trim(),
        avatar: tempAvatar
      }));

      // 4. Emit to other users
      if (socket) {
        socket.emit("update-user", {
          userId: user.id || user._id,
          name: tempName.trim(),
          avatar: tempAvatar
        });
      }
      
      setIsEditing(false);
    } catch (e) {
      console.error("Save Error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempName(user.name);
    setTempAvatar(user.avatar);
    setIsEditing(false);
  };

  return (
    <div 
      className="fixed inset-0 z-[500] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" 
      onClick={isEditing ? null : onClose}
    >
      <div 
        className="w-full max-w-sm bg-[#1e293b]/95 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] p-10 animate-zoom-in relative text-center" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#6366f1]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#ec4899]/10 rounded-full blur-3xl"></div>

        {!isEditing && (
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-all p-2 hover:bg-white/10 rounded-xl active:scale-95"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        )}

        <div className="relative mb-8 mx-auto w-32 h-32 group">
          {tempAvatar?.length <= 2 ? (
            <div className={`w-full h-full rounded-[24px] bg-gradient-to-br from-[#6366f1] via-[#a855f7] to-[#ec4899] flex items-center justify-center font-black text-5xl text-white shadow-2xl border-2 border-white/10 ${isEditing ? 'cursor-pointer' : ''}`}>
              {tempAvatar}
            </div>
          ) : (
            <img src={tempAvatar} alt={user.name} className="w-full h-full rounded-[24px] object-cover border-2 border-white/10 shadow-2xl" />
          )}
          
          {isEditing && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-[24px] flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all border-2 border-dashed border-white/30"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mb-1"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              <span className="text-[9px] font-black uppercase text-white tracking-widest">Change</span>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
          <div className="absolute -bottom-1 -right-1 bg-green-500 border-4 border-[#1e293b] rounded-full w-8 h-8 shadow-lg ring-1 ring-white/10"></div>
        </div>

        <div className="mb-8">
          {isEditing ? (
            <div className="space-y-1">
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mb-2">Display Name</p>
              <input 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                autoFocus
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center text-white font-bold text-lg outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                placeholder="Enter your name"
              />
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-tight mb-1">{user.name}</h2>
              <p className="text-indigo-400 font-black text-[10px] tracking-[0.2em] uppercase opacity-90 leading-none">Registered User</p>
            </>
          )}
        </div>
        
        <div className="space-y-4 text-left">
          <div className={`p-5 rounded-[20px] transition-all bg-white/[0.04] border ${isEditing ? 'border-dashed border-white/10 opacity-60' : 'border-white/5 hover:bg-white/[0.08]'}`}>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1.5 opacity-60">Email Address (Read-only)</p>
            <p className="text-[15px] font-bold text-gray-100 truncate">{user.email}</p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {isEditing ? (
            <div className="flex gap-3">
              <button 
                onClick={handleCancel}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-gray-300 text-[13px] font-black uppercase tracking-[0.1em] rounded-[20px] transition-all border border-white/10 shadow-xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving || !tempName.trim()}
                className="flex-[2] py-4 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-400 hover:to-indigo-600 text-white text-[13px] font-black uppercase tracking-[0.1em] rounded-[20px] transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[13px] font-black uppercase tracking-[0.1em] rounded-[20px] transition-all shadow-xl active:scale-[0.98]"
              >
                Edit Profile
              </button>
              
              <div className="flex gap-3 mt-4 pt-4 border-t border-white/5">
                <button 
                  onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                  className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all border border-red-500/10"
                >
                  Log Out
                </button>
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-gray-400 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/5"
                >
                  Settings
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
