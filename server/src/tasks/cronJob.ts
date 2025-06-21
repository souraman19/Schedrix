
import cron from "node-cron";
import { pointBase, penaltyPerDay, PriorityLevel } from "./../utils/points";
import { Task } from "./../models/Task";
import { UserPoints } from "./../models/UserPoints";
import {
  getDaysBetween,
  getWeeksBetween,
  getMonthsBetween,
  getYearsBetween,
} from "./../utils/getTimeDiff";
import { User } from "../models/User";


// console.log("Cron job started.");


export const customFunctionTaskStatus = async () => {
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

      const userId = task.createdBy;
      const user = await User.findById(userId);
      if (!user) {
        console.log("User not found. Skipping points deduction.");
        continue;
      }
      user.progress.points -= points;
      user.progress.overdueTasks += 1;

      
      const deadline = task.deadline as Date;
      const year = deadline.getFullYear();
      const day = deadline.getDate();
      const month = deadline.getMonth();
      const pointsDeduct = points;
      const taskId = task._id;

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
          pointsDeduct: pointsDeduct,
          taskCompleted: 0,
          taskMissed: 1,
          mindStatus: "Default",
          isSetMindStatus: false, // Set to false as mind status is not set for overdue tasks
        });
      } else {
        const totalPoints =
          userPointsBucket.points[existingDayMonthIndex].pointsDeduct +
          pointsDeduct;
          userPointsBucket.points[existingDayMonthIndex].pointsDeduct =
          totalPoints;
          userPointsBucket.points[existingDayMonthIndex].taskMissed += 1;
        }
        userPointsBucket.markModified("points");

        await task.save();
        await user.save();
        await userPointsBucket.save();
    }
    console.log("Overdue tasks processed successfully.");
  } catch (err) {
    console.error("Error in cron job:", err);
  }
};

export const createTaskInstance = async () => {

  console.log("Running createTaskInstance cron job...");
  const today = new Date();

  let filter = {
    repeat: { $eq: "repeat" },
    isMaster: { $eq: true },
    masterStatus: { $eq: "pending" },
  };

  const masterTasks = await Task.find(filter).exec();
  const todaysToCreateTasks = masterTasks.filter((task) =>
    shouldCreateInstance(today, task)
  );

  if (todaysToCreateTasks.length === 0) {
    console.log("No tasks to create instances for today.");
    return;
  }
  console.log(
    `Found ${todaysToCreateTasks.length} tasks to create instances for today.`
  );

  for (const masterTask of todaysToCreateTasks){
    try{
    const  existingTask = await Task.findOne({
      isMaster: false,
      masterTaskId: masterTask._id,
    })
    if(existingTask){
      console.log("Task instance already exists for today. Skipping creation.");
      continue;
    } 


    const masterTaskWithoutId = masterTask.toObject(); // Convert Mongoose document to plain object
    delete masterTaskWithoutId._id;  // Remove the _id field from the master task object

    const newTask = new Task({
        ...masterTaskWithoutId,
        isMaster: false,
        masterTaskId: masterTask._id,
        createdBy: masterTask.createdBy,
        pointsContributed: [],
        totalPointsContributed: 0,
        repeat: "no repeat",
        customRepeat:{},
        status: "pending",
        masterStatus: "N/A",
        deadline: new Date().setHours(23, 59, 59, 999), // Set to end of the day
      })
      const userId = masterTask.createdBy;

      const user = await User.findById({userId});
      if(!user){
        console.log("User not found. Skipping task instance creation.");
        continue;
      }

      user.progress.totalTasks += 1;

      await newTask.save();
      await user.save();
    }catch(err){
      console.error("Error in creating task instance:", err);

    }
  }
  console.log("Task instances created successfully.");
};

export const shouldCreateInstance = (today: Date, masterTask: any) => {
  if (masterTask.repeat === "no repeat") return false;

  const repeatInterval = masterTask.customRepeat.repeatInterval;
  const repeatUnit = masterTask.customRepeat.repeatUnit;
  const endsType = masterTask.customRepeat.endsType;
  const startDate = new Date(masterTask.customRepeat.startDate);
  const endsOn = masterTask.customRepeat.endsOn;
  const weekDaysIfWeekInterval = masterTask.customRepeat.weekDaysIfWeekInterval;
  const monthDaysIfMonthInterval = masterTask.customRepeat.monthDaysIfMonthInterval;
  const yearDaysIfYearInterval = masterTask.customRepeat.yearDaysIfYearInterval;


  const startDateFormatted = new Date(
    startDate.getFullYear(), 
    startDate.getMonth(), 
    startDate.getDate()
  );
  
  const todayFormatted = new Date(
    today.getFullYear(), 
    today.getMonth(), 
    today.getDate()
  );


  if(todayFormatted < startDateFormatted) return false;

  if(endsType === "date"){
    const endsDate = new Date(endsOn.date);
    const endsDateFormatted = new Date(
      endsDate.getFullYear(), 
      endsDate.getMonth(), 
      endsDate.getDate()
    );
    if(todayFormatted > endsDateFormatted) return false;
  }


  

  if(repeatUnit === "day"){
    const daysDiff = getDaysBetween(startDateFormatted, todayFormatted);
    const currentCount = daysDiff / repeatInterval;
    if(endsType === "afterOccurrences"){
      const afterOccurrences = endsOn.afterOccurrences;
      if(currentCount > afterOccurrences) return false;
    }
    return daysDiff % repeatInterval === 0;
  } else if(repeatUnit === "week"){
    const weekDiff = getWeeksBetween(startDateFormatted, todayFormatted);
    const currentCount = weekDiff / repeatInterval;
    if(endsType === "afterOccurrences"){
      const afterOccurrences = endsOn.afterOccurrences;
      if(currentCount > afterOccurrences) return false;
    }
    if(weekDaysIfWeekInterval && weekDaysIfWeekInterval.length > 0){
      const currentDay = today.toLocaleDateString('en-US', { weekday: 'short' })
      if(!weekDaysIfWeekInterval.includes(currentDay)) return false;
    }
    return weekDiff % repeatInterval === 0;
  } else if(repeatUnit === "month"){
    const monthDiff = getMonthsBetween(startDateFormatted, todayFormatted);
    const currentCount = monthDiff / repeatInterval;
    if(endsType === "afterOccurrences"){
      const afterOccurrences = endsOn.afterOccurrences;
      if(currentCount > afterOccurrences) return false;
    }
    if(monthDaysIfMonthInterval && monthDaysIfMonthInterval.length > 0){
      const currentDay = today.getDate();
      if(!monthDaysIfMonthInterval.includes(currentDay)) return false;
    }
    return monthDiff % repeatInterval === 0;
  }
// else if(repeatUnit === "year"){  //will be added later

  return false;
};



// cron.schedule("* * * * *", createTaskInstance);   //set to every minute for testing, change to 0 0 * * * for daily

// cron.schedule("* * * * *", customFunctionTaskStatus); //set to every minute for testing, change to 0 0 * * * for daily

