// lib/queues/reminderWorker.ts
import { Worker } from "bullmq";
import IORedis from "ioredis";
import connection from "../redis/redisClient"; // Import your Redis connection
import "./../../env";
import { sendNotificationToUser } from "./../notifications/sendNotification"; // You’ll create this


// Create the worker that listens to "task-reminders" queue
const reminderWorker = new Worker(
  "task-reminders",
  async (job) => {
    const { taskId, userId, taskTitle, taskDelayFromRemindTime } = job.data;

    console.log("Sending reminder for task:", taskTitle);

    await sendNotificationToUser(userId, {
      title: "Task Reminder",
      body: `You have ${taskTitle} task in ${taskDelayFromRemindTime} minutes`,
      data: { taskId },
    });
  },
  { connection }
);

reminderWorker.on("completed", (job) => {
  console.log(` Reminder job ${job.id} completed`);
});

reminderWorker.on("failed", (job, err) => {
  console.error(`Reminder job ${job?.id} failed:`, err);
});
