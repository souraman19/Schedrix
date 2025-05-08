    import mongoose from 'mongoose';
    import dotenv from 'dotenv';
import { UserPoints } from '../models/UserPoints';

    dotenv.config();

    export const connectDB = async() => {
        try{
            const conn = await mongoose.connect(process.env.MONGO_URI as string)
            console.log(`MongoDB connected: ${conn.connection.host}`);
        }catch(err){
            console.error(`MongoDB connection Error: ${err}`);
            process.exit(1);
        }
    }


    export const disconnectDB = async() => {
        try{
            await mongoose.disconnect();
            console.log("Mongodb disConnected");
        }catch(err){
            console.log("Error in MongoDB Dissconnection");
        }
    }

    export const getlast7daysPointsData = async(userId: string) => {
        try{
            //get the points data of last 7 days
            const today = new Date();
            today.setDate(today.getDate()); 
            const last7days: {day: number; month: number}[] = [];

            for(let i = 0; i < 7; i++){
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                last7days.push({day: date.getDate(), month: date.getMonth()});
            }

            const currentYear = new Date().getFullYear();
            const data = await UserPoints.findOne({userId: new mongoose.Types.ObjectId(userId), year: currentYear}).select('points').lean().exec();
            
            const rawPoints = data?.points || [];


           const recentPoints = last7days.map(({day, month}) => {
                const existing = rawPoints.find((point: any) => point.day === day && point.month === month);
                if(existing){
                    return existing;
                }

                return {
                    day,
                    month,
                    pointsGain: 0,
                    pointsDeduct: 0,
                    taskCompleted: 0,
                    taskMissed: 0,
                    mindStatus: "Default",
                    _id: new mongoose.Types.ObjectId(),
                }
           })


            return recentPoints;


        }catch(err){
            console.log("Error in fetching recent data", err);

        }
    }