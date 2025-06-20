import { Queue } from "bullmq";
import IORedis from "ioredis";
import "./../../env";
import connection from "../redis/redisClient";


export const motivationalVideoQueue = new Queue("fetch-motivational-videos", {
  connection,
});