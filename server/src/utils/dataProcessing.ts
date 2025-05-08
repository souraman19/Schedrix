import dotenv from "dotenv";
import { connectDB, disconnectDB } from '../config/db';
import { UserPoints } from "../models/UserPoints";
import { preProcessData } from "./dataPreProcessing";
import { convertToFeaturesAndLabels } from "./formatToModelIO";
import fs from 'fs';
import path from 'path';


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
        // console.log("Processed data:", output.features);
        // console.log("Labels:", output.labels);
        return output;

    }catch(err){
        console.error("Error in data processing:", err);
    }
}


const exportData = async() => {
    const input_to_model = await runDataProcessing();

    if(!input_to_model || !input_to_model.features || !input_to_model.labels){ 
        console.log("No data to export.");
        return;
    }

    if(input_to_model?.features.length !== input_to_model?.labels.length){
        console.log("Features and labels length mismatch.");
        return;
    }

    const combined = input_to_model?.features.map((row, index) => [...row, input_to_model?.labels[index]]);

    const headers = ['day', 'month', 'totalPoints', 'cumulativePoints', 'rollingAvgPoints', 'taskCompleted', 'taskMissed', 'pointsGain', 'pointsDeduct', 'mindStatus'];

    const csvContent = [
        headers.join(','), //convert header into a single string
        ...combined.map(row => row.join(',')) 
        //'combined' is an array of arrays, so we need to map over it and join each row into a string
        //convert each row into a comma separated string 
        //Combines the header and all rows into one array 
        //... creates a shallow copy of the array
        //and spreads it into the new array
    ].join('\n'); //join all rows into a single string with new line character

    const dataDir = path.join(__dirname, '..', 'data');
    if(!fs.existsSync(dataDir)){
        fs.mkdirSync(dataDir, {recursive: true}); //// 'recursive' ensures nested directories are created
    }
    const filePath = path.join(dataDir, 'training_data.csv'); //__dirname is the absolute path to the directory containing your current script
    fs.writeFileSync(filePath, csvContent);
    console.log("Data exported to training_data.csv in path", filePath);
    await disconnectDB();
}


exportData();


