import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users as UsersIcon,
  Settings,
  UserCircle,
  MessageSquareText,
  CircleFadingPlus,
  MoreVertical,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { useTheme } from "../../theme/Theme";
import { useThemeStore } from "../../stores/useThemeStore";
import { Image } from "../../assets/image";
import useAuthStore from "../../stores/useAuthStore";
import toast from "react-hot-toast";
import SettingsModal from "./SettingsModal";

const Sidebar = () => {
  const theme = useTheme();
  const location = useLocation();

  const user = useAuthStore((state) => state.user);

  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const logout = useAuthStore((state) => state.logout);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    const res = logout();
    if (res) {
      toast.success("Logout Successfully !!");
    }
  };

  const navItems = [
    { id: "chat", icon: MessageSquareText, label: "Chats", path: "/" },
    { id: "status", icon: CircleFadingPlus, label: "Status", path: "/status" },
    { id: "groups", icon: UsersIcon, label: "Groups", path: "/group" },
    { id: "profile", icon: UserCircle, label: "Profile", path: "/profile" },
  ];

  const isActivePath = (path) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname === path;
  };

  const DesktopNavButton = ({ item, onClick, isActionActive }) => {
    const isActive = item.path ? isActivePath(item.path) : isActionActive;

    const baseClass = `
      relative group flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 cursor-pointer
      ${isActive ? theme.sidebarIconActive : theme.sidebarIconInactive}
    `;

    if (item.path) {
      return (
        <Link to={item.path} className={baseClass} title={item.label}>
          {item.id === "profile" ? (
            <img
              src={user?.avatar || Image.defaultUser}
              alt="Profile"
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <item.icon strokeWidth={2} size={22} />
          )}
          {isActive && (
            <span className="absolute -right-2 w-1 h-8 bg-cyan-500 rounded-l-full" />
          )}
        </Link>
      );
    }

    return (
      <button onClick={onClick} className={baseClass} title={item.label}>
        <item.icon strokeWidth={2} size={22} />
        {isActive && (
          <span className="absolute -right-2 w-1 h-8 bg-cyan-500 rounded-l-full" />
        )}
      </button>
    );
  };

  const MobileNavLink = ({ item }) => {
    const active = isActivePath(item.path);
    return (
      <Link
        to={item.path}
        className={`
          flex flex-col items-center justify-center w-full h-full py-2 space-y-1
          ${active ? "text-cyan-500" : theme.textMuted}
        `}
      >
        {item.id === "profile" ? (
          <img
            src={user?.avatar || Image.defaultUser}
            alt="Profile"
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <item.icon strokeWidth={2} size={24} />
        )}
        {active && (
          <span className="absolute top-0 w-8 h-1 bg-cyan-500 rounded-b-full" />
        )}
      </Link>
    );
  };

  return (
    <>
      <aside
        className={`hidden md:flex flex-col justify-between w-20 h-full py-6 ${theme.bg} transition-colors duration-300 border-r ${theme.divider}`}
      >
        {/* Top Section */}
        <div className="flex flex-col items-center w-full gap-8">
          <div className="mb-2">
            <img className="h-12 w-12" src={Image.logo} alt="App logo" />
          </div>

          <div className="flex flex-col gap-4">
            {navItems
              .filter((i) => i.id !== "profile")
              .map((item) => (
                <DesktopNavButton key={item.id} item={item} />
              ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div className={`w-10 border-t ${theme.divider}`} />

          <DesktopNavButton
            item={{ icon: Settings, label: "Settings" }}
            onClick={() => setIsSettingsOpen(true)}
            isActionActive={isSettingsOpen}
          />

          {/* Profile Link */}
          <DesktopNavButton item={navItems.find((i) => i.id === "profile")} />
        </div>
      </aside>

      {/* MOBILE TOP HEADER - Hidden on chat detail pages */}
      {!location.pathname.startsWith("/chat/") && (
        <div
          className={`md:hidden fixed top-0 left-0 right-0 h-12 px-4 z-40 flex items-center justify-between ${theme.bg} border-b ${theme.divider} backdrop-blur-lg`}
        >
          <div className="flex items-center gap-3">
            <img className="h-10 w-10" src={Image.logo} alt="Logo" />
            <h1 className={`font-bold text-lg ${theme.text}`}>TalkifyX</h1>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-full ${theme.sidebarIconInactive}`}
            >
              <MoreVertical size={24} />
            </button>

            {/* Mobile Dropdown */}
            {isMobileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <div
                  className={`absolute right-0 top-12 w-48 rounded-xl shadow-2xl z-50 overflow-hidden border ${theme.divider
                    } ${isDarkMode
                      ? "bg-slate-900 border-white/5"
                      : "bg-white border-slate-200"
                    } `}
                >
                  {/* Theme Switcher */}
                  <div
                    onClick={toggleDarkMode}
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b ${theme.divider
                      } active:bg-black/5 ${isDarkMode ? "hover:bg-white/5" : "hover:bg-neutral-100"
                      }`}
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
                      className={`w-8 h-4 rounded-full relative transition-colors ${isDarkMode ? "bg-cyan-500" : "bg-slate-300"
                        }`}
                    >
                      <span
                        className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isDarkMode ? "left-4.5" : "left-0.5"
                          }`}
                      />
                    </div>
                  </div>

                  {/* MOBILE SETTINGS -> NAVIGATES TO ROUTE */}
                  <Link
                    to="/setting"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium ${theme.text
                      } active:bg-black/10 ${isDarkMode ? "hover:bg-white/5" : "hover:bg-neutral-100"
                      }`}
                  >
                    <Settings size={18} className={theme.textMuted} />
                    Settings
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium active:bg-black/10 ${isDarkMode ? "hover:bg-white/5" : "hover:bg-neutral-100"
                      } ${isDarkMode ? "text-red-400" : "text-red-600"}`}
                  >
                    <LogOut size={18} />
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav - Hidden on chat detail pages */}
      {!location.pathname.startsWith("/chat/") && (
        <div
          className={`md:hidden fixed bottom-0 left-0 right-0 h-16 z-40 ${theme.bg} border-t ${theme.divider} backdrop-blur-lg`}
        >
          <div className="flex justify-around items-center h-full px-2">
            {navItems.map((item) => (
              <MobileNavLink key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};

export default Sidebar;
