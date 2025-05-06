import mongoose, { Document, Schema, model, Types } from 'mongoose';


export interface IUserPoints extends Document {
    userId: Schema.Types.ObjectId,
    year: number,
    points: [
        {
            day: number,
            month: number,
            pointsGain: number,
            pointsDeduct: number,
        }
    ]
}


const userPointSchema = new Schema<IUserPoints>({
    userId: {type: Schema.Types.ObjectId, required: true},
    year: {type: Number, required: true},
    points: [
        {
            day: {type: Number, required: true},
            month: {type: Number, required: true},
            pointsGain: {type: Number, default: 0},
            pointsDeduct: {type: Number, default: 0},
        }
    ]
})

export const UserPoints = model<IUserPoints>('UserPoints', userPointSchema);