import { Queue } from "bullmq";
import IORedis from "ioredis";
import "./../../env";


const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});

export const quoteQueue = new Queue("quote-fetch", {connection});

