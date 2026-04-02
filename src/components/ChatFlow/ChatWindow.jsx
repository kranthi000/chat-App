import React from "react";
import {
  ChatWindowHeader,
  MessageList,
  ChatInputArea
} from "./ChatSubComponents";

/**
 * Refactored ChatWindow: Orchestrates the chat experience.
 * Uses modular components for Header, Message List, and Input Area.
 */
const ChatWindow = (props) => {
  if (!props.currentContact) return null;

  return (
    <div className="flex-1 flex flex-col relative bg-[#0B0F19] z-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(15, 20, 35, 0.4) 0%, rgba(11, 15, 25, 1) 100%), repeating-radial-gradient(circle at 0 0, transparent 0, #0B0F19 14px), repeating-linear-gradient(#1f293708, #1f293708 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, #1f293708, #1f293708 1px, transparent 1px, transparent 24px)' }}>

      {/* 1. Decorative Background Elements (Glassmorphic) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600 rounded-full mix-blend-screen filter blur-[150px] opacity-[0.25]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-pink-600 rounded-full mix-blend-screen filter blur-[150px] opacity-[0.22]"></div>
        <div className="absolute top-[40%] right-[30%] w-[40%] h-[40%] bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-[0.2]"></div>
      </div>

      {/* 2. Top Chat Header Section */}
      <ChatWindowHeader
        currentContact={props.currentContact}
        setShowContactInfo={props.setShowContactInfo}
        showContactInfo={props.showContactInfo}
      />

      {/* 3. Central Messages Area */}
      <MessageList
        currentMessages={props.currentMessages}
        currentContact={props.currentContact}
        setViewingMedia={props.setViewingMedia}
        messagesEndRef={props.messagesEndRef}
      />

      {/* 4. Interactive Bottom Input Bar */}
      <ChatInputArea
        messageInput={props.messageInput}
        setMessageInput={props.setMessageInput}
        handleSendMessage={props.handleSendMessage}
        showEmojiPicker={props.showEmojiPicker}
        setShowEmojiPicker={props.setShowEmojiPicker}
        settings={props.settings}
        showAttachmentMenu={props.showAttachmentMenu}
        setShowAttachmentMenu={props.setShowAttachmentMenu}
        fileInputRef={props.fileInputRef}
        imageInputRef={props.imageInputRef}
        handleAttachmentSubmit={props.handleAttachmentSubmit}
      />

    </div>
  );
};

export default ChatWindow;
