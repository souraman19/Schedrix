import { Worker } from "bullmq";
import IORedis from "ioredis";
import "./../../env";
import { fetchAndStoreZenQuotes } from "../content/fetchZenQuotes";

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

export const quoteFetchWorker = new Worker(
    'quote-fetch',
    async (job) => {
        console.log("Starting quote fetch job...");
        await fetchAndStoreZenQuotes();
        console.log("Quote fetch job completed.");
    } ,
    { connection }
) 

quoteFetchWorker.on("completed", (job) => {
  console.log(` Quote fetching job ${job.id} completed`);
});

quoteFetchWorker.on("failed", (job, err) => {
  console.error(`Quote fetching job ${job?.id} failed:`, err);
});
