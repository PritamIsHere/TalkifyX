import React, { useState, useRef, useEffect } from "react";
import { Send, Smile, Paperclip, Image as ImageIcon, Mic } from "lucide-react";
import { useTheme } from "../../theme/Theme";
import useChatStore from "../../stores/useChatStore";
import { useThemeStore } from "../../stores/useThemeStore";

const ChatInput = () => {
  const theme = useTheme();
  const isDark = useThemeStore((state) => state.isDarkMode);
  const {
    sendMessage,
    emitTyping,
    emitStopTyping,
    messages,
    isSendingMessage,
    isTyping,
  } = useChatStore();

  const [content, setContent] = useState("");
  const [typing, setTyping] = useState(false);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    textareaRef.current.focus();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        128
      )}px`;
    }
  }, [content, isTyping, messages]);

  const handleTyping = (e) => {
    setContent(e.target.value);

    if (!typing) {
      setTyping(true);
      emitTyping();
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping();
      setTyping(false);
    }, 3000);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    await sendMessage(content);

    setContent("");
    emitStopTyping();
    setTyping(false);

    if (textareaRef.current) textareaRef.current.style.height = "44px";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div
      className={`
      w-full px-4 backdrop-blur-xl my-3  
      border rounded-4xl transition-all duration-200 ease-out
            focus-within:ring-2 focus-within:ring-cyan-500/50 ${theme.bg}
            ${
              isDark
                ? "bg-slate-900 border-slate-800"
                : "bg-slate-100 border-slate-200 shadow-md"
            }
    `}
    >
      <form
        onSubmit={handleSend}
        className="relative flex items-end gap-2 max-w-6xl mx-auto"
      >
        {/* Left Actions Group */}
        <div className="flex items-center gap-1 mb-1.5 text-slate-400">
          <button
            type="button"
            className={`p-2 rounded-full transition-all duration-200 hover:bg-slate-100 ${
              isDark && "hover:bg-white/10"
            } hover:text-cyan-500`}
            title="Attach file"
          >
            <Paperclip size={20} strokeWidth={2} />
          </button>
          {/* Image Upload Button */}
          <button
            type="button"
            className={`hidden sm:block p-2 rounded-full transition-all duration-200 hover:bg-slate-100 ${
              isDark && "hover:bg-white/10"
            } hover:text-cyan-500`}
            title="Upload image"
          >
            <ImageIcon size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Input Wrapper */}
        <div
          className={`
            flex-1 relative flex items-center`}
        >
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            rows={1}
            className={`w-full py-3 pl-4 pr-12 bg-transparent border-none outline-none resize-none
              text-sm leading-relaxed scrollbar-hide
              font-mono `}
          />

          {/* Emoji Button */}
          <button
            type="button"
            className={`
              absolute right-3 p-1.5 rounded-full transition-colors duration-200
              ${
                isDark
                  ? "text-slate-500 hover:text-cyan-400 hover:bg-white/5"
                  : "text-slate-400 hover:text-cyan-600 hover:bg-slate-200"
              }
            `}
          >
            <Smile size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Send Button */}
        <div className="mb-0.5 pl-1">
          <button
            type="submit"
            disabled={!content.trim()}
            className={`
              flex items-center justify-center w-11 h-11 transition-all duration-300 text-neutral-400 hover:text-cyan-400
              rounded-full ${
                isDark ? "hover:bg-slate-900" : "hover:bg-stone-200"
              }
            `}
          >
            {content.trim() ? (
              isSendingMessage ? (
                <span
                  className={`border-3 border-t-transparent h-7 w-7 rounded-full animate-spin border-neutral-300`}
                />
              ) : (
                <Send
                  size={18}
                  strokeWidth={2.5}
                  className="-ml-0.5 group-hover:translate-x-0.5 transition-transform"
                />
              )
            ) : (
              <Mic size={20} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
