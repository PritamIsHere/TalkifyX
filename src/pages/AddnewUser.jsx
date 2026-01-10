import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Search,
  UserPlus,
  X,
  MessageSquare,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import { useTheme } from "../theme/Theme";
import { Image } from "../assets/image";
import { api } from "../api/api";
import toast from "react-hot-toast";
import useChatStore from "../stores/useChatStore";
import { motion, AnimatePresence } from "motion/react";

const AddnewUser = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const loadUser = useAuthStore((state) => state.loadUser);
  const accessChat = useChatStore((s) => s.accessChat);

  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  
  const [selectedUser, setSelectedUser] = useState(null);
  const [adding, setAdding] = useState(false);

  
  useEffect(() => {
    if (!user) loadUser();
  }, [user, loadUser]);

  const handleSearch = async (e) => {
    e?.preventDefault?.();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchError("");
    setSearchResult(null);

    try {
      const { data } = await api.get("/user/search", {
        params: { code: searchQuery.trim() },
      });
      // console.log(data);
      setSearchResult(data);
    } catch (err) {
      if (err?.response?.status === 404) {
        setSearchError("No user found with this code");
      } else {
        setSearchError("Search failed");
      }
      setSearchResult(null);
    } finally {
      setSearching(false);
    }
  };

  const handleAddUser = async () => {
    if (!selectedUser) return;
    setAdding(true);
    try {
      await accessChat(selectedUser._id);
      toast.success(`Connected with ${selectedUser.username}`);
      setSelectedUser(null);
      navigate("/"); 
    } catch (err) {
      console.error(err);
      toast.error("Failed to create connection");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden ${theme.bg}`}>
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className={`flex flex-col h-full w-full md:w-[450px] ${theme.bg} border-r ${theme.divider} flex-shrink-0 z-10 relative`}
      >
        {/* Header */}
        <div className={`flex items-center gap-4 px-6 py-5 ${theme.bg}`}>
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${theme.text}`}
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className={`text-xl font-semibold ${theme.text}`}>
            New Connection
          </h1>
        </div>

        {/* Search Area */}
        <div className="px-6 mt-4">
          <form onSubmit={handleSearch} className="relative group">
            <div
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.textMuted} transition-colors group-focus-within:text-cyan-500`}
            >
              <Search size={20} />
            </div>
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter User Unique ID..."
              className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all duration-300
                ${theme.inputBg} ${theme.text} 
                border-transparent focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 shadow-sm`}
            />
            {searching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </form>

          {/* Error Message */}
          {searchError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-500/10 text-red-500 rounded-lg text-sm flex items-center gap-2"
            >
              <Info size={16} />
              {searchError}
            </motion.div>
          )}
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {searchResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSelectedUser(searchResult)}
              className={`
                cursor-pointer group relative overflow-hidden
                p-4 rounded-2xl border ${theme.divider}
                hover:border-cyan-500/30 transition-all duration-300
                ${theme.sidebarBg} hover:shadow-lg
              `}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <img
                    src={searchResult.avatar || Image.defaultUser}
                    alt={searchResult.username}
                    className="h-14 w-14 rounded-full object-cover border-2 border-transparent  transition-all"
                  />
                  {/* <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div> */}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-lg ${theme.text}`}>
                    {searchResult.username}
                  </h3>
                  <p className={`text-sm ${theme.textMuted}`}>
                    ID: {searchResult.userCode}
                  </p>
                </div>
                <div
                  className={`p-2 rounded-full ${theme.divider} group-hover:bg-cyan-500 group-hover:text-white transition-colors`}
                >
                  <UserPlus size={20} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* --- RIGHT SIDE: Placeholder --- */}
      <div
        className={`hidden md:flex flex-1 flex-col items-center justify-center ${theme.mainBg}`}
      >
        <div className="flex flex-col items-center text-center max-w-md px-6 opacity-50">
          <div
            className={`p-8 rounded-full ${theme.sidebarBg} mb-6 border ${theme.divider}`}
          >
            <UserPlus size={64} className={theme.text} strokeWidth={1} />
          </div>
          <h2 className={`text-2xl font-light mb-2 ${theme.text}`}>
            Find People
          </h2>
          <p className={`${theme.textMuted}`}>
            Search for users by their unique ID to start a new conversation.
          </p>
        </div>
      </div>

      {/* --- MODAL: User Details --- */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 40 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className={`
          relative w-full max-w-md rounded-3xl overflow-hidden
          shadow-2xl
          ${theme.bg}
        `}
            >
              {/* Header / Banner */}
              <div className="relative h-28 bg-gradient-to-r from-cyan-500 to-blue-600">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-4 right-4 p-2 rounded-full
              bg-black/30 hover:bg-black/50 text-white transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 -mt-14 flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-3">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 blur-md opacity-40" />
                  <img
                    src={selectedUser.avatar || Image.defaultUser}
                    alt={selectedUser.username}
                    className="relative w-24 h-24 rounded-full object-cover shadow-lg"
                  />
                </div>

                {/* Name */}
                <h2 className={`text-xl font-semibold ${theme.text}`}>
                  {selectedUser.username}
                </h2>

                {/* User Code */}
                <div
                  className={`mt-1 inline-flex items-center gap-2 px-3 py-1
              rounded-full text-xs font-medium
              bg-black/5 dark:bg-white/10 ${theme.textMuted}`}
                >
                  <span className="opacity-70">ID</span>
                  <span className="font-mono">{selectedUser.userCode}</span>
                </div>

                {/* Bio */}
                <p
                  className={`mt-5 text-sm leading-relaxed max-w-xs ${theme.textMuted}`}
                >
                  {selectedUser.about ||
                    selectedUser.bio ||
                    "Hey there! I am using this chat app."}
                </p>

                {/* Actions */}
                <div className="mt-8 w-full grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedUser(null)}
                    disabled={adding}
                    className={`
                py-3 rounded-xl font-medium border
                ${theme.divider} ${theme.text}
                hover:bg-black/5 dark:hover:bg-white/10 transition
              `}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleAddUser}
                    disabled={adding}
                    className="
                py-3 rounded-xl font-medium text-white
                bg-gradient-to-r from-cyan-500 to-blue-600
                hover:from-cyan-400 hover:to-blue-500
                active:scale-95 transition-all
                flex items-center justify-center gap-2
                shadow-lg shadow-cyan-500/20
              "
                  >
                    {adding ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <MessageSquare size={18} />
                        Add User
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddnewUser;
