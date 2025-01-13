import webpush from "web-push";

// VAPID Keys
const publicVapidKey = "BNIQQof4Obr77bLgOS9n3mcwP7sIO-WKwMV4bn6KL1fnSqL8_Cwr1VncbEUjH4ePsd0u53Hc3zgu3Se7crdfBM0"; // REPLACE_WITH_YOUR_KEY
const privateVapidKey = "1jPpZ00ENs0d_JUto3wtRmtkYU_PCA2OO-3pKjRbEuE"; // REPLACE_WITH_YOUR_KEY

// Configure webpush
webpush.setVapidDetails(
  "mailto:mdabrarsami@gmail.com",
  publicVapidKey,
  privateVapidKey
);

// Create a singleton object
const WebPushSingleton = {
  sendNotification(subscription, payload) {
    return webpush.sendNotification(subscription, payload);
  },
};

// Export the singleton object
export default WebPushSingleton;