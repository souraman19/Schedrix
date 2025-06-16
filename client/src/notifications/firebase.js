import { getMessaging, getToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";

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
    await getToken(messaging, { vapidKey: "BL1xevKEBnn9eGYasaCXaLMc1-LOOv6Zq-y26drzIl-Uu4HJ7i3W4aewfOcdhFSxUGtMoJkCh3jZdIIgtNdppAU" })
      .then((currentToken) => {
        if (currentToken) {
            console.log("Current token for client: ", currentToken);
          // Send the token to your server and update the UI if necessary
          // ...
        } else {
          // Show permission request UI
          console.log(
            "No registration token available. Request permission to generate one."
          );
          // ...
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
        // ...
      });
  }
};
