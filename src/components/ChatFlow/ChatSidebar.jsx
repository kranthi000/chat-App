import React from "react";
import { 
  SidebarHeader, 
  SidebarSearch, 
  SidebarTabs, 
  SidebarList, 
  SidebarProfile 
} from "./SidebarSubComponents";

/**
 * Refactored ChatSidebar: Orchestrates the modular pieces of the sidebar.
 * Clean and easy to maintain.
 */
const ChatSidebar = (props) => {
  return (
    <div className="w-[320px] md:w-[380px] bg-[#0f1423]/90 backdrop-blur-2xl flex flex-col border-r border-gray-800/60 shadow-2xl z-20">
      
      {/* 1. Header with Logo & Controls */}
      <SidebarHeader 
        settings={props.settings} 
        setSettings={props.setSettings} 
        setIsAddUserModalOpen={props.setIsAddUserModalOpen} 
        showProfilePopup={props.showProfilePopup}
        setShowProfilePopup={props.setShowProfilePopup}
        setIsProfileModalOpen={props.setIsProfileModalOpen}
      />

      {/* 2. Global Search Component */}
      <SidebarSearch 
        search={props.search} 
        setSearch={props.setSearch} 
      />

      {/* 3. Navigation Tabs */}
      <SidebarTabs 
        activeTab={props.activeTab} 
        setActiveTab={props.setActiveTab} 
        setShowContactInfo={props.setShowContactInfo} 
      />

      {/* 4. Dynamic Content List (Chats/Groups/Calls/Status) */}
      <SidebarList {...props} />

      {/* 5. Bottom Profile Context */}
      <SidebarProfile 
        myProfile={props.myProfile} 
        showProfilePopup={props.showProfilePopup} 
        setShowProfilePopup={props.setShowProfilePopup} 
        setIsSettingsOpen={props.setIsSettingsOpen} 
        setIsProfileModalOpen={props.setIsProfileModalOpen}
      />
      
    </div>
  );
};

export default ChatSidebar;
