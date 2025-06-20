import { motivationalVideoQueue } from "./motivationalVideoQueue";
import './motivationalVideoFetchWorker';
import { mindStatusToYouTubeKeywords } from "../../utils/mindStatusToYouTubeKeywordsMap";

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
                every: 3 * 24 * 60 * 60 * 1000, // every 3 days
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
