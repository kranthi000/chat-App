import React, { useState } from "react";

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const App = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [activeTab, setActiveTab] = useState("chats");
  const [activeGroup, setActiveGroup] = useState(101);
  const [search, setSearch] = useState("");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [viewingStatus, setViewingStatus] = useState(null);
  const [previewStatus, setPreviewStatus] = useState(null);
  const [previewCall, setPreviewCall] = useState(null);
  const [settings, setSettings] = useState({ notifications: true, darkMode: true });
  const [myProfile, setMyProfile] = useState({
    name: "Sai Krishna",
    role: "Software Engineer",
    avatar: "https://i.pravatar.cc/150?u=me"
  });

  const contacts = [
    { id: 1, name: "Alice Freeman", message: "That's a great idea! 🚀", time: "10:30 AM", unread: 2, online: true, avatar: "https://i.pravatar.cc/150?u=1" },
    { id: 2, name: "Bob Smith", message: "See you at 5 then.", time: "09:15 AM", unread: 0, online: true, avatar: "https://i.pravatar.cc/150?u=2" },
    { id: 3, name: "Charlie Davis", message: "Can you send the design files?", time: "Yesterday", unread: 0, online: false, avatar: "https://i.pravatar.cc/150?u=3" },
    { id: 4, name: "Diana Prince", message: "Thanks for the heads up.", time: "Yesterday", unread: 0, online: false, avatar: "https://i.pravatar.cc/150?u=4" },
    { id: 5, name: "Evan Wright", message: "I'll look into it right away.", time: "Monday", unread: 0, online: true, avatar: "https://i.pravatar.cc/150?u=5" },
  ];

  const messagesData = {
    1: [
      { id: 1, text: "Hey! How's it going with the new landing page?", sender: "them", time: "10:20 AM" },
      { id: 2, text: "Good! Just reviewing the new premium dark mode designs. 🎨", sender: "me", time: "10:25 AM" },
      { id: 3, text: "That's a great idea! 🚀 I think the users will love it.", sender: "them", time: "10:30 AM" },
    ],
    2: [
      { id: 1, text: "Are we still on for the meeting later?", sender: "them", time: "09:00 AM" },
      { id: 2, text: "Yes, definitely. See you at 5 then.", sender: "me", time: "09:15 AM" }
    ],
    3: [
      { id: 1, text: "Can you send the design files?", sender: "them", time: "Yesterday" }
    ],
    4: [
      { id: 1, text: "Thanks for the heads up.", sender: "them", time: "Yesterday" }
    ],
    5: [
      { id: 1, text: "I'll look into it right away.", sender: "them", time: "Monday" }
    ]
  };

  const groupsMock = [
    { id: 101, name: "10th Class", message: "Teacher: Don't forget the assignment.", time: "11:00 AM", unread: 5, avatar: "https://ui-avatars.com/api/?name=10th+Class&background=6366f1&color=fff" },
    { id: 102, name: "9th Class", message: "Student: When is the exam?", time: "Yesterday", unread: 0, avatar: "https://ui-avatars.com/api/?name=9th+Class&background=ec4899&color=fff" }
  ];

  const subGroupsData = {
    101: [
      { id: 1011, name: "Alice (Class Rep)", role: "Student", avatar: "https://i.pravatar.cc/150?u=12" },
      { id: 1012, name: "Bob", role: "Student", avatar: "https://i.pravatar.cc/150?u=13" },
      { id: 1013, name: "Charlie", role: "Student", avatar: "https://i.pravatar.cc/150?u=14" },
    ],
    102: [
      { id: 1021, name: "Dave", role: "Student", avatar: "https://i.pravatar.cc/150?u=15" },
      { id: 1022, name: "Eve Bright", role: "Student", avatar: "https://i.pravatar.cc/150?u=16" },
    ]
  };

  const callsMock = [
    { id: 201, name: "Alice Freeman", type: "Missed Audio Call", time: "Yesterday, 8:30 PM", avatar: "https://i.pravatar.cc/150?u=1", missed: true },
    { id: 202, name: "Bob Smith", type: "Outgoing Video Call", time: "Monday, 2:15 PM", avatar: "https://i.pravatar.cc/150?u=2", missed: false }
  ];

  const statusMock = [
    { id: 301, name: "My Status", time: "Tap to add status update", avatar: myProfile.avatar, isMe: true },
    { id: 302, name: "Diana Prince", time: "Today, 10:20 AM", avatar: "https://i.pravatar.cc/150?u=4", isMe: false }
  ];

  const groupChatsMock = [
    { id: 401, name: "Family Group", message: "Mom: Dinner is ready!", time: "12:00 PM", unread: 2, avatar: "https://ui-avatars.com/api/?name=Family+Group&background=10B981&color=fff", isGroup: true },
    { id: 402, name: "Weekend Plans", message: "You: Sounds good.", time: "Yesterday", unread: 0, avatar: "https://ui-avatars.com/api/?name=Weekend+Plans&background=F59E0B&color=fff", isGroup: true }
  ];

  let currentContact = contacts.find(c => c.id === activeChat);
  if (!currentContact) {
    for (const groupId in subGroupsData) {
      const found = subGroupsData[groupId]?.find(s => s.id === activeChat);
      if (found) {
        currentContact = { id: found.id, name: found.name, avatar: found.avatar, online: true };
        break;
      }
    }
  }
  if (!currentContact) {
    const foundGroupChat = groupChatsMock.find(g => g.id === activeChat);
    if (foundGroupChat) currentContact = { id: foundGroupChat.id, name: foundGroupChat.name, avatar: foundGroupChat.avatar, online: true, isGroup: true };
  }


  const currentMessages = messagesData[activeChat] || [
    { id: 99, text: "Hey! What's up?", sender: "them", time: "Just now" }
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`flex h-screen font-sans bg-gray-900 text-gray-100 overflow-hidden relative ${!settings.darkMode ? 'light-theme-active' : ''}`} style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #1f2937, #0B0F19 70%)' }}>

      {/* Status Viewer Modal */}
      {viewingStatus && (
        <div className="absolute inset-0 z-[200] bg-black flex flex-col transition-opacity animate-fade-in">
          <div className="absolute top-0 w-full p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-3">
              <img src={viewingStatus.avatar} alt="Status Avatar" className="w-12 h-12 rounded-full border-2 border-indigo-500 shadow-md" />
              <div>
                <h3 className="text-white font-bold tracking-wide">{viewingStatus.name}</h3>
                <p className="text-gray-300 text-xs font-medium">{viewingStatus.time}</p>
              </div>
            </div>
            <button onClick={() => setViewingStatus(null)} className="text-white p-3 hover:bg-white/20 rounded-full transition-colors">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center bg-gray-900 border-y-8 border-gray-800">
            <div className="text-center text-white px-8">
              <span className="text-6xl mb-6 block animate-bounce">📸</span>
              <h2 className="text-3xl font-bold mb-3 tracking-wide">{viewingStatus.name}'s Status Update</h2>
              <p className="text-gray-400 font-medium">This is a mock immersive status view.</p>
            </div>
          </div>

          <div className="h-20 bg-black flex items-center justify-center text-gray-500 text-sm">
            <svg className="w-5 h-5 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            Viewed by 5 others
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-[320px] md:w-[380px] bg-[#0f1423]/90 backdrop-blur-2xl flex flex-col border-r border-gray-800/60 shadow-2xl z-20">

        {/* Top Header */}
        <div className="px-6 py-5 flex justify-between items-center z-20 sticky top-0 bg-[#0f1423]/80 backdrop-blur-xl border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-rose-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-rose-500/30 transform transition-transform hover:scale-105 cursor-pointer relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 mix-blend-overlay"></div>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative z-10"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </div>
            <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-rose-300 to-fuchsia-400 drop-shadow-sm">
              ChatFlow
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <button className="p-2 bg-gray-800/60 hover:bg-gray-700/80 hover:text-white rounded-full transition-all shadow-inner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-4 relative z-10">
          <div className="bg-[#1a2333]/80 rounded-2xl flex items-center px-4 py-3 shadow-inner border border-gray-700/50 focus-within:border-fuchsia-500/50 focus-within:ring-2 ring-fuchsia-500/20 transition-all duration-300">
            <div className="text-gray-400 mr-3 group-focus-within:text-fuchsia-400 transition-colors">
              <SearchIcon />
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

        {/* Navigation Tabs */}
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

        {/* Active Tab Content */}
        <div className="flex-1 overflow-y-auto mt-2 pb-6" style={{ scrollbarWidth: "none" }}>

          {activeTab === 'chats' && (
            filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => {
                    setActiveChat(contact.id);
                    setShowContactInfo(true);
                  }}
                  className={`relative group h-[84px] flex items-center px-6 cursor-pointer transition-all duration-300 ${activeChat === contact.id
                    ? 'bg-gradient-to-r from-fuchsia-500/10 to-transparent border-l-4 border-fuchsia-500'
                    : 'hover:bg-gray-800/60 border-l-4 border-transparent'
                    }`}
                >
                  <div className="relative">
                    <img src={contact.avatar} alt={contact.name} className={`w-14 h-14 rounded-full object-cover shadow-lg transition-transform duration-300 group-hover:scale-105 ${activeChat === contact.id ? 'ring-2 ring-fuchsia-500 ring-offset-2 ring-offset-[#0f1423]' : 'border border-gray-700'}`} />
                    {contact.online && (
                      <div className="absolute bottom-0.5 right-0.5 bg-green-500 border-2 border-[#111827] rounded-full w-3.5 h-3.5 shadow-sm"></div>
                    )}
                  </div>
                  <div className="ml-4 flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`font-bold text-[15px] truncate ${activeChat === contact.id ? 'text-white' : 'text-gray-200 group-hover:text-white transition-colors'}`}>{contact.name}</h3>
                      <span className={`text-xs font-medium ${contact.unread > 0 ? 'text-fuchsia-400' : 'text-gray-500'}`}>{contact.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={`text-sm truncate pr-2 ${activeChat === contact.id ? 'text-gray-300' : 'text-gray-400'}`}>{contact.message}</p>
                      {contact.unread > 0 && (
                        <span className="bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-fuchsia-500/30">
                          {contact.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <span className="text-gray-500 text-sm font-medium">No users found for "{search}"</span>
              </div>
            )
          )}

          {activeTab === 'groups' && (
            groupsMock.map((group) => (
              <div
                key={group.id}
                className={`relative group h-[84px] flex items-center px-6 cursor-pointer transition-all duration-300 ${activeGroup === group.id ? 'bg-gray-800 border-l-4 border-indigo-500' : 'hover:bg-gray-800 border-l-4 border-transparent'
                  }`}
                onClick={() => {
                  setActiveGroup(group.id === activeGroup ? null : group.id);
                  setShowContactInfo(false);
                }}
              >
                <img src={group.avatar} alt={group.name} className="w-12 h-12 rounded-xl object-cover shadow-md border border-gray-700" />
                <div className="ml-4 flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-base text-gray-200 truncate">{group.name}</h3>
                    <span className="text-xs font-medium text-gray-500">{group.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400 truncate pr-2">{group.message}</p>
                    {group.unread > 0 && (
                      <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-indigo-500/30">
                        {group.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {activeTab === 'group chats' && (
            groupChatsMock.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  setActiveChat(chat.id);
                  setShowContactInfo(false);
                }}
                className={`relative group h-[84px] flex items-center px-6 cursor-pointer transition-all duration-300 ${activeChat === chat.id
                  ? 'bg-gradient-to-r from-fuchsia-500/10 to-transparent border-l-4 border-fuchsia-500'
                  : 'hover:bg-gray-800/60 border-l-4 border-transparent'
                  }`}
              >
                <div className="relative">
                  <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-gray-700 group-hover:border-indigo-400 transition-colors" />
                </div>
                <div className="ml-4 flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-semibold text-base truncate ${activeChat === chat.id ? 'text-white' : 'text-gray-200'}`}>{chat.name}</h3>
                    <span className={`text-xs font-medium ${chat.unread > 0 ? 'text-indigo-400' : 'text-gray-500'}`}>{chat.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className={`text-sm truncate pr-2 ${activeChat === chat.id ? 'text-gray-300' : 'text-gray-400'}`}>{chat.message}</p>
                    {chat.unread > 0 && (
                      <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-indigo-500/30">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {activeTab === 'calls' && (
            callsMock.map((call) => (
              <div
                key={call.id}
                onClick={() => setPreviewCall(call)}
                className={`relative group h-[84px] flex items-center px-6 cursor-pointer transition-all duration-300 ${previewCall?.id === call.id ? 'bg-gray-800 border-l-4 border-indigo-500' : 'hover:bg-gray-800 border-l-4 border-transparent'
                  }`}
              >
                <div className="relative">
                  <img src={call.avatar} alt={call.name} className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-gray-700 group-hover:border-indigo-400 transition-colors" />
                  {call.missed && <div className="absolute bottom-0 right-[-2px] bg-red-500 border-2 border-[#111827] rounded-full w-4 h-4 text-white flex items-center justify-center font-bold text-[10px]">!</div>}
                </div>
                <div className="ml-4 flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-semibold text-base truncate ${previewCall?.id === call.id ? 'text-white' : call.missed ? 'text-red-400' : 'text-gray-200'}`}>{call.name}</h3>
                    <span className="text-xs font-medium text-gray-500">{call.time}</span>
                  </div>
                  <div className="flex items-center mt-0.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={call.missed ? '#F87171' : '#10B981'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      {call.missed ? <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /> : <path d="M7 17l9.2-9.2M17 17V7H7" />}
                    </svg>
                    <p className={`text-sm truncate pr-2 ${previewCall?.id === call.id ? 'text-gray-300' : 'text-gray-400'}`}>{call.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-gray-700 hover:text-green-400 rounded-full transition-colors" title="Audio Call">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.35 2 2 0 0 1 3.61 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.12-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </button>
                  <button className="p-2 hover:bg-gray-700 hover:text-indigo-400 rounded-full transition-colors" title="Video Call">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                  </button>
                </div>
              </div>
            ))
          )}

          {activeTab === 'status' && (
            statusMock.map((status) => (
              <div
                key={status.id}
                onClick={() => setPreviewStatus(status)}
                className={`relative group h-[84px] flex items-center px-6 cursor-pointer transition-all duration-300 ${previewStatus?.id === status.id ? 'bg-gray-800 border-l-4 border-indigo-500' : 'hover:bg-gray-800 border-l-4 border-transparent'
                  }`}
              >
                <div className="relative">
                  <img src={status.avatar} alt={status.name} className={`w-12 h-12 rounded-full object-cover shadow-md p-[2px] transition-colors ${previewStatus?.id === status.id ? 'border-2 border-indigo-400' : status.isMe ? 'border border-gray-600' : 'border-2 border-indigo-500'}`} />
                  {status.isMe && (
                    <div className="absolute bottom-0 right-[-2px] bg-indigo-500 border-2 border-[#111827] rounded-full w-4 h-4 flex items-center justify-center shadow-lg">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1 overflow-hidden">
                  <h3 className={`font-semibold text-base truncate ${previewStatus?.id === status.id ? 'text-white' : 'text-gray-200'}`}>{status.name}</h3>
                  <p className={`text-sm truncate mt-0.5 tracking-wide ${previewStatus?.id === status.id ? 'text-gray-300' : 'text-gray-400'}`}>{status.time}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Profile */}
        <div className="relative h-[90px] bg-[#0B0F19] bg-opacity-80 backdrop-blur-md p-6 flex items-center justify-between border-t border-gray-800">

          {/* Profile Menu Popup */}
          {showProfilePopup && !isEditingProfile && !isSettingsOpen && (
            <div className="absolute bottom-[80px] left-4 w-64 bg-[#1F2937] border border-gray-700 rounded-2xl shadow-2xl p-4 z-50 transform transition-all duration-200">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
                <div className="relative cursor-pointer group" onClick={() => { setIsEditingProfile(true); setShowProfilePopup(false); }}>
                  <img src={myProfile.avatar} alt="Me" className="w-12 h-12 rounded-full border-2 border-indigo-500 shadow-sm group-hover:opacity-75 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-40 rounded-full">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-white tracking-wide">{myProfile.name}</h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">{myProfile.role}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <button
                  onClick={() => { setIsSettingsOpen(true); setShowProfilePopup(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  Account Settings
                </button>
                <button className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  Set Status
                </button>
                <button className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors mt-2">
                  Log Out
                </button>
              </div>
            </div>
          )}

          {/* Edit Profile Popup */}
          {isEditingProfile && (
            <div className="absolute bottom-[80px] left-4 w-72 bg-[#1F2937] border border-gray-700 rounded-2xl shadow-2xl p-5 z-50 transform transition-all duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wide">Edit Profile</h2>
                <button onClick={() => setIsEditingProfile(false)} className="text-gray-400 hover:text-white transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="flex items-center gap-4 mb-5">
                <div className="relative group cursor-pointer flex-shrink-0">
                  <img src={myProfile.avatar} alt="Avatar" className="w-14 h-14 rounded-full border-2 border-indigo-500 object-cover shadow-sm" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-[10px] font-bold">Change</span>
                  </div>
                </div>
                <div className="w-full space-y-2">
                  <input
                    type="text"
                    value={myProfile.name}
                    onChange={(e) => setMyProfile({ ...myProfile, name: e.target.value })}
                    className="w-full bg-[#111827] border border-gray-600 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-indigo-500 transition-all"
                    placeholder="Display Name"
                  />
                  <input
                    type="text"
                    value={myProfile.role}
                    onChange={(e) => setMyProfile({ ...myProfile, role: e.target.value })}
                    className="w-full bg-[#111827] border border-gray-600 rounded-lg px-2.5 py-1.5 text-white text-xs outline-none focus:border-indigo-500 transition-all"
                    placeholder="Role / Bio"
                  />
                </div>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="w-full py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-all shadow-md"
              >
                Save Changes
              </button>
            </div>
          )}

          {/* Settings Popup */}
          {isSettingsOpen && (
            <div className="absolute bottom-[80px] left-4 w-72 bg-[#1F2937] border border-gray-700 rounded-2xl shadow-2xl p-5 z-50 transform transition-all duration-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wide">Settings</h2>
                <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-[#111827] rounded-xl border border-gray-700 cursor-pointer" onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}>
                  <div>
                    <h3 className="text-sm font-medium text-white select-none">Notifications</h3>
                  </div>
                  <div className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors duration-300 ${settings.notifications ? 'bg-indigo-500' : 'bg-gray-600'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${settings.notifications ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[#111827] rounded-xl border border-gray-700 cursor-pointer" onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}>
                  <div>
                    <h3 className="text-sm font-medium text-white select-none">Dark Mode</h3>
                  </div>
                  <div className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors duration-300 ${settings.darkMode ? 'bg-indigo-500' : 'bg-gray-600'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${settings.darkMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-[#111827] rounded-xl border border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors">
                  <h3 className="text-sm font-medium text-white">Privacy</h3>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            </div>
          )}

          <div
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-800/50 p-2 -ml-2 rounded-xl transition-all w-full mr-2"
            onClick={() => {
              if (isEditingProfile || isSettingsOpen) {
                setIsEditingProfile(false);
                setIsSettingsOpen(false);
              } else {
                setShowProfilePopup(!showProfilePopup);
              }
            }}
          >
            <img src={myProfile.avatar} alt="Me" className="w-10 h-10 rounded-full border border-gray-600 shadow-sm" />
            <div className="flex-1">
              <h4 className="font-bold text-gray-100 text-sm">{myProfile.name}</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-green-400 font-medium tracking-wide">● Active</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors flex-shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        </div>

      </div>

      {/* Sub-groups Middle Sidebar */}
      {activeTab === 'groups' && activeGroup && (
        <div className="w-[280px] bg-[#0E1321] border-r border-gray-800 flex flex-col z-10 shadow-xl transition-all duration-300">
          <div className="h-[88px] border-b border-gray-800 px-6 flex items-center bg-[#0E1321] sticky top-0 z-10">
            <h2 className="text-base font-bold text-white tracking-wide">
              {groupsMock.find(g => g.id === activeGroup)?.name} Students
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "none" }}>
            {subGroupsData[activeGroup]?.map((sub) => (
              <div
                key={sub.id}
                onClick={() => { setActiveChat(sub.id); setShowContactInfo(true); }}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all mb-1 border shadow-sm ${activeChat === sub.id
                  ? 'bg-gray-800 border-indigo-500'
                  : 'border-transparent hover:border-gray-700 hover:bg-gray-800/80'
                  }`}
              >
                <img src={sub.avatar} alt={sub.name} className="w-10 h-10 rounded-full border border-gray-600 shadow-sm" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-200">{sub.name}</h4>
                  <p className="text-[11px] text-indigo-400 font-medium mt-0.5">{sub.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Area & Previews */}
      <div className="flex-1 flex flex-col relative bg-[#0B0F19] z-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(15, 20, 35, 0.4) 0%, rgba(11, 15, 25, 1) 100%), repeating-radial-gradient(circle at 0 0, transparent 0, #0B0F19 14px), repeating-linear-gradient(#1f293708, #1f293708 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, #1f293708, #1f293708 1px, transparent 1px, transparent 24px)' }}>

        {/* Decorative Background Glows */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600 rounded-full mix-blend-screen filter blur-[150px] opacity-[0.15]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-pink-600 rounded-full mix-blend-screen filter blur-[150px] opacity-[0.12]"></div>
          <div className="absolute top-[40%] right-[30%] w-[40%] h-[40%] bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-[0.1]"></div>
        </div>

        {(activeTab === 'status' && previewStatus) ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 z-20 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            <div className="text-center animate-fade-in-up flex flex-col items-center">
              <div className="relative inline-block mb-8 cursor-pointer group" onClick={() => setViewingStatus(previewStatus)}>
                <img
                  src={previewStatus.avatar}
                  alt="Status Preview"
                  className="w-56 h-56 object-cover rounded-full border-[6px] border-[#111827] ring-4 ring-indigo-500 shadow-2xl transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-lg scale-110 ml-2"><polygon points="5 3 19 12 5 21 5 3" fill="currentColor"></polygon></svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-wide">{previewStatus.name}</h2>
              <p className="text-gray-400 mt-2.5 font-medium">{previewStatus.time}</p>
              <button
                onClick={() => setViewingStatus(previewStatus)}
                className="mt-10 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2.5 mx-auto"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                View Fullscreen
              </button>
            </div>
          </div>
        ) : (activeTab === 'calls' && previewCall) ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0B0F19] z-20 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            <div className="text-center animate-fade-in-up flex flex-col items-center">
              <img
                src={previewCall.avatar}
                alt="Call Preview"
                className="w-48 h-48 object-cover rounded-full border-4 border-[#1F2937] shadow-xl mb-8 mx-auto"
              />
              <h2 className="text-3xl font-bold text-white tracking-wide">{previewCall.name}</h2>
              <p className="text-gray-400 mt-2.5 font-medium">{previewCall.type} • {previewCall.time}</p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <button className="px-8 py-3.5 bg-[#1F2937] hover:bg-gray-800 text-green-400 font-semibold rounded-2xl shadow-lg transition-all flex items-center gap-2.5 border border-transparent hover:border-green-500/30">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.35 2 2 0 0 1 3.61 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.12-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  Audio Call
                </button>
                <button className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2.5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                  Video Call
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-[88px] border-b border-gray-800/60 px-8 flex items-center justify-between flex-shrink-0 bg-[#0B0F19]/60 backdrop-blur-2xl z-20 shadow-sm relative">
              <div
                className="flex items-center gap-4 cursor-pointer group"
                onClick={() => setShowContactInfo(!showContactInfo)}
              >
                <div className="relative">
                  <img src={currentContact?.avatar} alt={currentContact?.name} className="w-12 h-12 rounded-full shadow-md object-cover ring-2 ring-transparent group-hover:ring-indigo-500 transition-all duration-300" />
                  {currentContact?.online && (
                    <div className="absolute bottom-0 right-[-2px] w-3.5 h-3.5 bg-green-500 border-2 border-[#0B0F19] rounded-full shadow-sm"></div>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-100 tracking-wide group-hover:text-indigo-400 transition-colors drop-shadow-sm">{currentContact?.name}</h2>
                  <span className={`text-sm font-medium ${currentContact?.online ? 'text-green-400' : 'text-gray-500'}`}>
                    {currentContact?.online ? 'Online' : 'Offline'}
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
                <button className="p-2.5 hover:bg-gray-800 hover:text-white rounded-xl transition-all">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="5" r="1.5"></circle><circle cx="12" cy="19" r="1.5"></circle></svg>
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 z-10" style={{ scrollbarWidth: "none" }}>
              <div className="text-center my-4">
                <span className="bg-gray-800 text-gray-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest shadow-sm">
                  TODAY
                </span>
              </div>

              {currentMessages.map((msg) => (
                <div key={msg.id} className={`flex w-full ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[70%] ${msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.sender === 'them' && (
                      <img src={currentContact?.avatar} alt={currentContact?.name?.charAt(0)} className="w-8 h-8 rounded-full flex-shrink-0 mt-auto mr-3 shadow-md" />
                    )}
                    <div className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-5 py-3.5 rounded-[22px] shadow-lg transform transition-transform hover:scale-[1.01] ${msg.sender === 'me'
                        ? 'bg-gradient-to-br from-rose-500 via-fuchsia-500 to-purple-600 text-white rounded-br-sm shadow-fuchsia-500/25 border-t border-fuchsia-400/30'
                        : 'bg-[#1e2738]/90 backdrop-blur-md text-gray-100 border border-gray-700/60 rounded-bl-sm shadow-black/20 hover:bg-[#252f44]'
                        }`}>
                        <p className="text-[15px] leading-relaxed break-words tracking-wide">{msg.text}</p>
                      </div>
                      <span className="text-xs font-medium text-gray-500 mt-1.5 px-1">{msg.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-gradient-to-t from-[#090d16] via-[#0B0F19]/90 to-transparent flex flex-col justify-end z-20">
              <div className="w-full max-w-4xl mx-auto bg-[#171f2d]/80 backdrop-blur-2xl border border-gray-700/60 rounded-3xl flex items-center px-3 py-3 shadow-2xl focus-within:ring-2 ring-fuchsia-500/40 focus-within:bg-[#1a2333]/90 transition-all duration-300">
                <button className="text-gray-400 hover:text-fuchsia-400 transition-colors p-2.5 rounded-2xl hover:bg-gray-800/60">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                </button>
                <input type="text" placeholder="Type a message..." className="bg-transparent outline-none flex-1 px-4 text-gray-100 placeholder-gray-500 font-medium text-[15px] h-full" />
                <button className="text-gray-400 hover:text-amber-400 transition-colors p-2.5 mr-2 rounded-2xl hover:bg-gray-800/60">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                </button>
                <button className="w-11 h-11 bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-500 rounded-2xl flex items-center justify-center text-white hover:from-fuchsia-400 hover:to-amber-400 shadow-lg shadow-rose-500/30 transition-all transform hover:scale-105 active:scale-95 border-t border-fuchsia-400/30">
                  <SendIcon />
                </button>
              </div>
            </div>
          </>
        )}

      </div>

      {/* Contact Info Right Sidebar */}
      {showContactInfo && currentContact && (
        <div className="w-[300px] md:w-[350px] bg-[#111827] flex flex-col border-l border-gray-800 shadow-2xl z-20 transition-transform duration-300">

          <div className="h-[88px] border-b border-gray-800 px-6 flex items-center justify-between sticky top-0 bg-[#111827] bg-opacity-95 backdrop-blur-sm z-10">
            <h2 className="text-lg font-bold text-white tracking-wide">
              {currentContact.isGroup ? 'Group Info' : 'Contact Info'}
            </h2>
            <button
              onClick={() => setShowContactInfo(false)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <div className="p-6 flex flex-col items-center border-b border-gray-800">
            <img src={currentContact.avatar} alt={currentContact.name} className="w-28 h-28 rounded-full object-cover border-4 border-[#1F2937] shadow-xl mb-4" />
            <h3 className="text-xl font-bold text-white mb-1">{currentContact.name}</h3>
            {currentContact.isGroup ? (
              <p className="text-sm font-medium text-gray-400">12 Participants</p>
            ) : (
              <p className={`text-sm font-medium ${currentContact.online ? 'text-green-400' : 'text-gray-500'}`}>
                {currentContact.online ? 'Online' : 'Offline'}
              </p>
            )}
          </div>

          <div className="p-6 space-y-6 flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            {currentContact.isGroup ? (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Participants (12)</h4>
                <div className="space-y-1 bg-[#1F2937] p-2 rounded-xl shadow-inner border border-gray-700">
                  <div className="flex items-center justify-between p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={myProfile.avatar} className="w-9 h-9 rounded-full border border-gray-600" alt="You" />
                      <div>
                        <p className="text-sm text-white font-medium">You</p>
                        <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider mt-0.5">Group Admin</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
                    <img src="https://i.pravatar.cc/150?u=12" className="w-9 h-9 rounded-full border border-gray-600" alt="Participant" />
                    <p className="text-sm text-gray-200 font-medium">Alice Freeman</p>
                  </div>
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
                    <img src="https://i.pravatar.cc/150?u=13" className="w-9 h-9 rounded-full border border-gray-600" alt="Participant" />
                    <p className="text-sm text-gray-200 font-medium">Bob Smith</p>
                  </div>
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
                    <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-gray-400 text-xs font-bold shadow-sm">+9</div>
                    <p className="text-sm text-gray-400 font-medium tracking-wide">View all</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">About</h4>
                <p className="text-sm text-gray-300 leading-relaxed bg-[#1F2937] p-4 rounded-xl shadow-inner border border-gray-700">
                  Hey there! I am using this premium chat interface. Let's build something amazing together! 🚀
                </p>
              </div>
            )}

            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Media, Links & Docs</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square bg-gray-800 rounded-lg shadow-sm border border-gray-700"></div>
                <div className="aspect-square bg-gray-800 rounded-lg shadow-sm border border-gray-700"></div>
                <div className="aspect-square bg-[#1F2937] rounded-lg flex items-center justify-center text-xs text-indigo-400 font-bold cursor-pointer hover:bg-gray-800 transition-colors border border-gray-700">
                  +12
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-800 space-y-2.5">
              <button className="w-full py-2.5 bg-[#1F2937] hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm border border-gray-700">
                Share {currentContact.isGroup ? 'Group Link' : 'Contact'}
              </button>
              {!currentContact.isGroup && (
                <button className="w-full py-2.5 text-red-400 hover:bg-red-500/10 text-sm font-semibold rounded-xl transition-colors border border-transparent hover:border-red-500/30">
                  Block User
                </button>
              )}
              <button className="w-full py-2.5 text-red-500 hover:bg-red-500/10 text-sm font-semibold rounded-xl transition-colors border border-transparent hover:border-red-500/30">
                {currentContact.isGroup ? 'Exit Group' : 'Report Contact'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;