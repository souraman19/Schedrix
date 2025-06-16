import { Queue } from "bullmq";
import IORedis from "ioredis";
import "./../../env";


const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});

export const reminderQueue = new Queue("task-reminders", { //we'll add jobs to this queue when tasks are created or edited.
  connection,
});


