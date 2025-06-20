import {Worker} from "bullmq";
import IORedis from "ioredis";
import "./../../env";
import {fetchAndStoreMotivationalVideos} from "../content/fetchAndStoreMotivationalVideos";


const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
});

export const motivationalVideoFetchWorker = new Worker(
    'motivational-video-fetch',
    async(job) => {
        await fetchAndStoreMotivationalVideos(job.data.searchTerm)
    },
    { connection }
)

motivationalVideoFetchWorker.on("completed", (job) => {
  console.log(`Motivational video fetching job ${job.id} completed`);
});

motivationalVideoFetchWorker.on("failed", (job, err) => {
  console.error(`Motivational video fetching job ${job?.id} failed:`, err);
});