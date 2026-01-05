import Sidebar from "../components/Chat/Sidebar";
import { useTheme } from "../theme/Theme";
import { Outlet } from "react-router-dom";

const ChatLayout = () => {
  const theme = useTheme();

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden ${theme.bg} ${theme.text} transition-colors duration-300`}
    >
      <Sidebar />
      <main className="flex-1 h-full relative flex">
        <div className="flex-1 flex items-center justify-center h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ChatLayout;
