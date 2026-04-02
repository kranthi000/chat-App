import React from "react";
import { SunIcon, MoonIcon } from "./ChatIcons";

const SettingsModal = ({ 
  isOpen, 
  onClose, 
  settings, 
  setSettings 
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
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl"></div>

        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight pr-10">Settings</h2>
            <p className="text-gray-400 text-xs font-medium mt-1">Personalize your chat experience</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-all p-2 hover:bg-white/10 rounded-xl active:scale-95"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="space-y-4 relative z-10">
          {/* Theme Toggle in Settings */}
          <div className="group flex items-center justify-between p-4 bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl border border-white/5 transition-all">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${settings.darkMode ? 'bg-amber-500/20 text-amber-400 shadow-lg shadow-amber-500/10' : 'bg-indigo-500/20 text-indigo-400 shadow-lg shadow-indigo-500/10'}`}>
                 {settings.darkMode ? <SunIcon /> : <MoonIcon />}
              </div>
              <div>
                <p className="font-bold text-sm text-white">{settings.darkMode ? 'Light Theme' : 'Dark Theme'}</p>
                <p className="text-[11px] text-gray-400">Adjust the app's appearance</p>
              </div>
            </div>
            <button 
              onClick={() => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
              className={`w-14 h-7 rounded-full p-1 transition-all duration-500 flex items-center ${settings.darkMode ? 'bg-indigo-600' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-500 shadow-md ${settings.darkMode ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Notifications Toggle */}
          <div className="group flex items-center justify-between p-4 bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl border border-white/5 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shadow-lg shadow-pink-500/10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              </div>
              <div>
                <p className="font-bold text-sm text-white">Notifications</p>
                <p className="text-[11px] text-gray-400">Get alerts for new activity</p>
              </div>
            </div>
            <button 
              onClick={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
              className={`w-14 h-7 rounded-full p-1 transition-all duration-500 flex items-center ${settings.notifications ? 'bg-rose-500' : 'bg-gray-600'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-500 shadow-md ${settings.notifications ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Account Privacy - Mock */}
          <div className="group flex items-center justify-between p-4 bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl border border-white/5 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center shadow-lg shadow-green-500/10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div>
                <p className="font-bold text-sm text-white">Privacy</p>
                <p className="text-[11px] text-gray-400">Manage your online visibility</p>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 mr-1"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-2 relative z-10">
           <div className="flex items-center gap-2 mb-1">
             <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center opacity-80">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
             </div>
             <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">ChatFlow Premium</span>
           </div>
           <p className="text-[9px] text-gray-500 font-medium">Build v1.0.4 • © 2026</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
