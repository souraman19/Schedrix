import { Task } from "../models/Task";
import { Types } from "mongoose";
import { pointBase, PriorityLevelPointBase } from "../utils/points";
import { UserPoints } from "../models/UserPoints";
import { User } from "../models/User";
import { addReminderJob } from "../lib/queues/addReminderJob";
import { reminderQueue } from "../lib/queues/reminderQueue";

export const createTask = async (req: any, res: any) => {
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
      repeat,
      customRepeat,
      isReminder,
      whenReminder,
    } = req.body;

    const images = req.files?.images ?? [];

    const userId = req.user._id; // Assuming you have user ID in req.user

    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (repeat === "no repeat") user.progress.totalTasks += 1;

    if (!duration && startTime && endTime) {
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();
      duration = (end - start) / (1000 * 60 * 60);
    }
    if (duration && startTime && !endTime) {
      const start = new Date(startTime).getTime();
      const end = start + duration * 60 * 60 * 1000;
      endTime = new Date(end);
    }
    if (duration && endTime && !startTime) {
      const end = new Date(endTime).getTime();
      const start = end - duration * 60 * 60 * 1000;
      startTime = new Date(start);
    }

    const newTask = new Task({
      title: title.trim(),
      duration,
      startTime,
      endTime,
      deadline,
      status: "pending",
      isLocked,
      isFixed,
      userInput: {
        text:
        description && description.trim() !== "" ? description.trim() : "",
        image: images.map((img : any) => img.filename) ?? [],
        audio: audio ? [audio] : [],
        video: [],
      },
      userOutput: {
        text: "",
        image: [],
        audio: [],
        video: [],
      },
      OutputAnalysis: {
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
      tags: [],
      repeat,
      reminder: {
        enabled: isReminder,
        remainderTimeBefore: whenReminder,
      },
      ...(customRepeat ? { customRepeat } : {}), // Spread customRepeat only if it exists
    });

    if (isReminder && (startTime || (endTime && duration))) {
      const reminderOffset = whenReminder * 60 * 1000; // Convert minutes to milliseconds
      const durationInMs = duration ? duration * 60 * 60 * 1000 : 0; // Convert hours to milliseconds
      let remindAt: Date | undefined;
      if (startTime) {
        remindAt = new Date(new Date(startTime).getTime() - reminderOffset);
      } else if (endTime) {
        remindAt = new Date(
          new Date(endTime).getTime() - durationInMs - reminderOffset
        );
      }
      if (remindAt && remindAt.getTime() > Date.now()) {
        // Add reminder job to the queue
        await addReminderJob({
          taskId: (newTask as any)._id.toString(),
          userId: userId.toString(),
          remindAt,
          taskTitle: title,
          whenReminder,
        });
        console.log("Reminder job added in queue for task: ", newTask._id);
        
      }
    }

    await user.save();
    await newTask.save();
    return res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getFilteredTasks = async (req: any, res: any) => {
  try {
    const {
      status,
      priority,
      dateMode,
      isLocked,
      isFixed,
      month,
      year,
      date,
      dateField,
      category,
    } = req.body;
    const userId = req.user._id;

    interface Taskfilter {
      status?: string;
      priority?: string;
      isLocked?: boolean;
      isFixed?: boolean;
      createdBy?: string;
      category?: string;
      [key: string]: any; // Dynamic keys
      repeat?: string;
    }

    const filter: Taskfilter = {};

    if (status !== "all") {
      filter.status = status;
    }

    if (priority !== "all") {
      filter.priority = priority;
    }

    if (category !== "all") {
      filter.category = category;
    }

    filter.isLocked = isLocked;
    filter.isFixed = isFixed;
    filter.createdBy = userId;

    filter.repeat = "no repeat";

    let formatedDateField = dateField;

    if (dateField === "createdOn") {
      formatedDateField = "createdAt";
    } else if (dateField === "startsOn") {
      formatedDateField = "startTime";
    } else if (dateField === "deadline") {
      formatedDateField = "deadline";
    }
    const selectedDate = new Date(year, month, date);

    if (dateMode === "selected") {
      const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0)); // Start of the selected date
      const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999)); // End of the selected date
      filter[formatedDateField] = { $gte: startOfDay, $lte: endOfDay };
    }

    if (dateMode === "last3") {
      const from = new Date();
      from.setDate(from.getDate() - 3); // 3 days ago from doday
      filter[formatedDateField] = { $gte: from };
    }

    if (dateMode === "last7") {
      const from = new Date();
      from.setDate(from.getDate() - 7); // 7 days ago from doday
      filter[formatedDateField] = { $gte: from };
    }

    const tasks = await Task.find(filter)
      .sort({ [formatedDateField]: -1 })
      .exec();

    res.status(200).json({ tasks });
  } catch (err) {
    console.error("Error getting filtered tasks: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTaskStaticDetails = async (req: any, res: any) => {
  try {
    const _id = req.params._id;
    const userId = req.user._id;
    const task = await Task.findOne({ _id: new Types.ObjectId(_id) })
      .select(
        "title _id category userInput duration startTime endTime isLocked isFixed priority createdAt updatedAt masterTaskId"
      )
      .exec();
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(200).json({ task });
  } catch (err) {
    console.error("Error getting task static details: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetch7DaysTasks = async (req: any, res: any) => {
  try {
    const day = req.params.day;
    const baseDate = new Date(day);

    const startDay = new Date(baseDate);
    startDay.setHours(0, 0, 0, 0);

    const endDay = new Date(baseDate);
    endDay.setDate(endDay.getDate() + 6);
    endDay.setHours(23, 59, 59, 999);

    const userId = req.user._id;

    const tasks = await Task.find({
      createdBy: userId,
      repeat: "no repeat",
      $or: [
        {
          $and: [
            { startTime: { $gte: startDay } },
            { startTime: { $lte: endDay } },
          ],
        },
        {
          $and: [
            { endTime: { $gte: startDay } },
            { endTime: { $lte: endDay } },
          ],
        },
        {
          $and: [
            { deadline: { $gte: startDay } },
            { deadline: { $lte: endDay } },
            { status: { $ne: "completed" } },
          ],
        },
      ],
    })
      .select(
        "_id status outputAnalysis deadline masterTaskId duration startTime endTime isLocked isFixed title priority"
      )
      .exec();

    if (!tasks) {
      return res.status(404).json({ error: "No Task found" });
    }
    return res.status(200).json({ tasks });
  } catch (err) {
    console.error("Error getting task static details: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTaskDynamicDetails = async (req: any, res: any) => {
  try {
    const _id = req.params._id;
    const userId = req.user._id;
    const task = await Task.findOne({ _id: new Types.ObjectId(_id) })
      .select(
        " _id userOutput status reminder totalPointsContributed pointsContributed outputAnalysis deadline masterTaskId"
      )
      .exec();
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(200).json({ task });
  } catch (err) {
    console.error("Error getting task static details: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resolveTask = async (req: any, res: any) => {
  // console.log("Resolving task: ", req.params);
  try {
    const _id = req.params._id;
    const userInputText = req.body.userInputText;

    const task = await Task.findOne({ _id: new Types.ObjectId(_id) }).exec();
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    if (task.status === "completed") {
      return res.status(499).json({ error: "Task already completed" });
    }

    if (task.isMaster) {
      const slaveTasks = await Task.find({ masterTaskId: task._id });
      for (const slaveTask of slaveTasks) {
        if (slaveTask.status !== "completed") {
          return res
            .status(499)
            .json({
              error:
                "Resolve or delete slave tasks before resolving the master task",
            });
        }
      }
      task.masterStatus = "completed";
    }

    if (task.repeat === "repeat") {
      task.status = "completed";
      task.userOutput.text =
        userInputText && userInputText.trim() !== ""
          ? userInputText.trim()
          : "";
      await task.save();
      return res
        .status(200)
        .json({ message: "Task resolved successfully", task });
    }

    const userId = req.user._id;
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.progress.completedTasks += 1;

    let x = 1;
    if (task.deadline)
      x = Math.floor(
        (new Date().getTime() - new Date(task.deadline).getTime()) /
          (1000 * 60 * 60 * 24)
      ); // in days

    const duration = task.duration || 1; // Default to 1 hour if duration is not set
    const priority = task.priority as PriorityLevelPointBase;
    const points_add = pointBase[priority] + duration * x;
    const total = task.totalPointsContributed + points_add;
    task.totalPointsContributed = total;
    task.pointsContributed.push({ day: new Date(), points: points_add });
    task.status = "completed";
    task.userOutput.text =
      userInputText && userInputText.trim() !== "" ? userInputText.trim() : "";

    user.progress.points += points_add;
    user.progress.pointsGained += points_add;

    const now = new Date();
    const year = now.getFullYear();
    const day = now.getDate();
    const month = now.getMonth();
    const pointsAdd = points_add;
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
    console.log("Existing day month index: ", existingDayMonthIndex);

    if (existingDayMonthIndex === -1) {
      userPointsBucket.points.push({
        day: day,
        month: month,
        pointsGain: pointsAdd,
        pointsDeduct: 0,
        taskCompleted: 1,
        taskMissed: 0,
        mindStatus: "Default",
        isSetMindStatus: false, // Set to false as mind status is not set for this task
      });
    } else {
      const totalPoints =
        userPointsBucket.points[existingDayMonthIndex].pointsGain + pointsAdd;
      userPointsBucket.points[existingDayMonthIndex].pointsGain = totalPoints;
      userPointsBucket.points[existingDayMonthIndex].taskCompleted += 1;
    }

    userPointsBucket.markModified("points");

    console.log("User points bucket: ", userPointsBucket);

    await user.save();
    await task.save();
    await userPointsBucket.save();

    return res
      .status(200)
      .json({ message: "Task resolved successfully", task });
  } catch (err) {
    console.error("Error resolving task: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTaskRepeatInfo = async (req: any, res: any) => {
  try {
    const _id = req.params._id;
    const task = await Task.findOne({ _id: new Types.ObjectId(_id) })
      .select(" _id repeat customRepeat isMaster")
      .exec();
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(200).json({ task });
  } catch (err) {
    console.error("Error getting task repeat info: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTaskTimings = async (req: any, res: any) => {
  try {
    // console.log("Getting task timings: ", req.params._id);
    const _id = req.params._id;
    const task = await Task.findOne({ _id: new Types.ObjectId(_id) })
      .select("_id startTime endTime deadline")
      .exec();
    if (!task) {
      console.log("Task not found: ", _id);
      return res.status(404).json({ error: "Task not found" });
    }
    console.log("Task timings: ", task);

    return res.status(200).json({ task });
  } catch (err) {
    console.error("Error getting task timings: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const rescheduleTask = async (req: any, res: any) => {
  try {
    const _id = req.params._id;
    const { startTime, endTime, deadline } = req.body;

    const task = await Task.findOne({ _id: new Types.ObjectId(_id) }).exec();

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const formattedStartTime = startTime ? new Date(startTime) : null;
    const formattedEndTime = endTime ? new Date(endTime) : null;
    const formattedDeadline = deadline ? new Date(deadline) : null;

    const sameStart =
      task.startTime?.getTime() === formattedStartTime?.getTime();
    const sameEnd = task.endTime?.getTime() === formattedEndTime?.getTime();
    const sameDeadline =
      task.deadline?.getTime() === formattedDeadline?.getTime();

    if (sameStart && sameEnd && sameDeadline) {
      return res.status(204).send(); // No content, nothing to update
    }

    if (startTime) {
      task.startTime = formattedStartTime ? formattedStartTime : task.startTime;
    }
    if (endTime) {
      task.endTime = formattedEndTime ? formattedEndTime : task.endTime;
    }
    if (deadline) {
      task.deadline = formattedDeadline ? formattedDeadline : task.deadline;
    }

    const priority = task.priority as PriorityLevelPointBase;
    const pointsCut = pointBase[priority];

    const userId = req.user._id;
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.progress.points -= pointsCut;

    const now = new Date();
    const year = now.getFullYear();
    const day = now.getDate();
    const month = now.getMonth();
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
    // console.log("Existing day month index: ", existingDayMonthIndex);

    if (existingDayMonthIndex === -1) {
      userPointsBucket.points.push({
        day: day,
        month: month,
        pointsGain: 0,
        pointsDeduct: pointsCut,
        taskCompleted: 0,
        taskMissed: 0,
        mindStatus: "Default",
        isSetMindStatus: false, // Set to false as mind status is not set for this task
      });
    } else {
      const totalPoints =
        userPointsBucket.points[existingDayMonthIndex].pointsDeduct + pointsCut;
      userPointsBucket.points[existingDayMonthIndex].pointsDeduct = totalPoints;
    }

    userPointsBucket.markModified("points");

    console.log("Updated: ", userPointsBucket.points[existingDayMonthIndex]);

    const total = task.totalPointsContributed - pointsCut;
    task.totalPointsContributed = total;
    task.pointsContributed.push({ day: new Date(), points: -1 * pointsCut });

    await user.save();
    await task.save();
    await userPointsBucket.save();

    return res
      .status(200)
      .json({ message: "Task rescheduled successfully", task });
  } catch (err) {
    console.error("Error rescheduling task: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const rescheduleTaskLists = async (req: any, res: any) => {
  try {
    console.log("Rescheduling task lists: ", req.body);
    const taskList = req.body.tasks;
    if (!Array.isArray(taskList)) {
      return res.status(400).json({ error: "Invalid task format" });
    }
    const updates = [];

    for (const updatedTask of taskList) {
      const exisitngTask = await Task.findById(updatedTask._id);
      if (!exisitngTask) continue;

      const newStart = new Date(updatedTask.startTime);
      const newEnd = new Date(updatedTask.endTime);

      const isStartChanged =
        exisitngTask.startTime?.getTime() !== newStart.getTime();
      const isEndChanged = exisitngTask.endTime?.getTime() !== newEnd.getTime();

      if (isStartChanged || isEndChanged) {
        exisitngTask.startTime = newStart;
        exisitngTask.endTime = newEnd;
        await exisitngTask.save();
        updates.push(exisitngTask._id);
      }

      res.status(200).json({
        message: "Tasks rescheduled successfully",
        updatedCount: updates.length,
        updatedTasks: updates,
      });
    }
  } catch (err) {
    console.error("Error in rescheduling tasks:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const editReminderTime = async (req: any, res: any) => {
  try {
    const { taskId, remainderTimeBefore } = req.body;
    if (!taskId || !remainderTimeBefore) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const task = await Task.findById(taskId).exec();
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (!task.reminder || !task.reminder.enabled) {
      return res
        .status(400)
        .json({ error: "Remainder is not enabled for this task" });
    }

    task.reminder.reminderTimeBefore = remainderTimeBefore;

    await task.save();

    return res
      .status(200)
      .json({ message: "Remainder time updated successfully", task });
  } catch (err) {
    console.error("Error editing remainder time: ", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
