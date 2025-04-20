import cron from "node-cron";
import { pointBase, penaltyPerDay, PriorityLevel } from "../utils/points";
import { Task } from "../models/Task";

cron.schedule(
  "* * * * *",
  async () => {
    try {
      console.log("Run");
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));

      const tasks = await Task.find({
        deadline: { $lt: startOfDay },
        status: { $ne: "pending" },
      });

      console.log(`Convert ${tasks.length} pending to overdue tasks.`);

      for (const task of tasks) {
        task.status = "overdue";
        await task.save();
      }
      console.log("All overdue tasks status updated successfully.");


      const overdueTasks = await Task.find({
        deadline: { $lt: startOfDay },
        status: { $ne: "overdue" },
      });

      if (overdueTasks.length === 0) {
        console.log("No overdue tasks found.");
        return;
      }
      console.log(`Found ${overdueTasks.length} overdue tasks.`);

      for (const task of overdueTasks) {
        const taskDuration = Math.floor(task.duration || 1); // Default to 1 minute if duration is not set
        const priority = task.priority as PriorityLevel;
        const points = taskDuration * penaltyPerDay[priority];
        const total = task.totalPointsContributed - points;
        task.totalPointsContributed = total;
        task.pointsContributed.push({ day: new Date(), points: -points });
        await task.save();
        console.log(
          `Task ${task.title} is overdue. Points deducted: ${points}`
        );
      }
      console.log("Overdue tasks processed successfully.");
    } catch (err) {
      console.error("Error in cron job:", err);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);
