import mongoose from "mongoose";
import { Document, Schema, model, Types } from "mongoose";

export interface IMotivationContentViewLog extends Document {
    userId: Types.ObjectId;  // User who viewed the content
    contentId: Types.ObjectId;  // Motivation content viewed
    viewedAt: Date; 
    liked: boolean; // Whether the user liked the content
    skipped: boolean;  //if progress is lets say xth part of content
    viewProgress: number; // Progress of content view (0 to 1)
}

const motivationContentViewLogSchema = new Schema<IMotivationContentViewLog>({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MotivationContent",
    required: true,
  },
  viewedAt: {
    type: Date,
    default: Date.now,
  },
  liked: {
    type: Boolean,
    default: false,
  },
  skipped: {
    type: Boolean,
    default: false,
  },
  viewProgress: {
    type: Number,
    min: 0,
    max: 1,
    default: 0,
 },
});

export const MotivationContent = model<IMotivationContentViewLog>(
  "MotivationContentViewLog",
  motivationContentViewLogSchema
);
