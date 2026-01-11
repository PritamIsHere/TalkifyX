import { CheckCheck } from "lucide-react";
import { useTheme } from "../../theme/Theme";
import { useThemeStore } from "../../stores/useThemeStore";
import { Image } from "../../assets/image";
import useChatStore from "../../stores/useChatStore";
import { formatChatDate } from "../../util/dateUtils";

export const ChatItem = ({ chat, user, onClick }) => {
  const theme = useTheme();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { selectedChat, notifications } = useChatStore();

  const unreadCount = notifications.filter(
    (n) => n.chat._id === chat._id
  ).length;

  const isSelected = selectedChat?._id === chat._id;
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-4 cursor-pointer border transition m-1.5 rounded-md ${
        isDarkMode
          ? `${isSelected ? "bg-white/7" : ""} border-white/5 hover:bg-white/7`
          : `${
              isSelected ? "bg-neutral-200" : "bg-white"
            } border-slate-200 shadow-sm hover:shadow-md`
      }
      `}
    >
      {/* Avatar */}
      <img
        src={user.avatar || Image.defaultUser}
        alt={user.username}
        className="w-12 h-12 rounded-full object-cover"
      />

      {/* Chat Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold truncate">{user.username}</h3>
          <span className={`text-xs ${theme.textMuted}`}>
            {unreadCount === 0 && formatChatDate(chat.latestMessage?.createdAt)}
          </span>
        </div>

        {/* Latest Message */}
        <div className={`flex items-center gap-2 text-sm text-cyan-600`}>
          {chat.latestMessage && <CheckCheck size={16} />}
          <p
            className={`truncate ${theme.textMuted}`}
            title={chat.latestMessage?.content}
          >
            {chat.latestMessage
              ? chat.latestMessage.content
              : "Start a conversation"}
          </p>
        </div>
      </div>
      {/* --- Notification Badge --- */}
      {unreadCount > 0 && (
        <div className="bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm animate-bounce">
          {unreadCount > 9 ? "9+" : unreadCount}
        </div>
      )}
    </div>
  );
};
