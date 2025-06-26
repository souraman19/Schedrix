import { faker } from '@faker-js/faker';
import mongoose from "mongoose";
import { UserPoints } from "./../models/UserPoints";
import { connectDB } from '../config/db';
import dotenv from "dotenv";
import { pointBase, penaltyPerDay, PriorityLevel } from './../utils/points'; 

dotenv.config({ path: "./../../.env" });



const priorities: PriorityLevel[] = ["low", "medium", "high", "critical"];

const randomPriority = (): PriorityLevel =>
  faker.helpers.arrayElement(priorities);

const getPointsFromTasks = (completed: number, missed: number) => {
  let pointsGain = 0;
  let pointsDeduct = 0;

  for (let i = 0; i < completed; i++) {
    const priority = randomPriority();
    pointsGain += Math.floor(pointBase[priority] / 5); // ~20% of base value as reward
  }

  for (let i = 0; i < missed; i++) {
    const priority = randomPriority();
    pointsDeduct += penaltyPerDay[priority];
  }

  return { pointsGain, pointsDeduct };
};

const generateDefaultData = (days = 7) => {
  let points = [];
  let mindStatus = "Default";

  for (let day = 1; day <= days; day++) {
    const taskCompleted = faker.number.int({ min: 1, max: 3 });
    const taskMissed = faker.number.int({ min: 1, max: 2 });
    const { pointsGain, pointsDeduct } = getPointsFromTasks(taskCompleted, taskMissed);

    points.push({
      day,
      month: faker.number.int({ min: 1, max: 12 }),
      taskCompleted,
      taskMissed,
      pointsGain,
      pointsDeduct,
      mindStatus,
      isSetMindStatus: true, // Default data does not set mind status
    });
  }

  return points;
};

const generateMotivatedData = (days = 7) => {
  let points = [];
  let mindStatus = "Motivated";

  for (let day = 1; day <= days; day++) {
    const taskCompleted = faker.number.int({ min: 3, max: 5 });
    const taskMissed = faker.number.int({ min: 0, max: 1 });
    const { pointsGain, pointsDeduct } = getPointsFromTasks(taskCompleted, taskMissed);

    points.push({
      day,
      month: faker.number.int({ min: 1, max: 12 }),
      taskCompleted,
      taskMissed,
      pointsGain,
      pointsDeduct,
      mindStatus,
      isSetMindStatus: true, // Motivated data sets mind status
    });
  }

  return points;
};

const generateDistractedData = (days = 7) => {
  let points = [];
  let mindStatus = "Distracted";

  for (let day = 1; day <= days; day++) {
    const taskCompleted = day < 3 ? faker.number.int({ min: 3, max: 4 }) : faker.number.int({ min: 0, max: 1 });
    const taskMissed = day < 3 ? faker.number.int({ min: 0, max: 1 }) : faker.number.int({ min: 2, max: 4 });
    const { pointsGain, pointsDeduct } = getPointsFromTasks(taskCompleted, taskMissed);

    points.push({
      day,
      month: faker.number.int({ min: 1, max: 12 }),
      taskCompleted,
      taskMissed,
      pointsGain,
      pointsDeduct,
      mindStatus,
      isSetMindStatus: true, // Distracted data sets mind status
    });
  }

  return points;
};

const generateTiredData = (days = 7) => {
  let points = [];
  let mindStatus = "Tired";

  for (let day = 1; day <= days; day++) {
    const taskCompleted = faker.number.int({ min: 1, max: 3 });
    const taskMissed = faker.number.int({ min: 1, max: 3 });
    const { pointsGain, pointsDeduct } = getPointsFromTasks(taskCompleted, taskMissed);

    points.push({
      day,
      month: faker.number.int({ min: 1, max: 12 }),
      taskCompleted,
      taskMissed,
      pointsGain,
      pointsDeduct,
      mindStatus,
      isSetMindStatus: true, // Tired data sets mind status
    });
  }

  return points;
};

const generateStressedData = (days = 7) => {
  let points = [];
  let mindStatus = "Stressed";

  for (let day = 1; day <= days; day++) {
    const taskCompleted = day === 3 ? faker.number.int({ min: 0, max: 1 }) : faker.number.int({ min: 2, max: 3 });
    const taskMissed = day === 3 ? faker.number.int({ min: 2, max: 4 }) : faker.number.int({ min: 0, max: 1 });
    const { pointsGain, pointsDeduct } = getPointsFromTasks(taskCompleted, taskMissed);

    points.push({
      day,
      month: faker.number.int({ min: 1, max: 12 }),
      taskCompleted,
      taskMissed,
      pointsGain,
      pointsDeduct,
      mindStatus,
      isSetMindStatus: true, // Stressed data sets mind status
    });
  }

  return points;
};

const generateFocusedData = (days = 30) => {
  let points = [];
  let mindStatus = "Focused";

  for (let day = 1; day <= days; day++) {
    const taskCompleted = faker.number.int({ min: 4, max: 6 });
    const taskMissed = faker.number.int({ min: 0, max: 1 });
    const { pointsGain, pointsDeduct } = getPointsFromTasks(taskCompleted, taskMissed);

    points.push({
      day,
      month: faker.number.int({ min: 1, max: 12 }),
      taskCompleted,
      taskMissed,
      pointsGain,
      pointsDeduct,
      mindStatus,
      isSetMindStatus: true,
    });
  }

  return points;
};

const generateDataForTraining = async (userId: mongoose.Types.ObjectId) => {
  await connectDB();

  const defaultData = generateDefaultData(7);
  const motivatedData = generateMotivatedData(7);
  const distractedData = generateDistractedData(7);
  const tiredData = generateTiredData(7);
  const stressedData = generateStressedData(7);
  const focusedData = generateFocusedData(30);

  const allData = [
    ...defaultData,
    ...motivatedData,
    ...distractedData,
    ...tiredData,
    ...stressedData,
    ...focusedData,
  ];

  const existingDoc = await UserPoints.findOne({
    userId: userId,
    year: new Date().getFullYear(),
  });

  if (!existingDoc) {
    console.log("No existing document found for the user. Creating a new one.");
    return;
  }

  allData.forEach((data) => {
    existingDoc.points.push(data);
  });
  existingDoc.markModified("points");

  try {
    await existingDoc.save();
    console.log("User points data saved successfully!");
  } catch (err) {
    console.error("Error saving user points data:", err);
  }
};

(async () => {
  const userId = new mongoose.Types.ObjectId("6802475234c526656db5c9da");
  await generateDataForTraining(userId);
})();
