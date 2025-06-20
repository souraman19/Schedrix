import { Queue } from "bullmq";
import IORedis from "ioredis";
import "./../../env";
import connection from "../redis/redisClient";

export const quoteQueue = new Queue("fetch-zen-quotes", {connection});

