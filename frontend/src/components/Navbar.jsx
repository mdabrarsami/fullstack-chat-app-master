import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User, Newspaper,Rss } from "lucide-react";
import { useState,useMemo } from "react";

const Navbar = () => {
  const { logout, authUser,subscribeToAllEvents,unsubscribeFromAllEvents } = useAuthStore();

  const navigate = useNavigate();

  // State to track press-and-hold
  const [pressTimer, setPressTimer] = useState(null);
  const [isSecretNavigation, setIsSecretNavigation] = useState(false);

  const handleMouseDown = () => {
    // Start the timer when the link is pressed
    const timer = setTimeout(() => {
      localStorage.setItem("hasSecretAccess", "true"); // Persist access
      setIsSecretNavigation(true); // Mark that the user navigated to the secret page
      navigate("/secrethome"); // Navigate to the secret home after 4 seconds
    }, 3000);
    setPressTimer(timer);
  };

  const handleMouseUp = (event) => {
    // Clear the timer if the link is released before 4 seconds
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }

    // Prevent navigation to /settings if /secretehome navigation has already occurred
    if (isSecretNavigation) {
      event.preventDefault();
      setIsSecretNavigation(false); // Reset the flag for future interactions
    }else{
      navigate("/settings");
    }
  };

  useMemo(() => {
    subscribeToAllEvents();
    return () => {
      console.log("Unsubscribing from all events");
      unsubscribeFromAllEvents()
    }
  }, [authUser]);

  const handleRssOnClick = async () => {
    console.log("RSS clicked");

     if (!("Notification" in window)) {
      alert("This browser does not support notifications.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      alert("Notification permission granted!");
    } else if (permission === "denied") {
      alert("Notification permission denied.");
    } else {
      alert("Notification permission dismissed.");
    }
  }

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">NewsM</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
          <span
            >
              <div
                className={`
              btn btn-sm gap-2 transition-colors
              
              `}
                onClick={handleRssOnClick}
              >
                <Rss className="w-4 h-4" />
                <span className="hidden sm:inline">Subscribe</span>
              </div>
            </span>
            <span
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              //onMouseLeave={handleMouseUp}
            >
              <div
                className={`
              btn btn-sm gap-2 transition-colors
              
              `}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </div>
            </span>



            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
