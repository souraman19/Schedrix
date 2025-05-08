    import mongoose from 'mongoose';
    import dotenv from 'dotenv';

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