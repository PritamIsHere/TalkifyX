import React from "react";
import MessageList from "../messages/MessageList";
import useChatStore from "../../stores/useChatStore";
import { useTheme } from "../../theme/Theme";
import { Navigate } from "react-router-dom";
import ChatHeader from "../messages/ChatHeader";
import ChatInput from "../messages/ChatInput";
import { AnimatePresence, motion } from "motion/react";
import TypingIndicator from "../messages/TypingIndicator";

const ChatScreen = () => {
  const { selectedChat, isLoadingMessages, isTyping } = useChatStore();
  const theme = useTheme();
  if (!selectedChat) {
    return (
      <div
        className={`flex-1 flex flex-col items-center justify-center h-full ${theme.bg}`}
      >
        <p className={`${theme.textMuted} text-lg`}>
          Select a conversation to start chatting
          <Navigate to="/" replace />
        </p>
      </div>
    );
  }

  return (
    <motion.div
      key={selectedChat._id}
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -50, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 18,
      }}
      className={`flex flex-col h-full w-full relative ${theme.bg}`}
    >
      <ChatHeader />
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-opacity-50">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <MessageList />
        )}
        {isTyping && <TypingIndicator />}
      </div>
      <div className="bg-transparent px-5">
        <ChatInput />
      </div>
    </motion.div>
  );
};

export default ChatScreen;
