import { useEffect, useState } from "react";
import useAuthStore from "./stores/useAuthStore";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Landing from "./pages/Landing";
import Home from "./pages/Home";

import { ProtectedRoute } from "./Routes/Route";
import { PublicRoute } from "./Routes/Route";
import { ThemeProvider } from "./providers/ThemeProvider";
import HomeLayout from "./Layout/HomeLayout";
import LoginPage from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import ChatLayout from "./Layout/ChatLayout";

import Status from "./pages/Status";
import Group from "./pages/Group";
import Setting from "./pages/Setting";
import Profile from "./pages/Profile";

const App = () => {
  // const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loaduser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loaduser();
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<ChatLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/status" element={<Status />} />
              <Route path="/group" element={<Group />} />
              <Route path="/setting" element={<Setting />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route element={<HomeLayout />}>
            <Route path="/home" element={<Landing />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
