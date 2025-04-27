import { Cronlog } from "../models/Cronlog";
import { customFunctionTaskStatus } from "./cronJob";


export const checkMissedCron = async() => {
    console.log("Checking missed cron jobs...");
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        const gotLastRun = await Cronlog.findOne({title: "cron"}).exec();
        if(!gotLastRun){
            const cronlog = new Cronlog({  
                title: "cron",
                lastRun: today,
            }); 
            await cronlog.save();
        }else{
            const lastRun = gotLastRun.lastRun;
            // console.log("Last run date:", lastRun.toLocaleDateString(), lastRun.toLocaleTimeString());
            let dayofDiff = Math.floor((today.getTime() - lastRun.getTime()) / (1000 * 3600 * 24));
    
            if(dayofDiff === 0){
                // console.log("No missed cron jobs found.");
                return;
            } else {
                // console.log("Missed cron jobs found:", dayofDiff);
            }

            while(dayofDiff > 0){
                customFunctionTaskStatus();
                // console.log("Running cron job for missed days:", dayofDiff);
                dayofDiff--;
                gotLastRun.lastRun = new Date(gotLastRun.lastRun.getTime() + (1000 * 3600 * 24));
                await gotLastRun.save();
            } 

        }
    }catch(err){
        console.error("Error in running safety of cron job after restart of server:", err);
    }
}

(async () => {
    await checkMissedCron();
})(); // IIFE to run the function immediately