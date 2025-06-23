import { getSuggestedTagsForMindset } from "./../utils/mindStatusToTagMap";
import { MotivationContent } from "./../models/MotivationContent";
import { getSuggestedYoutubeKeywords } from "./../utils/mindStatusToYouTubeKeywordsMap";
import { MotivationalVideo } from "./../models/MotivationalVideo";
import { generateImageFromQuote } from "./../utils/huggingface/huggingface";
import { elaborateQuoteWithGemini } from "./../utils/gemini/elaborateQuote";

export const getQuotes = async (req : any, res: any) => {
    try{
       const mindStatus = req.query.mindStatus;
       const cursor = req.query.cursor;
       const limit = 10;

       const tagList = getSuggestedTagsForMindset(mindStatus);

       const query: any = {
              type: "quote",
              tags: { $in: tagList }
       }

       if(cursor){
            query.fetchedAt = { $lt: new Date(cursor as string)}; //fetch older quotes than mentioned cursor
       }

       const quotes = await MotivationContent.find(query)
              .sort({fetchedAt: -1}) //sort by fetchedAt in descending order
              .limit(limit)

       res.status(200).json({message: "Quotes fetched successfully", quotes: quotes})

    }catch (error) {
        console.error("Error fetching quotes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


const simpleHashForQOTD = (dayString: string):number => {
    let hash = 0;
    for (let i = 0; i < dayString.length; i++){
        hash = (hash << 5) - hash + dayString.charCodeAt(i); // Shift hash left by 5 bits and subtract hash and add char code
        hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}




export const getQuoteOfTheDay = async (req: any, res: any) => {
    try{
        // console.log("Fetching quote of the day...", req.query);
        const mindStatus = req.query.mindStatus;
        const tagList = getSuggestedTagsForMindset(mindStatus);

        const query: any = {
            type: "quote",
            tags: { $in: tagList }
        }

        const countQuotes = await MotivationContent.countDocuments(query);

         if (countQuotes === 0) {
            return res.status(404).json({ message: "No quotes found for the given mind status" });
        }
        
        const today = new Date();
        const dayString = today.toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format
        const hash = simpleHashForQOTD(dayString);
        const index = hash % countQuotes;

        const quote = await MotivationContent.findOne(query).skip(index);

        if(!quote) {
            res.status(404).json({ message: "No quote found for the given mind status" });
        }
        // console.log("min", mindStatus);
        // console.log("Quote of the day fetched:", (quote as any).content);

        const imageURL  = await generateImageFromQuote((quote as any).content, mindStatus);
        // console.log("Image generated for quote:", imageURL);
        

        res.status(200).json({ message: "Quote of the day fetched successfully", quote: quote, quoteImageURL: imageURL });

    }catch(error) {
        console.error("Error fetching quote of the day:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const getMotivationalVideos = async(req: any, res: any) => {
    try{
        const mindStatus = req.query.mindStatus;
        const limit = 5;

        const searchKeyWordList = getSuggestedYoutubeKeywords(mindStatus);
        const query: any = {
            type: "video",
            searchTerms: { $in: searchKeyWordList }
        }
        const videos = await MotivationalVideo.find(query)
            .sort({ fetchedAt: -1 }) // sort by fetchedAt in descending order
            .limit(limit);
        
        res.status(200).json({ message: "Videos fetched successfully", videos: videos });
    }catch(error){
        console.error("Error fetching videos:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}