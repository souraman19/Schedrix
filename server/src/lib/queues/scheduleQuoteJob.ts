import { quoteQueue } from "./quoteQueue"; 
import connection from "../redis/redisClient";

export const scheduleQuoteJob = async () => {
    await quoteQueue.add(
        'fetch-zen-quotes',
        {},
        {
            repeat:{
                every: 3 * 24 * 60 * 60 * 1000, // every 3 days
            },
            attempts: 3,
            jobId: "repeat: fetch-zen-quotes",
        }
    );  
    console.log("Scheduled quote fetch job to run every 3 days.");
}

const run = async() => {
    await scheduleQuoteJob();

    await connection.quit();
    process.exit(0);
}

run().catch((err) => {
    console.error("Error scheduling zen quotes job:", err);
    process.exit(1);
});
