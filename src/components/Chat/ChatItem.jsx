import { CheckCheck } from "lucide-react";
import { useTheme } from "../../theme/Theme";
import { useThemeStore } from "../../stores/useThemeStore";
import { Image } from "../../assets/image";
import useChatStore from "../../stores/useChatStore";

export const ChatItem = ({ chat, user, onClick }) => {
  const theme = useTheme();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const { selectedChat } = useChatStore();
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
            {new Date(chat.latestMessage?.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Latest Message */}
        <div className={`flex items-center gap-2 text-sm text-cyan-600`}>
          <CheckCheck size={16} />
          <p className={`truncate ${theme.textMuted}`}>
            {chat.latestMessage?.content || "No messages yet"}
          </p>
        </div>
      </div>
    </div>
  );
};
