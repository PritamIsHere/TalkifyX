import React from "react";
import { useTheme } from "../../theme/Theme";
import useAuthStore from "../../stores/useAuthStore";
import { Image } from "../../assets/image";

const MessageItem = ({ message, isMyMessage, showAvatar }) => {
  const theme = useTheme();

  return (
    <div
      className={`flex w-full ${
        isMyMessage ? "justify-end" : "justify-start"
      } mb-1`}
    >
      {!isMyMessage && (
        <div className="w-8 flex flex-col justify-end mr-2">
          {showAvatar ? (
            <img
              src={message.sender.avatar || Image.defaultUser}
              alt={message.sender.username}
              className="w-8 h-8 rounded-full object-cover shadow-sm"
              title={message.sender.username}
            />
          ) : (
            <div className="w-8" />
          )}
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`
          max-w-[75%] px-4 py-2 rounded-2xl text-sm font-medium leading-relaxed break-words shadow-sm relative
          ${
            isMyMessage
              ? "bg-gradient-to-tr from-cyan-600 to-blue-600 text-white rounded-tr-none"
              : `${theme.bubbleOther} ${theme.bubbleTextOther} rounded-tl-none`
          }
        `}
      >
        {message.content}

        <span
          className={`text-[10px] block font-semibold text-right mt-1 opacity-70 ${
            isMyMessage ? "text-cyan-100" : theme.textMuted
          }`}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};

export default MessageItem;
