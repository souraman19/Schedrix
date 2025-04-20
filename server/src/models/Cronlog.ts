import mongoose , {Document, Schema, model, Types} from 'mongoose';

export interface ICronlog extends Document {
    title: string;
    lastRun: Date;
}


const cronlogSchema = new Schema<ICronlog>({
    title: {type: String, required: true},
    lastRun: {type: Date, default: Date.now},
})

export const Cronlog = model<ICronlog>('Cronlog', cronlogSchema);