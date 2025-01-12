import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate  } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import NewsPage from "./pages/NewsPage";
import { useMemo } from "react";


const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers,subscribeToAllEvents,unsubscribeFromAllEvents } = useAuthStore();
  
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    let deferredPrompt;

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      deferredPrompt = e;
      console.log('Ready to install PWA');
    };

    const handleAppInstalled = () => {
      deferredPrompt = null;
      console.log('PWA installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  console.log({ authUser });


  if (isCheckingAuth && !authUser){

    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }



  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route path="/" element={ authUser ? <NewsPage /> :  <Navigate to="/login" />}/>
        <Route path="/secrethome" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;
