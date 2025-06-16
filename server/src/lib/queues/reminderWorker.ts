// lib/queues/reminderWorker.ts
import { Worker } from "bullmq";
import IORedis from "ioredis";
import "./../../env";
import { sendNotificationToUser } from "./../notifications/sendNotification"; // You’ll create this

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

// 👇 Create the worker that listens to "task-reminders" queue
const reminderWorker = new Worker(
  "task-reminders",
  async (job) => {
    const { taskId, userId, taskTitle } = job.data;

    console.log("🔔 Sending reminder for task:", taskTitle);

    // Your custom notification logic (push, email, toast trigger, etc.)
    await sendNotificationToUser(userId, {
      title: "⏰ Task Reminder",
      body: `Reminder for: ${taskTitle}`,
      data: { taskId },
    });
  },
  { connection }
);

reminderWorker.on("completed", (job) => {
  console.log(`✅ Reminder job ${job.id} completed`);
});

reminderWorker.on("failed", (job, err) => {
  console.error(`❌ Reminder job ${job?.id} failed:`, err);
});
