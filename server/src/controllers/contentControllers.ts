import { getSuggestedTagsForMindset } from "./../utils/mindStatusToTagMap";
import { MotivationContent } from "./../models/MotivationContent";

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