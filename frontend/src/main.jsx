import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { registerSW } from 'virtual:pwa-register';

import { BrowserRouter } from "react-router-dom";



const updateSW = registerSW({
  onNeedRefresh() {
    console.log('A new service worker is available.');
  },
  onOfflineReady() {
    console.log('App is ready to work offline.');
  },
});

const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Notification permission granted.');
  } else {
    console.error('Notification permission denied.');
  }
};

requestNotificationPermission();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
