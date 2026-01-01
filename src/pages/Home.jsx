import React, { useState, useEffect } from "react";
import {
  Layout,
  MessageSquare,
  Users,
  CircleDashed,
  Settings,
  Phone,
  Video,
  Search,
  Paperclip,
  Mic,
  Send,
  MoreVertical,
  Heart,
  Bell,
  FileText,
  Image as ImageIcon,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { useThemeStore } from "../stores/useThemeStore";

import { useChatStore } from "../stores/useChatStore";

const Home = () => {
  // --- COMPONENTS ---

  const [activeTab, setActiveTab] = useState("chat");
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  const NavigationSidebar = React.memo(() => {
    const NavItem = ({ icon: Icon, id }) => (
      <button
        onClick={() => setActiveTab(id)}
        className={`p-3 rounded-xl transition-all duration-300 mb-4 ${
          activeTab === id
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
            : "text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
        }`}
      >
        <Icon size={24} strokeWidth={1.5} />
      </button>
    );

    return (
      <div className="h-screen w-20 flex flex-col items-center py-8 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-shrink-0 z-50 transition-colors duration-300">
        <div className="mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-indigo-500/20 shadow-lg">
            Q
          </div>
        </div>
        <div className="flex-1 flex flex-col w-full items-center">
          <NavItem icon={MessageSquare} id="chat" />
          <NavItem icon={CircleDashed} id="status" />
          <NavItem icon={Users} id="groups" />

          <div className="mt-auto flex flex-col gap-4 items-center">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-3 rounded-xl text-slate-400 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
            <NavItem icon={Settings} id="settings" />
          </div>
        </div>
      </div>
    );
  });

  // 2. Chat List Sidebar
  const ChatListSidebar = () => {
    const { contacts, activeContactId, setActiveContact, currentUser } =
      useChatStore();

    return (
      <div className="w-80 h-full bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-300">
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt="Me"
                className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">
                {currentUser.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {currentUser.role}
              </p>
            </div>
            <button className="ml-auto text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
              <FileText size={18} />
            </button>
          </div>

          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search Friends"
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 rounded-2xl border-none text-sm text-slate-600 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500/20 outline-none shadow-sm placeholder-slate-400 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">
            Messages
          </h4>
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setActiveContact(contact.id)}
              className={`flex items-start gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 mb-2 ${
                activeContactId === contact.id
                  ? "bg-white dark:bg-slate-900 shadow-md dark:shadow-none scale-[1.02]"
                  : "hover:bg-white/60 dark:hover:bg-slate-900/50"
              }`}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {contact.status === "online" && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4
                    className={`text-sm font-semibold truncate ${
                      activeContactId === contact.id
                        ? "text-indigo-900 dark:text-indigo-100"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {contact.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {contact.time}
                  </span>
                </div>
                <p
                  className={`text-xs truncate ${
                    activeContactId === contact.id
                      ? "text-indigo-500 dark:text-indigo-400 font-medium"
                      : "text-slate-500 dark:text-slate-500"
                  }`}
                >
                  {contact.lastMessage}
                </p>
              </div>
              {contact.unread > 0 && (
                <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[10px] text-white font-bold">
                    {contact.unread}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 3. Main Chat Area
  const ChatWindow = () => {
    const { contacts, activeContactId, messages, addMessage } = useChatStore();
    const activeUser = contacts.find((c) => c.id === activeContactId);
    const [inputValue, setInputValue] = useState("");

    const handleSend = () => {
      if (!inputValue.trim()) return;
      addMessage(inputValue);
      setInputValue("");
    };

    return (
      <div className="flex-1 h-full bg-white dark:bg-slate-900 flex flex-col relative transition-colors duration-300">
        {/* Header */}
        <div className="h-20 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm z-10 transition-colors">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={activeUser?.avatar}
                className="w-10 h-10 rounded-full object-cover"
                alt=""
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            </div>
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight">
                {activeUser?.name}
              </h2>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs text-slate-400">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button className="hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-full transition-colors">
              <Search size={20} />
            </button>
            <button className="hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-full transition-colors">
              <Heart size={20} />
            </button>
            <button className="hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-full transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30 dark:bg-slate-950/30">
          {messages.map((msg) => {
            const isMe = msg.senderId === "me";
            return (
              <div
                key={msg.id}
                className={`flex gap-4 mb-6 ${isMe ? "flex-row-reverse" : ""}`}
              >
                {!isMe && (
                  <img
                    src={activeUser?.avatar}
                    className="w-8 h-8 rounded-full object-cover self-end mb-1"
                    alt=""
                  />
                )}

                <div
                  className={`max-w-[60%] flex flex-col ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  {msg.type === "file" ? (
                    <div
                      className={`p-3 rounded-xl flex items-center gap-3 ${
                        isMe
                          ? "bg-indigo-600 text-white"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          isMe
                            ? "bg-indigo-500"
                            : "bg-indigo-50 dark:bg-indigo-500/20"
                        }`}
                      >
                        <FileText
                          size={20}
                          className={
                            isMe
                              ? "text-white"
                              : "text-indigo-600 dark:text-indigo-400"
                          }
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{msg.text}</p>
                        <p
                          className={`text-[10px] ${
                            isMe ? "text-indigo-200" : "text-slate-400"
                          }`}
                        >
                          {msg.size}
                        </p>
                      </div>
                      <button
                        className={`ml-2 p-1 rounded-full ${
                          isMe
                            ? "hover:bg-indigo-500"
                            : "hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        <div className="rotate-90">➔</div>
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm dark:shadow-none ${
                        isMe
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-bl-none border border-slate-100 dark:border-slate-700/50"
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 mt-1.5 px-1">
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-2 flex items-center gap-2 pr-2 transition-colors">
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-600 dark:text-slate-200 placeholder-slate-400 px-4 py-2"
              placeholder="Write Something..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <div className="flex items-center gap-1 text-slate-400">
              <button className="p-2 hover:bg-white dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all">
                <Paperclip size={20} />
              </button>
              <button className="p-2 hover:bg-white dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all">
                <ImageIcon size={20} />
              </button>
              <button className="p-2 hover:bg-white dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all">
                <Mic size={20} />
              </button>
            </div>
            <button
              onClick={handleSend}
              className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 4. Right Profile Sidebar
  const ProfileSidebar = () => {
    const { contacts, activeContactId } = useChatStore();
    const activeUser = contacts.find((c) => c.id === activeContactId);

    if (!activeUser) return null;

    return (
      <div className="w-80 h-full bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col overflow-y-auto transition-colors duration-300">
        <div className="relative mb-8">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            placeholder="Search People"
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 rounded-2xl text-sm border-none shadow-sm dark:shadow-none text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/20 outline-none placeholder-slate-400 transition-colors"
          />
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full p-1 border-2 border-indigo-100 dark:border-slate-800 mb-4 bg-white dark:bg-slate-900 transition-colors">
            <img
              src={activeUser.avatar}
              className="w-full h-full rounded-full object-cover"
              alt=""
            />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {activeUser.name}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {activeUser.role}
          </p>

          <div className="flex gap-4 w-full px-2">
            <button className="flex-1 flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 rounded-2xl hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <MessageSquare size={20} fill="currentColor" />
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                Chat
              </span>
            </button>
            <button className="flex-1 flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-900 rounded-2xl hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-2 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Video size={20} fill="currentColor" />
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                Call
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <button className="w-full flex items-center gap-3 p-3 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 rounded-xl transition-all">
            <Users size={20} />{" "}
            <span className="text-sm font-medium">View Friends</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 rounded-xl transition-all">
            <Heart size={20} />{" "}
            <span className="text-sm font-medium">Add to Favorites</span>
          </button>
        </div>

        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 px-2">
            Attachments
          </h3>
          <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar">
            {["PDF", "Video", "MP3", "Image"].map((type, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-2 ${
                  type === "PDF"
                    ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      <div className="h-screen w-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center font-sans antialiased text-slate-900 transition-colors duration-300">
        {/* Main Container */}
        <div className="w-full h-full max-w-[1920px] bg-white dark:bg-slate-950 flex overflow-hidden shadow-2xl dark:shadow-black/50 transition-colors duration-300">
          <NavigationSidebar />
          <div className="flex-1 flex min-w-0">
            <ChatListSidebar />
            <ChatWindow />
            <ProfileSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
