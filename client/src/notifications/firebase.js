import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { SAVE_FCM_TOKEN_ROUTE } from "./../lib/apiRoutes";

const firebaseConfig = {
  apiKey: "AIzaSyCstAMLEuhB-psAcGGShvqPUmDcXZkMDL0",
  authDomain: "schedrix-d4511.firebaseapp.com",
  projectId: "schedrix-d4511",
  storageBucket: "schedrix-d4511.firebasestorage.app",
  messagingSenderId: "180104573575",
  appId: "1:180104573575:web:0d7f3aaba78e788b7b3e22",
  measurementId: "G-RNKK242LT7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log("Notification permission:", permission);
  if (permission === "granted") {
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BL1xevKEBnn9eGYasaCXaLMc1-LOOv6Zq-y26drzIl-Uu4HJ7i3W4aewfOcdhFSxUGtMoJkCh3jZdIIgtNdppAU",
    });

    // console.log("Current token:", currentToken);
    if (!currentToken) return;
    const savedToken = localStorage.getItem("fcmToken");
    if (savedToken && savedToken === currentToken) {
    //   console.log("Same token already saved in localStorage and database");
      return; // Token already saved, no need to save again
    }

    await fetch(SAVE_FCM_TOKEN_ROUTE, {
      // Save the token to the database
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: currentToken }),
      credentials: "include",
    });
    localStorage.setItem("fcmToken", currentToken); // Save the token to localStorage
    console.log("Token saved successfully.");
  } else {
    console.log(
      "No registration token available. Request permission to generate one."
    );
  }
};
