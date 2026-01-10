import React from "react";
import { ArrowLeft, Info, MoreVertical, Phone, Video } from "lucide-react";
import useChatStore from "../../stores/useChatStore";
import useAuthStore from "../../stores/useAuthStore";
import { useTheme } from "../../theme/Theme";
import { getSender, getSenderImage, getSenderName } from "../../util/chatUtils";
import { useThemeStore } from "../../stores/useThemeStore";
import { Image } from "../../assets/image";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";

const ChatHeader = () => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const naviagte = useNavigate();

  const { selectedChat, setSelectedChat, isTyping, reSetSelectedChat } =
    useChatStore();

  if (!selectedChat) return null;

  const isGroup = selectedChat.isGroupChat;

  const otherUser = isGroup ? null : getSender(user, selectedChat.users);

  let statusText = "";
  if (isGroup) {
    statusText = `${selectedChat.users.length} members`;
  } else if (isTyping) {
    statusText = "Typing...";
  }

  const statusColor = isTyping
    ? "text-cyan-500 font-semibold"
    : theme.textMuted;

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 18,
      }}
      className={`
      w-full h-17 p-6 flex items-center justify-between 
      border-b ${theme.divider} ${theme.navBg} backdrop-blur-sm z-10 rounded-4xl
    `}
    >
      <div className="flex items-center gap-4">
        <div
          onClick={() => naviagte("/")}
          className="md:hidden p-2 -ml-2 rounded-full hover:bg-black/5 text-slate-500"
        >
          <ArrowLeft size={20} onClick={reSetSelectedChat} />
        </div>

        <div className="relative">
          <img
            src={
              isGroup ? Image.group : getSenderImage(user, selectedChat.users)
            }
            alt="Avatar"
            className={`w-10 h-10 rounded-full object-cover border ${
              isDarkMode ? "border-white/10" : "border-slate-200"
            }`}
          />

          {/* {!isGroup && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
          )} */}
        </div>

        <div className="flex flex-col justify-center">
          <h2 className={`text-base font-bold leading-tight ${theme.text}`}>
            {isGroup
              ? selectedChat.chatName
              : getSenderName(user, selectedChat.users)}
          </h2>

          <p className={`text-xs transition-all duration-200 ${statusColor}`}>
            {statusText}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          className={`p-2.5 rounded-full transition-colors ${theme.sidebarIconInactive}`}
        >
          <Info size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default ChatHeader;
