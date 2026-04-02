import React from "react";

const ContactPanel = ({ 
  showContactInfo, 
  setShowContactInfo, 
  currentContact, 
  myProfile 
}) => {
  if (!showContactInfo || !currentContact) return null;

  return (
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
  );
};

export default ContactPanel;
