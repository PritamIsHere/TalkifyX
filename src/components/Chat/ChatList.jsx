// import React, { useEffect, useState } from "react";
// import { MessageSquarePlus, Search, X } from "lucide-react";
// import useChatStore from "../../stores/useChatStore";
// import useAuthStore from "../../stores/useAuthStore";
// import { useTheme } from "../../theme/Theme";
// import { ChatItem } from "./ChatItem";
// import ChatListSkeleton from "../Loaders/ChatListSkeleton";
// import { Image } from "../../assets/image";
// import { motion } from "motion/react";
// import { Link, useNavigate } from "react-router-dom";
// import { useThemeStore } from "../../stores/useThemeStore";
// import ChatNotFound from "./ChatNotFound";

// const ChatList = () => {
//   const theme = useTheme();
//   const { user } = useAuthStore();

//   const {
//     chats,
//     fetchChats,
//     isLoadingChats,
//     selectedChat,
//     setSelectedChat,

//     searchContacts,
//     contactSearchResults,
//     isSearchingContacts,
//     clearContactSearch,
//   } = useChatStore();

//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate();
//   const isDarkMode = useThemeStore((state) => state.isDarkMode);

//   const handleSelectChat = (chat) => {
//     if (selectedChat?._id === chat._id) return;
//     setSelectedChat(chat);
//   };

//   const listVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.05,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, x: -10 },
//     visible: { opacity: 1, x: 0 },
//   };

//   const handleSearchChange = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);

//     if (query.trim()) {
//       searchContacts(query);
//     } else {
//       clearContactSearch();
//     }
//   };

//   const handleClearSearch = () => {
//     setSearchQuery("");
//     clearContactSearch();
//   };

//   const handleUserClick = (userId) => {
//     setSelectedChat(userId);
//     setSearchQuery("");
//   };

//   return (
//     <>
//       <div
//         className={`flex flex-col h-full w-full ${theme.bg} border-r ${theme.divider}`}
//       >
//         <div className="p-4 pb-2">
//           <div
//             className={`
//     flex items-center gap-2 px-3 py-2.5 rounded-xl border
//     transition-all duration-200
//     focus-within:ring-2 focus-within:ring-cyan-500/20
//     focus-within:border-cyan-500
//     ${theme.inputBg}
//   `}
//           >
//             {/* Search Icon */}
//             <Search size={18} className="text-slate-400 shrink-0" />

//             {/* Input */}
//             <input
//               type="text"
//               placeholder="Search users..."
//               value={searchQuery}
//               onChange={handleSearchChange}
//               className={`
//       flex-1 bg-transparent border-none outline-none text-sm
//       ${theme.text} placeholder:text-slate-400
//     `}
//             />
//             {isSearchingContacts && (
//               <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
//             )}
//             {searchQuery && !isSearchingContacts && (
//               <button
//                 onClick={handleClearSearch}
//                 className="text-slate-400 transition-colors"
//               >
//                 <X size={16} />
//               </button>
//             )}
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-2">
//           {searchQuery.length > 0 ? (
//             <>
//               <p className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
//                 Search Results
//               </p>
//               {contactSearchResults.length === 0 ? (
//                 <div className="text-center py-8 text-slate-500 text-sm">
//                   No users found
//                 </div>
//               ) : (
//                 contactSearchResults.map((user) => (
//                   <div
//                     key={user._id}
//                     onClick={() => handleUserClick(user._id)}
//                     className={`
//                     flex items-center gap-3 p-3 mb-1 rounded-xl cursor-pointer hover:${theme.cardBg} transition-colors
//                   `}
//                   >
//                     <img
//                       src={user.avatar || Image.defaultUser}
//                       alt={user.username}
//                       className="w-10 h-10 rounded-full object-cover"
//                     />
//                     <div>
//                       <h3 className={`text-sm font-semibold ${theme.text}`}>
//                         {user.username}
//                       </h3>
//                       <p className="text-xs text-slate-500">{user.email}</p>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </>
//           ) : (
//             <>
//               <motion.div
//                 variants={listVariants}
//                 initial="hidden"
//                 animate="visible"
//               >
//                 {isLoadingChats ? (
//                   <ChatListSkeleton />
//                 ) : !chats.length ? (
//                   <ChatNotFound />
//                 ) : (
//                   chats.map((chat) => (
//                     <motion.div
//                       key={chat._id}
//                       variants={itemVariants}
//                       whileTap={{ scale: 0.97 }}
//                       transition={{
//                         type: "spring",
//                         stiffness: 400,
//                         damping: 20,
//                       }}
//                     >
//                       <Link to="/chat">
//                         <ChatItem
//                           chat={chat}
//                           user={chat.users.find((u) => u._id !== user._id)}
//                           onClick={() => handleSelectChat(chat)}
//                         />
//                       </Link>
//                     </motion.div>
//                   ))
//                 )}
//               </motion.div>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default ChatList;

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import useChatStore from "../../stores/useChatStore";
import useAuthStore from "../../stores/useAuthStore";
import { useTheme } from "../../theme/Theme";
import { ChatItem } from "./ChatItem";
import ChatListSkeleton from "../Loaders/ChatListSkeleton";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useThemeStore } from "../../stores/useThemeStore";
import ChatNotFound from "./ChatNotFound";

const ChatList = () => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  const { chats, isLoadingChats, selectedChat, setSelectedChat } =
    useChatStore();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery) return true;

    const otherUser = chat.users.find((u) => u._id !== user._id);
    const username = otherUser?.username || "";

    return username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSelectChat = (chat) => {
    if (selectedChat?._id === chat._id) return;
    setSelectedChat(chat);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div
      className={`flex flex-col h-full w-full ${theme.bg} border-r ${theme.divider}`}
    >
      <div className="p-4 pb-2">
        <div
          className={`
            flex items-center gap-2 px-3 py-2.5 rounded-xl border
            transition-all duration-200
            focus-within:ring-2 focus-within:ring-cyan-500/20
            focus-within:border-cyan-500
            ${theme.inputBg}
          `}
        >
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search or start a new chat"
            value={searchQuery}
            onChange={handleSearchChange}
            className={`
              flex-1 bg-transparent border-none outline-none text-sm
              ${theme.text} placeholder:text-slate-400
            `}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="text-slate-400 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-2">
        <motion.div variants={listVariants} initial="hidden" animate="visible">
          {isLoadingChats ? (
            <ChatListSkeleton />
          ) : filteredChats.length === 0 ? (
            chats.length > 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No conversation found matching "{searchQuery}"
              </div>
            ) : (
              <ChatNotFound />
            )
          ) : (
            filteredChats.map((chat) => (
              <motion.div
                key={chat._id}
                variants={itemVariants}
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
                className="mb-1 last:mb-20"
              >
                <Link to="/chat">
                  <ChatItem
                    chat={chat}
                    user={chat.users.find((u) => u._id !== user._id)}
                    onClick={() => handleSelectChat(chat)}
                  />
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ChatList;
