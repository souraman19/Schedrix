import mongoose from "mongoose";
import { Document, Schema, model, Types } from "mongoose";

export interface IMotivationContent extends Document {
  type: string;  //Content type: quote/video/etc
  content: string;  //Actual quote or message
  author: string;
  link?: string;  //YouTube or external content link
  tags: [string];
  source: string;
  fetchedAt: Date;
  contentHash: string; //Prevents duplicate entries
}

const motivationContentSchema = new Schema<IMotivationContent>({
  type: {
    type: String,
    required: true,
    enum: ["quote", "video", "affirmation"],
  },
  content: {
    type: String,
    required: true,
  },
  author:{
    type: String,
  },
  link: {
    type: String,
    default: null,
  },
  tags: {
    type: [String],
    default: []
  },
  source: {
    type: String,
    required: true
  },
  fetchedAt:{
    type: Date,
    default: Date.now
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
