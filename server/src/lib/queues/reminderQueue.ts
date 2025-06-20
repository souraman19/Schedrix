import { Queue } from "bullmq";
import IORedis from "ioredis";
import "./../../env";
import connection from "../redis/redisClient";

export const reminderQueue = new Queue("task-reminders", { //we'll add jobs to this queue when tasks are created or edited.
  connection,
});


