import { useThemeStore } from "../stores/useThemeStore";

export const useTheme = () => {
  const isDark = useThemeStore((state) => state.isDarkMode);

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

    container: isDark
      ? "bg-slate-900 border-white/10"
      : "bg-white border-slate-200",
    inputBg: isDark
      ? "bg-slate-950 border-white/10 focus:border-cyan-500"
      : "bg-slate-50 border-slate-200 focus:border-cyan-500",
    inputIcon: isDark ? "text-slate-500" : "text-slate-400",
    errorBg: isDark
      ? "bg-red-500/10 text-red-400 border-red-500/20"
      : "bg-red-50 text-red-600 border-red-200",

    // --- NEW COLORS ADDED FOR SIDEBAR & MODAL ---

    // Sidebar Container
    sidebarBg: isDark
      ? "bg-slate-900 border-r border-white/5"
      : "bg-white border-r border-slate-200",

    // Navigation Icons
    sidebarIconActive: isDark
      ? "text-cyan-400 bg-cyan-400/10"
      : "text-cyan-600 bg-cyan-50",
    sidebarIconInactive: isDark
      ? "text-slate-500 hover:text-slate-300 hover:bg-white/5"
      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100",

    // Modal & Dialogs
    modalOverlay: isDark
      ? "bg-black/60 backdrop-blur-sm"
      : "bg-slate-900/20 backdrop-blur-sm",

    // Toggle Switch
    toggleBg: isDark ? "bg-slate-700" : "bg-slate-200",
    toggleBgActive: "bg-cyan-500", // Same for both modes usually, or customize

    // Dividers/Separators
    divider: isDark ? "border-white/5" : "border-slate-200",

    // Main Background (for chat area)
    mainBg: isDark ? "bg-slate-950" : "bg-slate-50",
  };

  return theme;
};
