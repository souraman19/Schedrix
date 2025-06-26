import { motivationalVideoQueue } from "./motivationalVideoQueue";
import { mindStatusToYouTubeKeywords } from "../../utils/mindStatusToYouTubeKeywordsMap";
import connection from "../redis/redisClient";

export const scheduleMotivationalVideoJob = async (mindStatus: string) => {
    const countSearchTerms = mindStatusToYouTubeKeywords[mindStatus].length;
    const currentIndex = Math.floor(Math.random() * countSearchTerms);
    const searchTerm = mindStatusToYouTubeKeywords[mindStatus][currentIndex];
    await motivationalVideoQueue.add(
        'fetch-motivational-videos',
        {
            searchTerm
        },
        {
            repeat: {
                every: 3 * 24 * 60 * 60 * 1000, // Repeat every 3 days
            },
            attempts: 3,
            jobId: `repeat: fetch-motivational-videos:${mindStatus}`,
        }
    );
    console.log(`Scheduled motivational video fetch job for mind status "${mindStatus}" with search term "${searchTerm}" to run every 3 days.`);
}

for (const mindStatus of Object.keys(mindStatusToYouTubeKeywords)){
    scheduleMotivationalVideoJob(mindStatus);
}

const run = async() => {
    for (const mindStatus of Object.keys(mindStatusToYouTubeKeywords)){
        await scheduleMotivationalVideoJob(mindStatus);
    }

    await connection.quit();
    process.exit(0);
}

run().catch((err) => {
    console.error("Error scheduling motivational video job:", err);
    process.exit(1);
});


// You are not scheduling a cron-like loop in your script.
//Instead, you're registering a repeating job inside Redis via BullMQ. Redis stores the job metadata, and BullMQ's Worker (which you must keep running) is responsible for executing the job at the configured intervals.