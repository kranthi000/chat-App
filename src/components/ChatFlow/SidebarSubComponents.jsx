import React from 'react';
import { SunIcon, MoonIcon, UserPlusIcon } from "./ChatIcons";

export const SidebarHeader = ({ settings, setSettings, setIsAddUserModalOpen, setIsProfileModalOpen }) => (
  <div className="px-6 py-5 flex justify-between items-center z-20 sticky top-0 bg-[#0f1423]/80 backdrop-blur-xl border-b border-gray-800/50">
    <div className="flex items-center gap-3">
      <div 
        onClick={() => setIsProfileModalOpen(true)}
        className="w-11 h-11 rounded-[15px] bg-gradient-to-br from-[#6366f1] via-[#a855f7] to-[#ec4899] flex items-center justify-center shadow-lg shadow-indigo-500/20 transform transition-transform hover:scale-105 cursor-pointer relative overflow-hidden group"
        title="View Profile"
      >
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 mix-blend-overlay"></div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      </div>
      <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-300 transition-all duration-500 group-hover:from-indigo-300 group-hover:to-pink-400 drop-shadow-sm uppercase">
        ChatFlow
      </h1>
    </div>
    <div className="flex items-center space-x-2 text-gray-400">
      <button 
        onClick={() => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
        className="p-2 bg-gray-800/60 hover:bg-gray-700/80 hover:text-white rounded-full transition-all shadow-inner relative group"
        title={settings.darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <div className="transition-transform duration-500 rotate-0 group-hover:rotate-12">
          {settings.darkMode ? <SunIcon /> : <MoonIcon />}
        </div>
      </button>
      <button 
        onClick={() => setIsAddUserModalOpen(true)}
        className="p-2 bg-gray-800/60 hover:bg-gray-800/80 hover:text-white rounded-full transition-all shadow-inner"
        title="Add New User or Group"
      >
        <UserPlusIcon />
      </button>
    </div>
  </div>
);

export const SidebarSearch = ({ search, setSearch }) => (
  <div className="px-6 py-4 relative z-10">
    <div className="bg-[#1a2333]/80 rounded-2xl flex items-center px-4 py-3 shadow-inner border border-gray-700/50 focus-within:border-fuchsia-500/50 focus-within:ring-2 ring-fuchsia-500/20 transition-all duration-300">
      <div className="text-gray-400 mr-3 group-focus-within:text-fuchsia-400 transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </div>
      <input
        type="text"
        placeholder="Search conversations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-transparent outline-none flex-1 text-sm font-medium text-gray-100 placeholder-gray-500"
      />
    </div>
  </div>
);

export const SidebarTabs = ({ activeTab, setActiveTab, setShowContactInfo }) => (
  <div className="px-3 pb-4 flex gap-1">
    {['chats', 'groups', 'group chats', 'calls', 'status'].map((tab) => (
      <button
        key={tab}
        onClick={() => {
          setActiveTab(tab);
          setShowContactInfo(false);
        }}
        className={`flex-1 py-1.5 px-0.5 text-[10px] sm:text-[11px] font-bold rounded-lg uppercase tracking-tight transition-all ${activeTab === tab
          ? 'bg-gradient-to-r from-rose-500/20 to-fuchsia-500/20 text-white shadow-sm border border-rose-500/30'
          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          }`}
      >
        {tab === 'group chats' ? 'Group Chats' : tab}
      </button>
    ))}
  </div>
);

export const SidebarList = ({ 
  activeTab, filteredContacts, activeChat, setActiveChat, setShowContactInfo, 
  groupsMock, activeGroup, setActiveGroup, groupChatsMock,
  callsMock, setPreviewCall, previewCall, 
  statusMock, setPreviewStatus, previewStatus, search
}) => (
  <div className="flex-1 overflow-y-auto mt-2 pb-6" style={{ scrollbarWidth: "none" }}>
    {activeTab === 'chats' && (
      filteredContacts.length > 0 ? (
        filteredContacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => { setActiveChat(contact.id); setShowContactInfo(true); }}
            className={`relative group h-[84px] flex items-center px-6 cursor-pointer transition-all duration-300 ${activeChat === contact.id ? 'bg-gradient-to-r from-fuchsia-500/10 to-transparent border-l-4 border-fuchsia-500' : 'hover:bg-gray-800/60 border-l-4 border-transparent'}`}
          >
            <div className="relative">
              {contact.avatar?.length <= 2 ? (
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg transition-transform duration-300 group-hover:scale-105 bg-gradient-to-br from-indigo-500 to-fuchsia-600 ${activeChat === contact.id ? 'ring-2 ring-fuchsia-500 ring-offset-2 ring-offset-[#0f1423]' : 'border border-gray-700'}`}>
                  {contact.avatar}
                </div>
              ) : (
                <img src={contact.avatar} alt={contact.name} className={`w-14 h-14 rounded-full object-cover shadow-lg transition-transform duration-300 group-hover:scale-105 ${activeChat === contact.id ? 'ring-2 ring-fuchsia-500 ring-offset-2 ring-offset-[#0f1423]' : 'border border-gray-700'}`} />
              )}
              {contact.online && <div className="absolute bottom-0.5 right-0.5 bg-green-500 border-2 border-[#111827] rounded-full w-3.5 h-3.5 shadow-sm"></div>}
            </div>
            <div className="ml-4 flex-1 overflow-hidden">
              <div className="flex justify-between items-center mb-1">
                <h3 className={`font-bold text-[15px] truncate ${activeChat === contact.id ? 'text-white' : 'text-gray-200 group-hover:text-white transition-colors'}`}>{contact.name}</h3>
                <span className={`text-xs font-medium ${contact.unread > 0 ? 'text-fuchsia-400' : 'text-gray-500'}`}>{contact.time}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-sm truncate pr-2 ${activeChat === contact.id ? 'text-gray-300' : 'text-gray-400'}`}>{contact.message}</p>
                {contact.unread > 0 && <span className="bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-fuchsia-500/30">{contact.unread}</span>}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-10"><span className="text-gray-500 text-sm font-medium">No users found for "{search}"</span></div>
      )
    )}

    {activeTab === 'groups' && groupsMock && groupsMock.map((group) => (
      <div
        key={group.id}
        className={`relative group h-[84px] flex items-center px-6 cursor-pointer transition-all duration-300 ${activeGroup === group.id ? 'bg-gray-800 border-l-4 border-indigo-500' : 'hover:bg-gray-800 border-l-4 border-transparent'}`}
        onClick={() => { setActiveGroup(group.id === activeGroup ? null : group.id); setShowContactInfo(false); }}
      >
        <img src={group.avatar} alt={group.name} className="w-12 h-12 rounded-xl object-cover shadow-md border border-gray-700" />
        <div className="ml-4 flex-1 overflow-hidden text-gray-200">
          <h3 className="font-semibold text-base truncate">{group.name}</h3>
          <p className="text-sm text-gray-400 truncate pr-2">{group.message}</p>
        </div>
      </div>
    ))}

    {activeTab === 'group chats' && groupChatsMock && groupChatsMock.map((chat) => (
      <div
        key={chat.id}
        onClick={() => { setActiveChat(chat.id); setShowContactInfo(false); }}
        className={`relative group h-[84px] flex items-center px-6 cursor-pointer transition-all duration-300 ${activeChat === chat.id ? 'bg-gradient-to-r from-fuchsia-500/10 to-transparent border-l-4 border-fuchsia-500' : 'hover:bg-gray-800/60 border-l-4 border-transparent'}`}
      >
        <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-gray-700 group-hover:border-indigo-400 transition-colors" />
        <div className="ml-4 flex-1 overflow-hidden text-gray-200">
          <h3 className="font-semibold text-base truncate">{chat.name}</h3>
          <p className="text-sm text-gray-400 truncate pr-2">{chat.message}</p>
        </div>
      </div>
    ))}

    {activeTab === 'calls' && callsMock.map((call) => (
      <div
        key={call.id}
        onClick={() => setPreviewCall(call)}
        className={`relative group h-[84px] flex items-center px-6 cursor-pointer transition-all duration-300 ${previewCall?.id === call.id ? 'bg-gray-800 border-l-4 border-indigo-500' : 'hover:bg-gray-800 border-l-4 border-transparent'}`}
      >
        <div className="relative">
          <img src={call.avatar} alt={call.name} className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-gray-700 group-hover:border-indigo-400 transition-colors" />
          {call.missed && <div className="absolute bottom-0 right-[-2px] bg-red-500 border-2 border-[#111827] rounded-full w-4 h-4 text-white flex items-center justify-center font-bold text-[10px]">!</div>}
        </div>
        <div className="ml-4 flex-1 overflow-hidden text-gray-200">
          <h3 className={`font-semibold text-base truncate ${call.missed ? 'text-red-400' : 'text-gray-200'}`}>{call.name}</h3>
          <p className="text-sm text-gray-400 truncate mt-0.5">{call.time} • {call.type}</p>
        </div>
      </div>
    ))}

    {activeTab === 'status' && statusMock.map((status) => (
      <div
        key={status.id}
        onClick={() => setPreviewStatus(status)}
        className={`relative group h-[84px] flex items-center px-6 cursor-pointer transition-all duration-300 ${previewStatus?.id === status.id ? 'bg-gray-800 border-l-4 border-indigo-500' : 'hover:bg-gray-800 border-l-4 border-transparent'}`}
      >
        <div className="relative">
          <img src={status.avatar} alt={status.name} className={`w-12 h-12 rounded-full object-cover shadow-md p-[2px] transition-colors ${status.isMe ? 'border border-gray-600' : 'border-2 border-indigo-500'}`} />
          {status.isMe && <div className="absolute bottom-0 right-[-2px] bg-indigo-500 border-2 border-[#111827] rounded-full w-4 h-4 flex items-center justify-center shadow-lg"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></div>}
        </div>
        <div className="ml-4 flex-1 overflow-hidden text-gray-200">
          <h3 className="font-semibold text-base truncate">{status.name}</h3>
          <p className="text-sm text-gray-400 truncate mt-0.5">{status.time}</p>
        </div>
      </div>
    ))}
  </div>
);

export const SidebarProfile = ({ myProfile, showProfilePopup, setShowProfilePopup, setIsSettingsOpen, setIsProfileModalOpen }) => (
  <div className="px-5 py-4 mt-auto border-t border-gray-800/30 bg-[#0f1423]/40 backdrop-blur-md relative z-30">
    {showProfilePopup && (
      <div className="absolute bottom-full left-5 right-5 mb-4 bg-[#1e293b]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2 z-[60] animate-in slide-in-from-bottom-5 duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-3 border-b border-white/5 mb-1 text-white">
          {myProfile.avatar?.length <= 2 ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center font-bold text-sm">{myProfile.avatar}</div>
          ) : (
            <img src={myProfile.avatar} alt="Me" className="w-10 h-10 rounded-full border border-indigo-500/50" />
          )}
          <div className="overflow-hidden">
            <h3 className="text-sm font-bold truncate">{myProfile.name}</h3>
            <p className="text-[10px] text-gray-400 truncate tracking-tight">{myProfile.email}</p>
          </div>
        </div>
        <div className="space-y-0.5">
          <button onClick={() => { setIsSettingsOpen(true); setShowProfilePopup(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg> Account Settings</button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Set Status</button>
          <div className="pt-1 mt-1 border-t border-white/5">
            <button onClick={() => { localStorage.clear(); window.location.href = "/"; }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg> Log Out</button>
          </div>
        </div>
      </div>
    )}
    <div onClick={(e) => { e.stopPropagation(); setIsProfileModalOpen(true); }} className="group flex items-center p-2 rounded-2xl bg-gray-800/10 hover:bg-gray-800/40 border border-transparent hover:border-white/5 cursor-pointer transition-all active:scale-[0.97] text-white">
      <div className="relative">
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-2xl group-hover:scale-105 transition-transform">
          {myProfile.avatar?.length <= 2 ? (
            <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 flex items-center justify-center font-bold text-xl">{myProfile.avatar}</div>
          ) : (
            <img src={myProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-[#111827] rounded-full w-4 h-4 shadow-lg ring-1 ring-white/10"></div>
      </div>
      <div className="ml-4 flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-1.5 mb-0.5">
          <h3 className="font-bold text-sm truncate group-hover:text-indigo-300 transition-colors uppercase tracking-tight">{myProfile.name}</h3>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`text-gray-500 transition-transform ${showProfilePopup ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        <p className="text-[11px] font-medium text-gray-400 truncate uppercase tracking-widest opacity-80 group-hover:opacity-100">{myProfile.email}</p>
      </div>
    </div>
  </div>
);
