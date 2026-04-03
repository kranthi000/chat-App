import React, { useState, useRef, useEffect } from "react";
import { resolveMediaURL } from "../../services/chatUtils";
import { useChatCore } from "../../hooks/useChatCore";

// Sub-components
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import ContactPanel from "./ContactPanel";
import AddUserModal from "./AddUserModal";
import SettingsModal from "./SettingsModal";
import ProfileModal from "./ProfileModal";
import MediaLightbox from "./MediaLightbox";

/**
 * Main Chat Application Entry Point.
 * Organized using a clean component-based architecture:
 * - useChatCore manages sockets & state.
 * - chatUtils handles media transformations.
 * - Sub-components handle specific UI sections.
 */
const ChatFlow = () => {
  // --- UI Orchestration State ---
  const [activeChat, setActiveChat] = useState(1);
  const [activeTab, setActiveTab] = useState("chats");
  const [activeGroup, setActiveGroup] = useState(101);
  const [search, setSearch] = useState("");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [addUserEmail, setAddUserEmail] = useState("");
  const [addUserStatus, setAddUserStatus] = useState(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [settings, setSettings] = useState({ notifications: true, darkMode: true });
  const [messageInput, setMessageInput] = useState("");
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [viewingMedia, setViewingMedia] = useState(null);
  const [viewingStatus, setViewingStatus] = useState(null);
  const [_previewStatus, setPreviewStatus] = useState(null);
  const [_previewCall, setPreviewCall] = useState(null);

  const [myProfile, setMyProfile] = useState({
    id: null, name: "User", email: "loading...", avatar: "U", status: "online"
  });

  // --- Logic Layer ---
  const {
    socket,
    contacts,
    messagesData,
    handleSendMessage,
    handleAttachmentSubmit,
  } = useChatCore(
    myProfile, setMyProfile, activeChat, setActiveChat,
    setAddUserStatus, setIsAddUserModalOpen, setAddUserEmail
  );

  // --- UI Refs ---
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesData, activeChat]);

  // --- Context-Specific Mocks ---
  const groupsMock = [];
  const statusMock = [
    { id: 301, name: "My Status", time: "Tap to add updates", avatar: myProfile.avatar, isMe: true },
    { id: 302, name: "Diana Prince", time: "Today, 10:20 AM", avatar: "https://i.pravatar.cc/150?u=4", isMe: false }
  ];
  const callsMock = [
    { id: 201, name: "Alice Freeman", type: "Missed Audio Call", time: "Yesterday, 8:30 PM", avatar: "https://i.pravatar.cc/150?u=1", missed: true },
  ];
  const groupChatsMock = [
    { id: 401, name: "Family Group", message: "Mom: Dinner is ready!", time: "12:00 PM", unread: 2, avatar: "https://ui-avatars.com/api/?name=Family+Group&background=10B981&color=fff", isGroup: true },
  ];

  // --- Derived Data ---
  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  let currentContact = contacts.find(c => String(c.id) === String(activeChat)) || groupChatsMock.find(g => g.id === activeChat);
  const currentMessages = messagesData[activeChat] || [];

  const handleAddByEmail = () => {
    if (!addUserEmail.trim() || !socket) return;
    setAddUserStatus({ type: 'info', msg: 'Connecting...' });
    socket.emit("send-message-by-email", {
      fromUserId: myProfile.id,
      toEmail: addUserEmail.trim(),
      message: "Hey! Let's chat.",
      type: "text"
    });
  };

  return (
    <div className={`flex h-screen font-sans bg-gray-900 text-gray-100 overflow-hidden relative ${!settings.darkMode ? 'light-theme-active' : ''}`}
      style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #1f2937, #0B0F19 70%)' }}>

      {/* Global Overlays */}
      <MediaLightbox media={viewingMedia} onClose={() => setViewingMedia(null)} />

      {/* Modals */}
      <AddUserModal
        isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)}
        email={addUserEmail} setEmail={setAddUserEmail}
        status={addUserStatus} setStatus={setAddUserStatus}
        onAdd={handleAddByEmail}
      />

      <SettingsModal
        isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}
        settings={settings} setSettings={setSettings}
      />
      <ProfileModal
        isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)}
        user={myProfile}
        setMyProfile={setMyProfile}
        socket={socket}
      />

      {/* Main Layout Sections */}
      <ChatSidebar
        activeTab={activeTab} setActiveTab={setActiveTab}
        activeChat={activeChat} setActiveChat={setActiveChat}
        search={search} setSearch={setSearch}
        settings={settings} setSettings={setSettings}
        myProfile={myProfile} filteredContacts={filteredContacts}
        groupsMock={groupsMock} groupChatsMock={groupChatsMock}
        callsMock={callsMock} statusMock={statusMock}
        setIsAddUserModalOpen={setIsAddUserModalOpen}
        setShowContactInfo={setShowContactInfo}
        showProfilePopup={showProfilePopup} setShowProfilePopup={setShowProfilePopup}
        setIsSettingsOpen={setIsSettingsOpen}
        setIsProfileModalOpen={setIsProfileModalOpen}
        setPreviewCall={setPreviewCall} setPreviewStatus={setPreviewStatus}
      />

      {activeTab === 'groups' && (
        <div className="w-[280px] bg-[#0E1321] border-r border-gray-800 hidden lg:flex flex-col z-10 shadow-xl">
          <div className="h-[88px] border-b border-gray-800 px-6 flex items-center bg-[#0E1321] sticky top-0 z-10">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">Group Context</h2>
          </div>
          <div className="flex-1 p-6 text-gray-500 text-sm italic">Select a group to see context...</div>
        </div>
      )}

      <ChatWindow
        currentContact={currentContact} currentMessages={currentMessages}
        messageInput={messageInput} setMessageInput={setMessageInput}
        handleSendMessage={(params) => handleSendMessage(messageInput, setMessageInput, params)}
        showEmojiPicker={showEmojiPicker} setShowEmojiPicker={setShowEmojiPicker}
        showAttachmentMenu={showAttachmentMenu} setShowAttachmentMenu={setShowAttachmentMenu}
        handleAttachmentSubmit={(e, type) => handleAttachmentSubmit(e, type, setMessageInput)}
        fileInputRef={fileInputRef} imageInputRef={imageInputRef}
        messagesEndRef={messagesEndRef}
        setViewingMedia={setViewingMedia}
        setShowContactInfo={setShowContactInfo} showContactInfo={showContactInfo}
        settings={settings} getProfilePic={resolveMediaURL}
      />

      <ContactPanel
        showContactInfo={showContactInfo} setShowContactInfo={setShowContactInfo}
        currentContact={currentContact} myProfile={myProfile}
      />

      {/* Immersive Status View */}
      {viewingStatus && (
        <div className="fixed inset-0 z-[500] bg-black/95 flex flex-col items-center justify-center animate-fade-in" onClick={() => setViewingStatus(null)}>
          <h2 className="text-white text-3xl font-bold tracking-tight">{viewingStatus.name}'s Status</h2>
          <p className="text-gray-400 mt-2 uppercase tracking-widest text-[10px] font-black">Immersion View Active</p>
          <button onClick={() => setViewingStatus(null)} className="mt-12 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all border border-white/10 backdrop-blur-md">Close Immersion</button>
        </div>
      )}
    </div>
  );
};

export default ChatFlow;  