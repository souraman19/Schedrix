import { de } from "@faker-js/faker/.";
import {Schema, model, Document} from "mongoose";

export interface IMotivationalVideo extends Document {
    videoId: string;
    title: string;
    description?: string;
    publishedAt: Date;
    thumbnail: string;
    channelTitle: string;
    tags: string[];
    source: string; // "YouTube"
    fetchedAt: Date;
    contentHash: string; // Unique hash for the content
    searchTerms: string[]; // search terms we get this as result of the search query
}

const motivationalVideoSchema = new Schema<IMotivationalVideo>({
    videoId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    publishedAt: {
        type: Date,
    },
    thumbnail: {
        type: String,
    },
    channelTitle: {
        type: String,
    },
    tags: {
        type: [String],
        default: []
    },
    source: {
        type: String,,
        default: "YouTube"
    },
    fetchedAt: {
        type: Date,
        default: Date.now
    },
    contentHash: {
        type: String,
        required: true,
        unique: true
    },
    searchTerms:{
        type: [String],
        default: []
    }
})


export const MotivationalVideo = model<IMotivationalVideo>("MotivationalVideo", motivationalVideoSchema);