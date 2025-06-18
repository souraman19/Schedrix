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
        const { mindStatus, date } = req.body;
        const getDate = new Date(date);
        const year = getDate.getFullYear();
        const month = getDate.getMonth() + 1; 
        const day = getDate.getDate();

        if(!mindStatus){
            return res.status(400).json({message: "Mind status is required"})
        }

        const user = await User.findByIdAndUpdate(userId, {mindStatus}, {new: true}).exec();
        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        let userPointsBucket = await UserPoints.findOne({
      userId: userId,
      year: year,
    });

    if (!userPointsBucket) {
      userPointsBucket = new UserPoints({
        userId: userId,
        year: year,
        points: [],
      });
    }

    let existingDayMonthIndex = userPointsBucket.points.findIndex(
      (el) => el.day === day && el.month === month
    );
    console.log("Existing day month index: ", existingDayMonthIndex);

    if (existingDayMonthIndex === -1) {
      userPointsBucket.points.push({
        day: day,
        month: month,
        pointsGain: 0,
        pointsDeduct: 0,
        taskCompleted: 0,
        taskMissed: 0,
        mindStatus: mindStatus
      });
    } else {
        userPointsBucket.points[existingDayMonthIndex].mindStatus = mindStatus;
    }

    userPointsBucket.markModified("points");
    console.log("User points bucket: ", userPointsBucket);


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


export const updateLastActiveDay = async(req: any, res: any) => {
    try{
        const userId = req.user?._id;
        const lastActiveDay = req.body.lastActiveDay;
        const lastActiveDayFormatted = new Date(lastActiveDay);

        if(!userId){
            return res.status(400).json({message: "User ID is required"})
        }

        const user = await User.findById(userId).exec();
        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        user.lastActiveDay = lastActiveDayFormatted;
        user.activeDaysCount = user.activeDaysCount ? user.activeDaysCount + 1 : 1;
        await user.save();
        console.log("Last active day updated for user:", userId, lastActiveDayFormatted);
        return res.status(200).json({message: "Last active day updated successfully", user})
    }catch(err){
        console.log("Error in updateLastActiveDay:", err);
        res.status(500).json({message: "Internal server error"})
    }
}


export const updateLastMindStatusAskData = async(req: any, res: any) => {
    try{
        const userId = req.user._id;
        const lastDateAskedMindStatus = req.body.lastDateAskedMindStatus;
        const mindStatus = req.body.mindStatus;
        const lastDateAskedMindStatusFormatted = new Date(new Date(lastDateAskedMindStatus).setHours(0, 0, 0, 0)); 

        if(!userId){
            return res.status(400).json({message: "User ID is required"})
        }

        const user = await User.findById(userId).exec();
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        const currentDate = new Date();
        const currentDateFormatted = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        if (lastDateAskedMindStatusFormatted >= currentDateFormatted) {
            return res.status(400).json({message: "Last date asked mind status cannot be in the future or today"});
        }


        user.mindStatus = mindStatus;
        user.lastDateAskedMindStatus = lastDateAskedMindStatusFormatted;


        const year = lastDateAskedMindStatusFormatted.getFullYear();
        const month = lastDateAskedMindStatusFormatted.getMonth() + 1; // Months are 0-indexed in JavaScript
        const day = lastDateAskedMindStatusFormatted.getDate();

        let userPointsBucket = await UserPoints.findOne({
            userId: userId,
            year: year,
        });

        if (!userPointsBucket) {
            userPointsBucket = new UserPoints({
                userId: userId,
                year: year,
                points: [],
            });
        }

        let existingDayMonthIndex = userPointsBucket.points.findIndex(
            (el) => el.day === day && el.month === month
        );

        if (existingDayMonthIndex === -1) {
            userPointsBucket.points.push({
                day: day,
                month: month,
                pointsGain: 0,
                pointsDeduct: 0,
                taskCompleted: 0,
                taskMissed: 0,
                mindStatus: mindStatus
            });
        } else {
            userPointsBucket.points[existingDayMonthIndex].mindStatus = mindStatus;
        }

        userPointsBucket.markModified("points");

        
        await userPointsBucket.save();
        await user.save();
        console.log("Last mind status ask day updated for user:", userId, lastDateAskedMindStatusFormatted);
        return res.status(200).json({message: "Last mind status ask day updated successfully", user})
    }catch(err){
        console.log("Error in updateLastMindStatusAskDay:", err);
        res.status(500).json({message: "Internal server error"})
    }   
}