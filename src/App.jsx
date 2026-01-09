import { useEffect, useState } from "react";
import useAuthStore from "./stores/useAuthStore";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Landing from "./pages/Landing";

import { ProtectedRoute } from "./Routes/Route";
import { PublicRoute } from "./Routes/Route";
import { ThemeProvider } from "./providers/ThemeProvider";
import HomeLayout from "./Layout/HomeLayout";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import MainLayout from "./Layout/MainLayout";

import Status from "./pages/Status";
import Group from "./pages/Group";
import Setting from "./pages/Setting";
import Profile from "./pages/Profile";

import ChatLayout from "./components/Chat/ChatLayout";
import ChatScreen from "./components/Chat/ChatScreen";
import EmptyChatState from "./components/Chat/EmptyChatState";
import Loading from "./components/Loaders/Loading";
import AddnewUser from "./pages/AddnewUser";
import useChatStore from "./stores/useChatStore";

const App = () => {
  // const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loaduser = useAuthStore((state) => state.loadUser);
  const { userLoading } = useAuthStore();
  const { isLoadingChats } = useChatStore();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loaduser();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<ChatLayout />}>
                <Route index element={<EmptyChatState />} />
                <Route path="chat" element={<ChatScreen />} />
              </Route>

              <Route path="/status" element={<Status />} />
              <Route path="/group" element={<Group />} />
              <Route path="/setting" element={<Setting />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/create" element={<AddnewUser />} />
            </Route>
          </Route>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route element={<HomeLayout />}>
            <Route path="/home" element={<Landing />} />
          </Route>
          <Route path="/loading" element={<Loading />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
