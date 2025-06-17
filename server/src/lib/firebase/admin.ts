import admin from "firebase-admin";
import serviceAccount from "./firebaseServiceAccountKey.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
} // Initialize Firebase Admin SDK only if it hasn't been initialized yet

export { admin };
