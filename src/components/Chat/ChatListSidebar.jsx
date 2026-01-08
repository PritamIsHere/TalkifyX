import React from "react";
import { Search, MessageSquarePlus } from "lucide-react";
import { useTheme } from "../../theme/Theme";
import { data, Link } from "react-router-dom";
import useChatStore from "../../stores/useChatStore";
import ChatList from "./ChatList";
import { AnimatePresence, motion } from "motion/react";

const ChatListSidebar = () => {
  const theme = useTheme();
  const { chats, selectedChat, setSelectedChat, isLoadingChats } =
    useChatStore();

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header / Search */}
      <div
        className={`p-4 border-b ${theme.navBg} flex items-center justify-between`}
      >
        <h1 className={`text-xl font-bold ${theme.text}`}>Chats</h1>
        <Link to="/create">
          <MessageSquarePlus size={25} />
        </Link>
        <div
          className={`flex items-center px-4 py-2 rounded-lg border ${theme.divider} ${theme.navBg}`}
        >
          <Search size={20} className={theme.textMuted} />
          <input
            type="text"
            placeholder="Search or start new chat"
            className={`bg-transparent border-none outline-none ml-3 w-full text-sm ${theme.text}`}
          />
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto custom-scrollbar ${theme.bg}`}>
        <ChatList chats={chats} theme={theme} />
      </div>
    </div>
  );
};

export default ChatListSidebar;
