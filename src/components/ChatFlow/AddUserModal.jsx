import React from "react";
import { SearchIcon } from "./ChatIcons";

const AddUserModal = ({ 
  isOpen, 
  onClose, 
  email, 
  setEmail, 
  status, 
  setStatus, 
  onAdd 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#1e293b]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] p-8 animate-zoom-in overflow-hidden relative" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-600/10 rounded-full blur-3xl"></div>

        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight pr-10">Add New Contact</h2>
            <p className="text-gray-400 text-xs font-medium mt-1">Start a conversation with someone new</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-all p-2 hover:bg-white/10 rounded-xl active:scale-95"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 focus-within:ring-2 ring-emerald-500/40 transition-all">
            <label className="block text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 font-bold">Username or Email</label>
            <div className="flex items-center gap-3">
              <div className="text-gray-500">
                <SearchIcon />
              </div>
              <input 
                type="text" 
                placeholder="Enter email to add contact..." 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setStatus(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onAdd();
                }}
                className="bg-transparent border-none outline-none flex-1 text-white text-sm font-medium placeholder:text-gray-600"
              />
              {email && (
                <button 
                  onClick={onAdd}
                  className="p-1 px-3 bg-emerald-600 rounded-lg text-[10px] font-bold text-white hover:bg-emerald-500 transition-all"
                >
                  GO
                </button>
              )}
            </div>
          </div>

          {status && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce-in ${
              status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              <div className={`w-2 h-2 rounded-full ${status.type === 'success' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
              {status.msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
