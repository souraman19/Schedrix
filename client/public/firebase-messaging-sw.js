// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyCstAMLEuhB-psAcGGShvqPUmDcXZkMDL0",
  authDomain: "schedrix-d4511.firebaseapp.com",
  projectId: "schedrix-d4511",
  storageBucket: "schedrix-d4511.firebasestorage.app",
  messagingSenderId: "180104573575",
  appId: "1:180104573575:web:0d7f3aaba78e788b7b3e22",
  measurementId: "G-RNKK242LT7",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();


messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "https://cdn-icons-png.flaticon.com/512/1827/1827370.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});