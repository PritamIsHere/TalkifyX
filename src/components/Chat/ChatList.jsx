import React from "react";
import { CheckCheck } from "lucide-react";
import { ChatItem } from "./ChatItem";
import ChatNotFound from "./ChatNotFound";
import ChatListSkeleton from "../Loaders/ChatListSkeleton";
import useChatStore from "../../stores/useChatStore";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const ChatList = ({ chats, theme }) => {
  const { setSelectedChat, selectedChat, isLoadingChats } = useChatStore();

  const handleSelectChat = (chat) => {
    if (selectedChat?._id === chat._id) return;
    setSelectedChat(chat);
  };

  return (
    <motion.div
      initial={{
        x: -50,
      }}
      animate={{
        x: 0,
      }}
      className={`w-full h-full ${theme.bg} ${theme.text} overflow-y-auto`}
    >
      {isLoadingChats ? (
        <ChatListSkeleton />
      ) : !chats.length ? (
        <ChatNotFound />
      ) : (
        chats.map((chat) => (
          <motion.div
            key={chat._id}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link to="/chat">
              <ChatItem
                chat={chat}
                user={chat.users[1]}
                onClick={() => handleSelectChat(chat)}
              />
            </Link>
          </motion.div>
        ))
      )}
    </motion.div>
  );
};
export default ChatList;
