import axios from "axios";
import { createHash } from "crypto";
import { MotivationalVideo } from "../../models/MotivationalVideo";
import { connectDB, disconnectDB } from "../../config/db";



export const fetchAndStoreMotivationalVideos = async (searchTerm: string) => {
    try{
        await connectDB();
        const res = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
            part: "snippet",
            q: searchTerm,
            type: "video", // Keep this to get only videos
            maxResults: 10,
            key: process.env.YOUTUBE_API_KEY
        }
        });
        const videos = res.data.items;
        for(const item of videos){
            const contentHash = createHash("sha256").update(item.id.videoId).digest("hex");
            const ifExists = await MotivationalVideo.findOne({ contentHash });
            if(ifExists){
                if(!(ifExists.searchTerms?.includes(searchTerm))) {
                    ifExists.searchTerms = [...(ifExists.searchTerms || []), searchTerm];
                    await ifExists.save();
                    console.log(`Updated search terms for video: ${item.snippet.title}`);
                }
                continue;
            }

            const doc = new MotivationalVideo({
                type: "video",
                title: item.snippet.title,
                description: item.snippet.description,
                channelTitle: item.snippet.channelTitle,
                publishedAt: new Date(item.snippet.publishedAt),
                link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                videoId: item.id.videoId,
                searchTerms: [searchTerm],
                source: "YouTube",
                fetchedAt: new Date(),
                contentHash: contentHash,
            });

            await doc.save();

            console.log(`Saved video: ${doc}`);
        }
    }catch(err){
        console.error("Error in fetching motivational videos", err);
    }
    await disconnectDB();
}
