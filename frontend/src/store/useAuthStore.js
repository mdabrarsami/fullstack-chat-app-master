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
  publicVapidKey:"BNIQQof4Obr77bLgOS9n3mcwP7sIO-WKwMV4bn6KL1fnSqL8_Cwr1VncbEUjH4ePsd0u53Hc3zgu3Se7crdfBM0",

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
  subscribeToAllEvents: async () => {
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
            const newMsg = args[0];
            if (newMsg.receiverId === authUser._id) {
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then((registration) => {
                  registration.showNotification('NewsM', {
                    body: newMsg?.text,
                    icon: '/icon-192x192.png',
                    badge: '/icon-192x192.png',
                    vibrate: [200, 100, 200],
                    tag: 'message',
                    data: {
                      url: '/'
                    },
                    actions: [
                      {
                        action: 'view',
                        title: 'View Message'
                      },
                      {
                        action: 'close',
                        title: 'Close'
                      }
                    ]
                  });
                });
              }
            }
            break;
  
        default:
          console.log(`Unhandled event: ${eventName}`, args);
      }
    });


    if(authUser?.subscription=={} || authUser?.subscription==null || authUser?.subscription==undefined){
      await get().subscribeForPushNotifications();
    }

  },  
  subscribeForPushNotifications:async ()=> {
    if (!("serviceWorker" in navigator)) {
      console.error("Service workers are not supported in this browser");
      return;
    }
  
    try {
      // Register the service worker
      const registration = await navigator.serviceWorker.ready;
  
      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true, // Ensures notifications are user-visible
        applicationServerKey: get().urlBase64ToUint8Array(get().publicVapidKey),
      });
  
      console.log("Push Subscription Object:", JSON.stringify(subscription));
  
      // Send subscription to your server
      await get().sendSubscriptionToServer(subscription);
    } catch (error) {
      console.error("Failed to subscribe for push notifications:", error);
    }
  },
  unsubscribeFromAllEvents: () => {
    const { socket } = get();
    if (!socket) return;
    socket.offAny();
  },
  urlBase64ToUint8Array:(base64String)=> {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  },
   sendSubscriptionToServer:async (subscription)=> {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-subscription", {
        subscription,
        userId:get().authUser._id
      });
      set({ authUser: res.data });
      toast.success("Subscription updated successfully");
    } catch (error) {
      console.log("Subscription in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  }
}));
