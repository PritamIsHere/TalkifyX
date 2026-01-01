import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Menu, X, Sun, Moon } from "lucide-react";
import { useThemeStore } from "../stores/useThemeStore";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const isDark = useThemeStore((state) => state.isDarkMode);
  const setIsDark = useThemeStore((state) => state.toggleDarkMode);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const theme = {
    bg: isDark ? "bg-slate-950" : "bg-slate-50",
    text: isDark ? "text-white" : "text-slate-900",
    textMuted: isDark ? "text-slate-400" : "text-slate-600",
    navBg: isDark
      ? "bg-slate-950/70 border-white/5"
      : "bg-white/70 border-slate-200",
    cardBg: isDark
      ? "bg-white/5 border-white/5 hover:bg-white/10"
      : "bg-white border-slate-200 shadow-sm hover:shadow-md",
    bubbleOther: isDark
      ? "bg-slate-800/80 border-white/10"
      : "bg-white/80 border-slate-200 shadow-lg",
    bubbleTextOther: isDark ? "text-white" : "text-slate-800",
    footer: isDark
      ? "bg-slate-950 border-white/5"
      : "bg-slate-100 border-slate-200",
    blobBlue: isDark ? "bg-blue-600/20" : "bg-blue-400/20",
    blobPurple: isDark ? "bg-purple-600/20" : "bg-purple-400/20",
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 px-6 py-4 backdrop-blur-md border-b transition-colors duration-300 ${theme.navBg} ${theme.text}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <NavLink
            to="/home"
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <MessageCircle size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">TalkifyX</span>
          </NavLink>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-6 mr-4 border-r border-slate-500/20 pr-6">
              {["Features", "Pricing", "About"].map((item) => (
                <NavLink
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`text-sm font-medium transition-colors ${theme.textMuted} hover:text-cyan-500`}
                >
                  {item}
                </NavLink>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-full transition-colors ${
                isDark
                  ? "hover:bg-white/10 text-neutral-400"
                  : "hover:bg-slate-200 text-slate-600"
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Auth Buttons */}
            <Link
              to="/login"
              className={`text-sm font-semibold transition-colors ${theme.text} hover:text-cyan-500`}
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:shadow-cyan-500/40 transition-all"
            >
              Register
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className={theme.text} />
            ) : (
              <Menu className={theme.text} />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden border-b overflow-hidden mt-3 ${
                isDark
                  ? "bg-slate-900 border-white/5"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex flex-col p-6 gap-4">
                {["Features", "Pricing", "About"].map((item) => (
                  <NavLink
                    key={item}
                    href="#"
                    className={`text-lg font-medium ${theme.text}`}
                  >
                    {item}
                  </NavLink>
                ))}
                <hr
                  className={`border-t ${
                    isDark ? "border-white/10" : "border-slate-100"
                  }`}
                />
                <div className="flex items-center justify-between">
                  <span className={theme.textMuted}>Switch Theme</span>
                  <button onClick={() => setIsDark(!isDark)} className="p-2">
                    {isDark ? <Sun className="text-neutral-400" /> : <Moon />}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Link
                    to="/login"
                    className={`py-3 rounded-xl font-semibold border text-center ${
                      isDark
                        ? "border-white/10 text-white"
                        : "border-slate-200 text-slate-800"
                    }`}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="py-3 rounded-xl font-semibold bg-blue-600 text-white text-center"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
