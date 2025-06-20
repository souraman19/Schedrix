import { Queue } from "bullmq";
import IORedis from "ioredis";
import "./../../env";

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});


export const motivationalVideoQueue = new Queue("motivational-video-fetch", {
  connection,
});