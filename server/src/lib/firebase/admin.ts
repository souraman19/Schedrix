// lib/firebase/admin.ts
import admin from "firebase-admin";
import serviceAccount from "../../../firebaseServiceAccountKey.json"; // Adjust path

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export { admin };
