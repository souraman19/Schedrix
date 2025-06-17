import { admin } from "./../firebase/admin";
import { getUserFcmToken } from "./getUserFcmToken"; 

type NotificationPayload = {
  title: string;
  body: string;
  data?: Record<string, any>;
};

export async function sendNotificationToUser(userId: string, payload: NotificationPayload) {
  const fcmToken = await getUserFcmToken(userId); 

  if (!fcmToken) {
    console.warn(`No FCM token found for user ${userId}`);
    return;
  }

  const message = {
    token: fcmToken,
    notification: {
      title: payload.title,
      body: payload.body,
    },
    data: payload.data || {},
  };

  try {
    const response = await admin.messaging().send(message);
    console.log(`📲 Notification sent to ${userId} | Message ID: ${response} => ${message}`);
  } catch (error) {
    console.error("Failed to send notification:", error);
  }
}
