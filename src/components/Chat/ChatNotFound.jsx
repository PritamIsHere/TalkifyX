import React from "react";
import { UserPlus, MessageSquareMore } from "lucide-react";
import { useTheme } from "../../theme/Theme";
import { useNavigate } from "react-router-dom";
const ChatNotFound = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col items-center justify-center w-full p-6 text-center animate-fade-in-up">
      <div
        className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-transform hover:scale-105 ${theme.blobBlue}`}
      >
        <MessageSquareMore
          size={48}
          className="text-cyan-500 opacity-90"
          strokeWidth={1.5}
        />
      </div>
      <h3 className={`text-xl font-bold mb-2 ${theme.text}`}>No Chats Yet</h3>

      <p
        className={`text-sm mb-8 max-w-[260px] leading-relaxed ${theme.textMuted}`}
      >
        Your inbox is looking a bit empty. Search for a friend using their code
        to start a new conversation.
      </p>
      <button
        onClick={() => navigate("/create")}
        className="
          flex items-center gap-2 px-6 py-3 rounded-xl 
          bg-gradient-to-r from-cyan-500 to-blue-500 
          hover:from-cyan-600 hover:to-blue-600
          text-white font-medium shadow-lg shadow-cyan-500/25 
          transform transition-all duration-200 active:scale-95
        "
      >
        <UserPlus size={20} />
        <span>Start Conversation</span>
      </button>
    </div>
  );
};

export default ChatNotFound;
