import React, { useState } from "react";
import { Search, MessageSquarePlus, MoreVertical } from "lucide-react";
import { useTheme } from "../../theme/Theme";
import { data, Link, useNavigate } from "react-router-dom";
import useChatStore from "../../stores/useChatStore";
import ChatList from "./ChatList";
import { AnimatePresence, motion } from "motion/react";
import { useThemeStore } from "../../stores/useThemeStore";
import MobileMenu from "./MobileMenu";
import useAuthStore from "../../stores/useAuthStore";
import toast from "react-hot-toast";

const ChatListSidebar = () => {
  const theme = useTheme();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const toggleDarkMode = useThemeStore((state) => state.toggleDarkMode);
  const { logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { chats, selectedChat, setSelectedChat, isLoadingChats } =
    useChatStore();

  const navigate = useNavigate();

  const handleLogout = () => {
    const res = logout();
    if (res) toast.success("Logout Successfully !!");
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className={`flex flex-col h-full w-full ${theme.bg}`}>
      {/* Header / Search */}
      <div
        className={`px-4 py-1 ${theme.bg} flex items-center justify-between`}
      >
        <h1 className={`text-xl font-bold ${theme.text}`}>TalkifyX</h1>
        <div className="flex items-center justify-end gap-2">
          <Link
            to="/create"
            className={`not-md:hidden p-2 rounded-full ${theme.sidebarIconInactive} flex items-center`}
          >
            <MessageSquarePlus size={25} />
          </Link>

          <div className="md:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-full ${theme.sidebarIconInactive}`}
            >
              <MoreVertical />
            </motion.button>

            <MobileMenu
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              handleLogout={handleLogout}
              theme={theme}
            />
          </div>
        </div>
      </div>
      <div className={`flex-1 overflow-y-auto custom-scrollbar ${theme.bg}`}>
        <ChatList chats={chats} theme={theme} />
      </div>
      <motion.div
        variants={itemVariants}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate("/create")}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={`
    h-14 w-14 absolute right-5 bottom-24 md:hidden
    rounded-xl shadow-lg
    flex items-center justify-center
    transition-colors duration-300
    ${
      isDarkMode
        ? "bg-gradient-to-br from-cyan-600/90 to-blue-700/90 shadow-cyan-500/20"
        : "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/30"
    }
  `}
      >
        <MessageSquarePlus
          size={28}
          className={isDarkMode ? "text-white" : "text-white"}
        />
      </motion.div>
    </div>
  );
};

export default ChatListSidebar;
