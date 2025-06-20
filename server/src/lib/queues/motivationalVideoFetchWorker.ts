import {Worker} from "bullmq";
import IORedis from "ioredis";
import "./../../env";
import {fetchAndStoreMotivationalVideos} from "../content/fetchAndStoreMotivationalVideos";
import connection from "../redis/redisClient";

export const motivationalVideoFetchWorker = new Worker(
    'fetch-motivational-videos',
    async(job) => {
        await fetchAndStoreMotivationalVideos(job.data.searchTerm);
    },
    { connection }
)

motivationalVideoFetchWorker.on("completed", (job) => {
  console.log(`Motivational video fetching job ${job.id} completed`);
});

motivationalVideoFetchWorker.on("failed", (job, err) => {
  console.error(`Motivational video fetching job ${job?.id} failed:`, err);
});