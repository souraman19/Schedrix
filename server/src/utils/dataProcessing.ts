import dotenv from "dotenv";
import { connectDB } from '../config/db';
import { UserPoints } from "../models/UserPoints";
import { preProcessData } from "./dataPreProcessing";
import { convertToFeaturesAndLabels } from "./formatToModelIO";


dotenv.config({ path: "./../../.env" });


const fetchPointsData = async() => {
    const rawData = await UserPoints.find().select('points').lean().exec(); // Fetch only the points field
    return rawData.map(point => point.points).flat(); // Flatten the array of points
}


const processPointsData  = (points: any[])=> {
    return preProcessData(points)
}


const convertToFeatures = (processedData: any[]) => {
    return convertToFeaturesAndLabels(processedData);
}

const runDataProcessing = async() => {
    try{
        await connectDB();
        const pointsData = await fetchPointsData();
        if(pointsData.length === 0){
            console.log("No points data found.");
            return;
        }
        const processedData = processPointsData(pointsData);
        const output = convertToFeatures(processedData);
        console.log("Processed data:", output.features);
        console.log("Labels:", output.labels);

    }catch(err){
        console.error("Error in data processing:", err);
    }
}


runDataProcessing();


