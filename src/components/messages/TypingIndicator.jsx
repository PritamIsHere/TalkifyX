import React from "react";
import { useTheme } from "../../theme/Theme";

const TypingIndicator = () => {
  const theme = useTheme();

  return (
    <div className="flex items-center gap-1 mb-4 ml-4">
      <div
        className={`
          relative flex items-center gap-1 px-4 py-3 rounded-2xl rounded-tl-none
          ${theme.cardBg} border ${theme.divider}
        `}
      >
        <div
          className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce"
          style={{ animationDuration: "0.6s" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce"
          style={{ animationDuration: "0.6s", animationDelay: "0.1s" }}
        />
        <div
          className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce"
          style={{ animationDuration: "0.6s", animationDelay: "0.2s" }}
        />
      </div>
    </div>
  );
};

export default TypingIndicator;
