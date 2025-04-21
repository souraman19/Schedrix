import cron from "node-cron";
import { pointBase, penaltyPerDay, PriorityLevel } from "../utils/points";
import { Task } from "../models/Task";
import { UserPoints } from "../models/UserPoints";



export const customFunction = async() => {
    try {
      console.log("Run");
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));

      const tasks = await Task.find({
        deadline: { $lt: startOfDay },
        status: "pending",
      });

    //   console.log(`Convert ${tasks.length} pending to overdue tasks.`);

      for (const task of tasks) {
        task.status = "overdue";
        await task.save();
      }
      console.log("All overdue tasks status updated successfully.");


      const overdueTasks = await Task.find({
        deadline: { $lt: startOfDay },
        status: "overdue",
      });

      if (overdueTasks.length === 0) {
        // console.log("No overdue tasks found.");
        return;
      }
    //   console.log(`Found ${overdueTasks.length} overdue tasks.`);

      for (const task of overdueTasks) {
        const taskDuration = Math.floor(task.duration || 1); // Default to 1 minute if duration is not set
        const priority = task.priority as PriorityLevel;
        const points = taskDuration * penaltyPerDay[priority];
        const total = task.totalPointsContributed - points;
        task.totalPointsContributed = total;
        task.pointsContributed.push({ day: new Date(), points: -points });
        await task.save();
        console.log(
        //   `Task ${task.title} is overdue. Points deducted: ${points}`
        );

        const deadline = task.deadline as Date;
        const year = deadline.getFullYear();
        const day = deadline.getDate();
        const month = deadline.getMonth(); 
        const pointsDeduct = points;
        const taskId = task._id;
        const userId = task.createdBy;

        let userPointsBucket = await UserPoints.findOne({
          userId: userId,
          year: year,
        })

        if(!userPointsBucket){
          userPointsBucket = new UserPoints({
            userId: userId,
            year: year,
            points: [],
          });
        }
          
        let existingDayMonthIndex = userPointsBucket.points.findIndex((el) =>
          el.day === day && el.month === month
      )
      if(existingDayMonthIndex === -1){
          userPointsBucket.points.push({
          day: day,
          month: month,
          pointsGain: 0,
          pointsDeduct: pointsDeduct,
          })
      } else {
        const totalPoints = userPointsBucket.points[existingDayMonthIndex].pointsDeduct + pointsDeduct;
        userPointsBucket.points[existingDayMonthIndex].pointsDeduct = totalPoints;
      }
        userPointsBucket.markModified("points");
        await userPointsBucket.save();
      }
      console.log("Overdue tasks processed successfully.");
    } catch (err) {
      console.error("Error in cron job:", err);
    }
  };

cron.schedule("25 12 * * *", customFunction);
