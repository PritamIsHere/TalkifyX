import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const menuVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.18, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    x: 8,
    transition: { duration: 0.12 },
  },
};

const MobileMenu = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isDarkMode,
  toggleDarkMode,
  handleLogout,
  theme,
}) => {
  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu */}
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`absolute right-0 top-12 w-48 rounded-xl shadow-2xl z-50 overflow-hidden border
              ${theme.divider}
              ${
                isDarkMode
                  ? "bg-slate-900 border-white/5"
                  : "bg-white border-slate-200"
              }
            `}
          >
            {/* Theme Switch */}
            <motion.div
              variants={itemVariants}
              whileTap={{ scale: 0.97 }}
              onClick={toggleDarkMode}
              className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b
                ${theme.divider}
                ${isDarkMode ? "hover:bg-white/5" : "hover:bg-neutral-100"}
              `}
            >
              <div className="flex items-center gap-3">
                {isDarkMode ? (
                  <Moon size={18} className="text-purple-400" />
                ) : (
                  <Sun size={18} className="text-orange-400" />
                )}
                <span className={`text-sm font-medium ${theme.text}`}>
                  Theme
                </span>
              </div>

              <div
                className={`w-8 h-4 rounded-full relative transition-colors
                  ${isDarkMode ? "bg-cyan-500" : "bg-slate-300"}
                `}
              >
                <span
                  className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all
                    ${isDarkMode ? "left-4.5" : "left-0.5"}
                  `}
                />
              </div>
            </motion.div>

            {/* Settings */}
            <motion.div variants={itemVariants}>
              <Link
                to="/setting"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium
                  ${theme.text}
                  ${isDarkMode ? "hover:bg-white/5" : "hover:bg-neutral-100"}
                `}
              >
                <Settings size={18} className={theme.textMuted} />
                Settings
              </Link>
            </motion.div>

            {/* Logout */}
            <motion.button
              variants={itemVariants}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium
                ${
                  isDarkMode
                    ? "text-red-400 hover:bg-white/5"
                    : "text-red-600 hover:bg-neutral-100"
                }
              `}
            >
              <LogOut size={18} />
              Log out
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
