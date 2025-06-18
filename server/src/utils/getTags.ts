import nlp from "compromise";
import { tagToKeywordMap } from "./tagToKeywordMap";
import "./../env";
import { candidateTags } from "./mindStatusToTagMap";

export const tagFromContentByKeyword = (text: string) : string[] => {
    const doc = nlp(text);
    const words = [
        ...doc.nouns().out('array'),
        ...doc.verbs().out('array'),
        ...doc.adjectives().out('array'),
        ...doc.adverbs().out('array')
    ].map(word => word.toLowerCase());

    const tagScore: Record<string, number> = {};
    for(const[tag, keywords] of Object.entries(tagToKeywordMap)){
        for(const keyword of keywords){
            const parts = keyword.toLowerCase().split(" ");
            for(const word of words){
                if(parts.includes(word)){
                    tagScore[tag] = (tagScore[tag] || 0) + 1;
                }
            }
        }
    }
    return Object.entries(tagScore) // Convert to array of [tag, score]
        .sort((a, b) => b[1] - a[1]) // Sort by score in descending order
        .slice(0, 3) // Get top 3 tags
        .map(([tag]) => tag); // Extract only the tag names
}


export const getTags =  async (content : any, requiredTagCount: number) => {
    const response = await fetch(
		"https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli",
        {
            headers: {
				Authorization: `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": "application/json",
         },
            method: "POST",
            body: JSON.stringify({
                inputs: content,
                parameters:{
                    candidate_labels: candidateTags,
                    multi_label: true,
                }
            }),
        }
    );
    const result = await response.json();
    let topTags = result.labels.slice(0, Math.min(result.labels.length, requiredTagCount));
    topTags = tagFromContentByKeyword(content); //Fallback to traditional approach
    if(topTags.length === 0)  //if still gets empty
        topTags = ['unknown']
    console.log(topTags);
    return result;
}
