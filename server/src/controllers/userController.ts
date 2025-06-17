import { getlast7daysPointsData } from "../config/db";
import { User } from "../models/User";
import { UserPoints } from "../models/UserPoints"
import { preProcessData, ProcessedPoint } from "../utils/dataPreProcessing";
import { convertToFeaturesAndLabels } from "../utils/formatToModelIO";
import axios from "axios";

export const getPointAnalytics = async(req: any, res: any) => {
    try{
        const userId = req.user._id; 
        const year = new Date().getFullYear();

        const userPoints = await UserPoints.findOne({userId, year});
        if(!userPoints){
            return res.status(200).json({message: "No points found for this year", points:[]})
        }

        return res.status(200).json({points: userPoints.points})
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Internal server error"})
    }
}


export const getUserProfile = async(req: any, res: any) => {
    try{
        const userId = req.user._id; 
        const user = await User.findById(userId).exec();
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        return res.status(200).json({user})
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Internal server error"})
    }
}


export const getMindStatus = async(req: any, res: any) => {

    try{
        const userId = req.user._id; 
        const getRecentData = await getlast7daysPointsData(userId);
        if(!getRecentData){
            return res.status(200).json({message: "No data found", mindStatus: null})
        }
        // console.log("Recent data:", getRecentData)
        // console.log("Recent data length:", getRecentData.length)
        const rawData = getRecentData.map((point: any) => point).flat(); // Flatten the array of points
        const processedData = preProcessData(rawData);
        const inputData = convertToFeaturesAndLabels(processedData).features;
        // console.log("Input data:", inputData);

        //send data to python ml service
        const predictedResponse = await axios.post("http://localhost:6000/predict", {
            input: inputData
        });

        const predictedMindStatus = predictedResponse.data.predictedMindStatus;
        // console.log("Predicted Mind Status:", predictedMindStatus);

        return res.status(200).json({message: "Mind status fetched successfully", mindStatus: predictedMindStatus})


    }catch(err){
        console.log(err)
        res.status(500).json({message: "Internal server error"})
    }
}

export const editMindStatus = async(req: any, res: any) => {
    try{
        console.log("Editing mind status for user:", req.user._id);
        console.log("Request body:", req.body);
        const userId = req.user._id; 
        const { mindStatus } = req.body;

        if(!mindStatus){
            return res.status(400).json({message: "Mind status is required"})
        }

        const user = await User.findByIdAndUpdate(userId, {mindStatus}, {new: true}).exec();
        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        console.log("Mind status updated for user:", userId, mindStatus);
        return res.status(200).json({message: "Mind status updated successfully", user})
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Internal server error"})
    }
}


export const saveFCMToken = async(req: any, res: any) => {
    try{
        const userId = req.user._id; 
        const  fcmToken = req.body.token;

        if(!fcmToken){
            return res.status(400).json({message: "FCM token is required"})
        }

        const user = await User.findByIdAndUpdate(userId, {fcmToken}, {new: true}).exec();
        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        console.log("FCM token saved for user:", userId, fcmToken);
        return res.status(200).json({message: "FCM token saved successfully", user})
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Internal server error"})
    }
}