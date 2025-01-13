import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { registerSW } from "virtual:pwa-register";
import { BrowserRouter } from "react-router-dom";

const updateSW = registerSW({
  onNeedRefresh() {
    console.log("A new service worker is available.");
    if (confirm("New version available. Reload the page to update?")) {
      updateSW();
    }
  },
  onOfflineReady() {
    console.log("App is ready to work offline.");
  },
});

if ("serviceWorker" in navigator && !navigator.serviceWorker.controller) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

const requestNotificationPermission = async () => {
  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
    } else {
      console.error("Notification permission denied.");
    }
  } else {
    console.log("Notification permission already set to:", Notification.permission);
  }
};

// Only request permission once
requestNotificationPermission();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
