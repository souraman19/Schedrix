import { Worker } from "bullmq";
import IORedis from "ioredis";
import "./../../env";
import { fetchAndStoreZenQuotes } from "../content/fetchAndStoreZenQuotes";

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

export const quoteFetchWorker = new Worker(
    'quote-fetch',
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
