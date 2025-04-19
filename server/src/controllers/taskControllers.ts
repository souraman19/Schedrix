import { start } from "repl";
import { Task } from "../models/Task";

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
       res.status(201).json({message: "Task created successfully", task: newTask});
       
    }catch(error){
        console.error("Error creating task: ", error);
        res.status(500).json({error: "Internal server error"});
    }
}