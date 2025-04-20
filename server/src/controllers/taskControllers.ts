import { start } from "repl";
import { Task } from "../models/Task";
import {Types} from "mongoose";

export const createTask = async(req: any, res: any) => {
    try {
        let { 
            title, 
            duration, 
            startTime, 
            endTime, 
            deadline,
            description,
            isLocked,
            isFixed,
            category,
            priority,
            image,
            audio,
        } = req.body;

        // console.log("Request body: ", req.body);

        const userId = req.user._id; // Assuming you have user ID in req.user

        if(!duration && startTime && endTime){
            const start = new Date(startTime).getTime();
            const end = new Date(endTime).getTime();
            duration = (end - start) / (1000 * 60 * 60);
        }
        if(duration && startTime && !endTime){
            const start = new Date(startTime).getTime();
            const end = start + (duration * 60 * 60 * 1000);
            endTime = new Date(end);
        }
        if(duration && endTime && !startTime){
            const end = new Date(endTime).getTime();
            const start = end - (duration * 60 * 60 * 1000);
            startTime = new Date(start);
        }

        const newTask = new Task({
            title : title.trim(),
            duration,
            startTime,
            endTime,
            deadline,
            status: 'pending',
            isLocked,
            isFixed,
            userInput:{
                text: description && description.trim() !== "" ? description.trim() : "",
                image: image ? [image] : [],
                audio: audio ? [audio] : [],
                video: [],
            },
            userOutput:{
                text: "",
                image: [],
                audio: [],
                video: [],
            },
            OutputAnalysis:{
                text: "",
                image: [],
                audio: [],
                video: [],
            },
            pointsContributed: [],
            totalPointsContributed: 0,
            category,
            priority,
            createdBy: userId,
            tags:[],   
        })
       await newTask.save();
    //    console.log("New task created: ", newTask);
       return res.status(201).json({message: "Task created successfully", task: newTask});
       
    }catch(error){
        console.error("Error creating task: ", error);
        return res.status(500).json({error: "Internal server error"});
    }
}


export const getFilteredTasks = async(req: any, res: any) => {
    try{
        // console.log("req.body", req.body);
        const {status, priority, dateMode, isLocked, isFixed, month, year, date, dateField, category} = req.body;
        const userId = req.user._id; 

        interface Taskfilter{
            status?: string;
            priority?: string;
            isLocked?: boolean;
            isFixed?: boolean;
            createdBy?: string;
            category?: string;
            [key: string]: any;  // Dynamic keys
        }

        const filter: Taskfilter = {};

        if(status !== "all"){
            filter.status = status;
        }

        if(priority !== "all"){
            filter.priority = priority;
        }

        if(category !== "all"){
            filter.category = category;
        }

        filter.isLocked = isLocked;
        filter.isFixed = isFixed;
        filter.createdBy = userId;


        
        let formatedDateField = dateField;
    
    
        if(dateField === "createdOn"){
                formatedDateField = "createdAt";
        } else if(dateField === "startsOn"){
                formatedDateField = "startTime";
        } else if(dateField === "deadline"){
                formatedDateField = "deadline";
        }
        const selectedDate = new Date(year, month, date);

        if(dateMode === "selected"){
            const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0)) // Start of the selected date
            const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999)) // End of the selected date
            filter[formatedDateField] = {$gte: startOfDay, $lte: endOfDay};
        }

        if(dateMode === "last3"){
            const from = new Date();
            from.setDate(from.getDate() - 3); // 3 days ago from doday
            filter[formatedDateField] = {$gte: from};
        }

        if(dateMode === "last7"){
            const from = new Date();
            from.setDate(from.getDate() - 7); // 7 days ago from doday
            filter[formatedDateField] = {$gte: from};
        }

        const tasks = await Task.find(filter).sort({[formatedDateField]: -1}).exec();

        res.status(200).json({tasks});
    }catch(err){
        console.error("Error getting filtered tasks: ", err);
        res.status(500).json({error: "Internal server error"});
    }
}


export const getTaskStaticDetails = async(req: any, res: any) => {
    try{
        const _id = req.params._id;
        // console.log("Hello", _id);
        const userId = req.user._id; 
        const task = await Task.findOne({_id: new Types.ObjectId(_id)})
        .select('title _id category userInput duration startTime endTime isLocked isFixed priority createdAt updatedAt')
        .exec();
        if(!task){
            return res.status(404).json({error: "Task not found"});
        }
        // console.log("Task found: ", task);
        return res.status(200).json({task});
    }catch(err){
        console.error("Error getting task static details: ", err);
        res.status(500).json({error: "Internal server error"});
    }
}



export const getTaskDynamicDetails = async(req: any, res: any) => {
    try{
        const _id = req.params._id;
        // console.log("Hello", _id);
        const userId = req.user._id; 
        const task = await Task.findOne({_id: new Types.ObjectId(_id)})
        .select(' _id userOutput status totalPointsContributed pointsContributed outputAnalysis deadline')
        .exec();
        if(!task){
            return res.status(404).json({error: "Task not found"});
        }
        console.log("Task found: ", task);
        return res.status(200).json({task});
    }catch(err){
        console.error("Error getting task static details: ", err);
        res.status(500).json({error: "Internal server error"});
    }
}


export const resolveTask = async(req: any, res: any) => {
    try {
        const _id = req.params._id;
        const userId = req.user._id;
        const userInputText = req.body.userInputText;

        
 

    }catch(err){
        console.error("Error resolving task: ", err);
        res.status(500).json({error: "Internal server error"});
    }
}