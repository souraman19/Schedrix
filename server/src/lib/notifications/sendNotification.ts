// lib/notifications/sendNotification.ts
export async function sendNotificationToUser(userId: string, payload: {
  title: string;
  body: string;
  data?: Record<string, any>;
}) {
  // TODO: Use Firebase Admin to send to FCM token stored for the user
  console.log(`Notify user ${userId}: ${payload.title} - ${payload.body}`);
}
