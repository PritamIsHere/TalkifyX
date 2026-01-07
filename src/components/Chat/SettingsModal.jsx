import { X, Moon, Sun, LogOut } from "lucide-react";
import { useThemeStore } from "../../stores/useThemeStore";
import { useTheme } from "../../theme/Theme";
import useAuthStore from "../../stores/useAuthStore";
import toast from "react-hot-toast";
import { motion } from "motion/react";

const SettingsModal = ({ isOpen, onClose }) => {
  const theme = useTheme();
  const isDark = useThemeStore((state) => state.isDarkMode);
  const toggleTheme = useThemeStore((state) => state.toggleDarkMode);
  const logout = useAuthStore((state) => state.logout);

  const handelLogout = () => {
    toast.success("Logout successfully !!");
    logout();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`fixed inset-0 z-50 flex items-center justify-center ${theme.modalOverlay}`}
    >
      {/* Modal Container */}
      <div
        className={`w-full max-w-md rounded-2xl p-6
         transform transition-all ${
           isDark
             ? "bg-neutral-900 border-white/10"
             : "bg-white border-slate-200 shadow-sm hover:shadow-md"
         }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${theme.text}`}>Settings</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${theme.sidebarIconInactive}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}

        <div className="space-y-6">
          {/* Theme Toggle Row */}

          <div
            className={`flex items-center justify-between p-4 rounded-xl ${
              isDark ? "bg-white/5" : "bg-neutral-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  isDark
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-purple-100 text-purple-600"
                }`}
              >
                {isDark ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <p className={`font-medium ${theme.text}`}>
                  {isDark ? "Dark" : "Light"} Mode
                </p>
                <p className={`text-sm ${theme.textMuted}`}>
                  Adjust the appearance
                </p>
              </div>
            </div>

            {/* Custom Toggle Switch */}
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${theme.toggleBgActive} `}
            >
              <span
                className={`flex h-4 w-4 transform bg-white rounded-full shadow-sm transition duration-200 ease-in-out translate-x-1 ${
                  isDark ? "translate-x-1" : "translate-x-7 bg-neutral-600"
                }`}
              />
            </button>
          </div>

          {/* Logout Biutton */}
          <div
            className={`flex items-center justify-between p-4 rounded-xl ${
              isDark ? "bg-white/5" : "bg-neutral-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                onClick={handelLogout}
                className={`p-2 rounded-full ${
                  isDark
                    ? "bg-purple-500/20 text-red-400"
                    : "bg-purple-100 text-red-600"
                }`}
              >
                <LogOut size={20} />
              </div>
              <p className={`font-medium ${theme.text}`}>Log out</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsModal;
