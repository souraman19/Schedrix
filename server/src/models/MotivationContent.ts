import mongoose from "mongoose";
import { Document, Schema, model, Types } from "mongoose";

export interface IMotivationContent extends Document {
  type: string;  //Content type: quote/video/etc
  title: string;  //Actual quote or message
  channelTitle: string;
  description?: string;  //Additional context or explanation
  link?: string;  //YouTube or external content link
  searchTerms?: string[]; //Search terms used to find this content
  source: string;
  fetchedAt: Date;
  publishedAt?: Date;  //When the content was published
  contentHash: string; //Prevents duplicate entries
}

const motivationContentSchema = new Schema<IMotivationContent>({
  type: {
    type: String,
    required: true,
    enum: ["quote", "video", "affirmation"],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  channelTitle:{
    type: String,
  },
  link: {
    type: String,
    default: null,
  },
  searchTerms: {
    type: [String],
    default: [],
  },
  source: {
    type: String,
    required: true
  },
  fetchedAt:{
    type: Date,
    default: Date.now
  },
  publishedAt: {
    type: Date,
  },
  contentHash:{
    type: String,
    required: true,
    unique: true
  },
});

export const MotivationContent = model<IMotivationContent>(
  "MotivationContent",
  motivationContentSchema
);
