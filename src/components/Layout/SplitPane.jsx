import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTheme } from "../../theme/Theme";
import { AnimatePresence, motion } from "motion/react";

const SplitPane = ({ leftContent, basePath }) => {
  const theme = useTheme();
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/+$/, "");
  const base = basePath.replace(/\/+$/, "");

  const isDetailPage = currentPath !== base;

  return (
    <div className="flex w-full h-full">
      {/* --- LEFT PANE (The List) --- */}
      <>
        <div
          className={`
          flex-col h-full border-r ${theme.divider} transition-all duration-300
          w-full md:w-[320px] lg:w-[380px] xl:w-[420px] 
          ${theme.sidebarBg}
          ${isDetailPage ? "hidden md:flex" : "flex"} 
          `}
        >
          {leftContent}
        </div>
      </>

      {/* --- RIGHT PANE (The Conversation/Detail) --- */}

      <div
        className={`
          flex-1 h-full flex-col relative
          ${theme.mainBg}
          ${!isDetailPage ? "hidden md:flex" : "flex"}
        `}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default SplitPane;
