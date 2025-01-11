import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

   
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
  subscribeToAllEvents: () => {
    const { socket, authUser } = get();
    if (!socket) return;
  
    console.log('Subscribing to all events', authUser);
  
    // Remove any previous listeners to avoid duplicate handling
    socket.offAny();
  
    // Listen to every event
    socket.onAny((eventName, ...args) => {
      console.log(`Received event: ${eventName}`, args);
  
      // Handle events dynamically based on their name
      switch (eventName) {
        case 'getOnlineUsers':
          set({ onlineUsers: args[0] });
          break;
  
        case 'update':
          console.log('Update event:', args[0]);
          break;
  
        case 'newMessage':
          console.log('New message:', args[0]);
          const newMsg = args[0];
          if (newMsg.receiverId === authUser._id) {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                new Notification('NewsM', {
                  body: newMsg?.text,
                  icon: '/icon-192x192.png',
                });
              }
            });
          }
          break;
  
        default:
          console.log(`Unhandled event: ${eventName}`, args);
      }
    });
  },  
  unsubscribeFromAllEvents: () => {
    const { socket } = get();
    if (!socket) return;
    socket.offAny();
  },
}));
