import admin from "firebase-admin";
// import serviceAccount from "./firebaseServiceAccountKey.json";

const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

if (!base64) {
  throw new Error("Missing Firebase service account in env");
}

const serviceAccount = JSON.parse(
  Buffer.from(base64, "base64").toString("utf8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
} // Initialize Firebase Admin SDK only if it hasn't been initialized yet

export { admin };
