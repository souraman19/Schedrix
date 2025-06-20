import { Worker } from "bullmq";
import IORedis from "ioredis";
import "./../../env";
import { fetchAndStoreZenQuotes } from "../content/fetchAndStoreZenQuotes";
import connection from "../redis/redisClient";

export const quoteFetchWorker = new Worker(
    'fetch-zen-quotes',
    async (job) => {
        await fetchAndStoreZenQuotes();
    } ,
    { connection }
) 

quoteFetchWorker.on("completed", (job) => {
  console.log(` Quote fetching job ${job.id} completed`);
});

quoteFetchWorker.on("failed", (job, err) => {
  console.error(`Quote fetching job ${job?.id} failed:`, err);
});
