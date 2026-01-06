import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
  Send,
  Mic,
  Check,
  CheckCheck,
  Image as ImageIcon,
} from "lucide-react";
import { useTheme } from "../../theme/Theme";
import { Image } from "../../assets/image";
import useChatStore from "../../stores/useChatStore";
import useAuthStore from "../../stores/useAuthStore";

const ChatScreen = () => {
  const { id } = useParams(); // Get chat ID from URL
  const navigate = useNavigate();
  const theme = useTheme();
  const messagesEndRef = useRef(null);
  const [messageInput, setMessageInput] = useState("");

  // Static mock data - Replace with API calls later
  // Current user ID - this should match the sender ID in messages
  const currentUserId = "currentUser";

  // Get the chat ID from URL (1, 2, 3, 4, 5, 6, etc.)
  const chatId = id || "1";
  const otherUserId = `user${chatId}`;

  const currentUser = useAuthStore((state) => state.user) || {
    _id: currentUserId,
    username: "You",
    avatar: Image.defaultUser,
  };

  // Static chat data based on ID from URL
  const staticChatData = {
    _id: chatId,
    users: [
      {
        _id: currentUserId,
        username: "You",
        avatar: Image.defaultUser,
      },
      {
        _id: otherUserId,
        username: `User ${chatId}`,
        avatar: Image.defaultUser,
      },
    ],
  };

  // Static messages data - Both users have sent messages
  // Use otherUserId dynamically based on URL parameter
  // Generate messages based on the chat ID
  const initialMessages = useMemo(() => [
    {
      _id: "msg1",
      content: "Hey! How are you doing?",
      sender: { _id: otherUserId },
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      status: "read",
    },
    {
      _id: "msg2",
      content: "I'm good, thanks for asking! How about you?",
      sender: { _id: currentUserId },
      createdAt: new Date(Date.now() - 3300000).toISOString(),
      status: "read",
    },
    {
      _id: "msg3",
      content: "I'm doing great! Just working on some projects.",
      sender: { _id: otherUserId },
      createdAt: new Date(Date.now() - 3000000).toISOString(),
      status: "read",
    },
    {
      _id: "msg4",
      content: "That's awesome! I'm also working on a React project right now.",
      sender: { _id: currentUserId },
      createdAt: new Date(Date.now() - 2700000).toISOString(),
      status: "read",
    },
    {
      _id: "msg5",
      content: "Nice! Are you using Tailwind CSS?",
      sender: { _id: otherUserId },
      createdAt: new Date(Date.now() - 2400000).toISOString(),
      status: "read",
    },
    {
      _id: "msg6",
      content: "Yes! Tailwind and Lucide icons. The dark mode support is tricky though.",
      sender: { _id: currentUserId },
      createdAt: new Date(Date.now() - 2100000).toISOString(),
      status: "read",
    },
    {
      _id: "msg7",
      content: "You'll figure it out. Let me know if you need help.",
      sender: { _id: otherUserId },
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      status: "read",
    },
    {
      _id: "msg8",
      content: "Thanks! I appreciate that. I'll definitely reach out if I get stuck.",
      sender: { _id: currentUserId },
      createdAt: new Date(Date.now() - 1500000).toISOString(),
      status: "read",
    },
    {
      _id: "msg9",
      content: "Sounds good! What features are you building?",
      sender: { _id: otherUserId },
      createdAt: new Date(Date.now() - 1200000).toISOString(),
      status: "read",
    },
    {
      _id: "msg10",
      content: "I'm building a chat application with real-time messaging. It's coming along nicely!",
      sender: { _id: currentUserId },
      createdAt: new Date(Date.now() - 900000).toISOString(),
      status: "read",
    },
    {
      _id: "msg11",
      content: "That sounds really cool! Are you using Socket.io for real-time?",
      sender: { _id: otherUserId },
      createdAt: new Date(Date.now() - 600000).toISOString(),
      status: "read",
    },
    {
      _id: "msg12",
      content: "Yes, exactly! Socket.io for WebSocket connections. It's working well so far.",
      sender: { _id: currentUserId },
      createdAt: new Date(Date.now() - 300000).toISOString(),
      status: "delivered",
    },
    {
      _id: "msg13",
      content: "That's impressive! Can't wait to see it when it's done.",
      sender: { _id: otherUserId },
      createdAt: new Date(Date.now() - 120000).toISOString(),
      status: "read",
    },
    {
      _id: "msg14",
      content: "Thanks! I'll share it with you once I finish the main features.",
      sender: { _id: currentUserId },
      createdAt: new Date(Date.now() - 60000).toISOString(),
      status: "sent",
    },
  ], [otherUserId, currentUserId]);

  const [staticMessages, setStaticMessages] = useState(initialMessages);

  // Update messages when chat ID changes
  useEffect(() => {
    setStaticMessages(initialMessages);
  }, [id, initialMessages]);

  // Use static data
  const selectedChat = staticChatData;
  const messages = staticMessages;
  const otherUser = staticChatData.users.find(
    (user) => user._id !== currentUserId && user._id !== currentUser?._id
  ) || staticChatData.users[1];

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    // Add new message from current user
    const newMessage = {
      _id: `msg${Date.now()}`,
      content: messageInput.trim(),
      sender: { _id: currentUserId }, // Use currentUserId to ensure correct sender
      createdAt: new Date().toISOString(),
      status: "sent",
    };

    setStaticMessages((prev) => [...prev, newMessage]);
    setMessageInput("");

    // Simulate automatic response after 1-2 seconds (optional - for demo purposes)
    setTimeout(() => {
      const responses = [
        "That's interesting!",
        "I see what you mean.",
        "Thanks for letting me know!",
        "Got it!",
        "Sounds good!",
        "I understand.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const autoResponse = {
        _id: `msg${Date.now()}_auto`,
        content: randomResponse,
        sender: { _id: otherUserId }, // Response from other user (dynamic based on URL id)
        createdAt: new Date().toISOString(),
        status: "read",
      };

      setStaticMessages((prev) => [...prev, autoResponse]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* --- MOBILE STATUS BAR (Mobile Only) --- */}
      <div
        className={`
        md:hidden fixed top-0 left-0 right-0 h-14 px-4 flex items-center gap-3 z-50
        border-b ${theme.divider} ${theme.navBg} backdrop-blur-md
      `}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 ${theme.text}`}
        >
          <ArrowLeft size={22} />
        </button>

        {/* User Icon */}
        <img
          src={otherUser?.avatar || Image.defaultUser}
          alt={otherUser?.username || "User"}
          className="w-9 h-9 rounded-full object-cover shrink-0"
        />

        {/* User Name */}
        <div className="flex-1 min-w-0">
          <span
            className={`font-semibold text-base truncate block ${theme.text}`}
          >
            {otherUser?.username || "User"}
          </span>
          <span className={`text-xs ${theme.textMuted} block -mt-1`}>
            Online
          </span>
        </div>

        {/* Mobile Header Actions */}
        <div className="flex items-center gap-1">
          <button
            className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 ${theme.sidebarIconInactive}`}
          >
            <Video size={20} />
          </button>
          <button
            className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 ${theme.sidebarIconInactive}`}
          >
            <Phone size={20} />
          </button>
          <button
            className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 ${theme.sidebarIconInactive}`}
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* --- DESKTOP HEADER --- */}
      <div
        className={`
        hidden md:flex h-16 px-4 items-center justify-between z-10
        border-b ${theme.divider} ${theme.navBg} backdrop-blur-md
      `}
      >
        <div className="flex items-center gap-3">
          {/* User Info */}
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src={otherUser?.avatar || Image.defaultUser}
              alt={otherUser?.username || "User"}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span
                className={`font-semibold text-base ${theme.text}`}
              >
                {otherUser?.username || "User"}
              </span>
              <span className={`text-xs ${theme.textMuted}`}>Online</span>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <button
            className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 ${theme.sidebarIconInactive}`}
          >
            <Video size={20} />
          </button>
          <button
            className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 ${theme.sidebarIconInactive}`}
          >
            <Phone size={20} />
          </button>
          <button
            className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 ${theme.sidebarIconInactive}`}
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* --- CHAT BACKGROUND (Optional: Add a pattern image here) --- */}
      <div
        className={`absolute inset-0 z-0 opacity-5 pointer-events-none ${theme.divider === "border-slate-200"
          ? "bg-grid-slate-800"
          : "bg-grid-slate-200"
          }`}
      />

      {/* --- MESSAGES AREA --- */}
      <div
        className={`
        flex-1 overflow-y-auto p-4 space-y-4 z-0 
        ${theme.mainBg} 
        custom-scrollbar
        md:mt-0 mt-14
      `}
      >
        {messages && messages.length > 0 ? (
          messages.map((msg) => {
            // Check if message is from current user
            const senderId = msg.sender?._id || msg.sender;
            const isMe = senderId === currentUserId; // simplified check for static data

            // Improved Date Formatting
            const messageTime = msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
              })
              : msg.time || "";

            return (
              <div
                key={msg._id || msg.id}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`
                    relative max-w-[85%] md:max-w-[70%] lg:max-w-[60%] px-4 py-2 rounded-xl shadow-sm text-sm md:text-[15px]
                    ${isMe
                      ? "bg-cyan-600 text-white rounded-tr-none"
                      : `${theme.sidebarBg} ${theme.text} border ${theme.divider} rounded-tl-none`
                    }
                  `}
                >
                  <p className="leading-relaxed wrap-break-word pb-4 md:pb-2">
                    {msg.content || msg.text}
                  </p>

                  {/* Meta: Time & Status */}
                  <div
                    className={`
                    absolute bottom-1 right-2 flex items-center gap-1 text-[10px] 
                    ${isMe ? "text-cyan-100" : theme.textMuted}
                  `}
                  >
                    <span>{messageTime}</span>
                    {isMe && (
                      <span>
                        {msg.status === "sent" && <Check size={14} />}
                        {msg.status === "delivered" && <CheckCheck size={14} />}
                        {msg.status === "read" && (
                          <CheckCheck size={14} className="text-blue-300" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className={`flex items-center justify-center h-full ${theme.textMuted}`}>
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <div
        className={`
        p-3 md:p-4 z-10
        ${theme.navBg} border-t ${theme.divider}
      `}
      >
        <form
          onSubmit={handleSendMessage}
          className="flex items-end gap-2 md:gap-3 w-full"
        >
          {/* Attachments / Emoji (Desktop) */}
          <div className="hidden md:flex gap-2 mb-2">
            <button
              type="button"
              className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 ${theme.textMuted}`}
            >
              <Smile size={22} />
            </button>
            <button
              type="button"
              className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 ${theme.textMuted}`}
            >
              <Paperclip size={22} />
            </button>
          </div>

          {/* Mobile Attachment (Simplified) */}
          <button
            type="button"
            className={`md:hidden mb-2 p-2 rounded-full hover:bg-black/5 ${theme.textMuted}`}
          >
            <Smile size={22} />
          </button>
          <button
            type="button"
            className={`md:hidden mb-2 p-2 rounded-full hover:bg-black/5 ${theme.textMuted}`}
          >
            <Paperclip size={22} />
          </button>

          {/* Text Input */}
          <div
            className={`
            flex-1 flex items-center gap-2 rounded-2xl px-4 py-3 border
            ${theme.sidebarBg} ${theme.divider}
          `}
          >
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className={`
                w-full bg-transparent border-none outline-none text-sm md:text-base resize-none 
                ${theme.text} placeholder:${theme.textMuted}
              `}
            />
          </div>

          {/* Send / Mic Button */}
          <button
            type="submit"
            className={`
              mb-1 p-3 rounded-full flex items-center justify-center transition-all duration-200
              ${messageInput.trim()
                ? "bg-cyan-500 text-white shadow-lg hover:bg-cyan-600"
                : `${theme.sidebarBg} ${theme.text} border ${theme.divider} hover:bg-black/5`
              }
            `}
          >
            {messageInput.trim() ? (
              <Send size={20} className="ml-0.5" /> // Slight offset for visual center
            ) : (
              <Mic size={20} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatScreen;
