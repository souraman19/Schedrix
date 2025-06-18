import axios from "axios";
import { createHash } from "crypto";
import { MotivationContent } from "./../../models/MotivationContent";
import { connectDB, disconnectDB } from "./../../config/db";
import {tagToKeywordMap} from "../../utils/tagToKeywordMap";
import nlp from "compromise";
import { getTags } from "./../../utils/getTags";

//Tag generate
const getTagsUpperLevelFunction = async(text: any)=>{
    try{
        await getTags(text, 3);
    }catch(err){
        console.error(err);
    }
}



//content Hash Generator
const  generateHash = (text: string): string => {
    return createHash("sha256").update(text).digest("hex"); 
}


//Fetch, normalize & save to db
export const fetchAndStoreZenQuotes = async () => {
    try{
        await connectDB();
        const res = await axios.get("https://zenquotes.io/api/quotes");
        const quotes = res.data;

        for(const item of quotes){
            const content = item.q;
            const author = item.a;
            const contentHash = generateHash(`${content}-${author}`);

            const ifExists = await MotivationContent.findOne({contentHash});
            if(ifExists) continue;

            const newDoc = new MotivationContent({
                type: "quote",
                content,
                author,
                link: null,
                tags: await getTagsUpperLevelFunction(content),
                source: "ZenQuotes",
                fetchedAt: new Date(),
                contentHash
            });
            await newDoc.save();
        }
        console.log("ZenQuotes fetched and saved in db");
    }catch(err){
        console.error("Error in fetching Zenquotes", err);
    }
    await disconnectDB();
} 

fetchAndStoreZenQuotes();


