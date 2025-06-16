import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { deviceSession } from "../services/employers/employer-userApi";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "jobs-employment-utem.firebaseapp.com",
  projectId: "jobs-employment-utem",
  storageBucket: "jobs-employment-utem.firebasestorage.app",
  messagingSenderId: "259878842680",
  appId: "1:259878842680:web:e27bac3c28c6d2febed1cd",
  measurementId: "G-R9JSKL2457",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const messaging = getMessaging();

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BJh2TVr-bdRO4lv9Tc8iYKXfbcE-SmZZPPR3-BMKO8g_UTgyS_R_xFpzG9WV9yBWWQVvpKes30030KQnafuaKO4",
    });

    if (currentToken) {
      console.log("✅ current token for client: ", currentToken);

      // Gửi token lên server
      await deviceSession({ notification_token: currentToken });
    } else {
      console.log("⚠️ No registration token available. Request permission to generate one.");
    }
  } catch (err) {
    console.error("❌ An error occurred while retrieving token or sending to server:", err);
  }
};


export const onMessageListener = (callback) => {
  try {
    return onMessage(messaging, (payload) => {
      console.log("🚀 ~ onMessage ~ payload:", payload);
      callback(payload);
    });
  } catch (error) {
    console.log("🚀 ~ onMessageListener ~ error:", error);
  }
};
