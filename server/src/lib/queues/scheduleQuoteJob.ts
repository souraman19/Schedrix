import { quoteQueue } from "./quoteQueue"; 
import "./quoteFetchWorker";

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

scheduleQuoteJob();