import { faker } from '@faker-js/faker';
import mongoose from "mongoose";
import { UserPoints } from "./../models/UserPoints"; 
import { connectDB } from '../config/db';
import dotenv from "dotenv";



dotenv.config({path: "./../../.env"});


const generateDefaultData = (days = 7) => {
    let points = [];
    let mindStatus = "Default"; // Default state initially
  
    for (let day = 1; day <= days; day++) {
      const pointsGain = faker.number.int({ min: 5, max: 10 });
      const pointsDeduct = faker.number.int({ min: 0, max: 2 });
  
      points.push({
        day,
        month: faker.number.int({ min: 1, max: 12 }), // Random month
        pointsGain,
        pointsDeduct,
        mindStatus,
      });
    }
  
    return points;
  };


  const generateMotivatedData = (days = 7) => {
    let points = [];
    let mindStatus = "Motivated";
    let previousPointsGain = 5;
  
    for (let day = 1; day <= days; day++) {
      const pointsGain = previousPointsGain + faker.number.int({ min: 1, max: 3 }); // Gradual increase
      const pointsDeduct = faker.number.int({ min: 0, max: 1 });
  
      points.push({
        day,
        month: faker.number.int({ min: 1, max: 12 }),
        pointsGain,
        pointsDeduct,
        mindStatus,
      });
  
      previousPointsGain = pointsGain; // Update previous gain for next day
    }
  
    return points;
  };

  
  const generateDistractedData = (days = 7) => {
    let points = [];
    let mindStatus = "Distracted";
    let previousPointsGain = 10; // Start with good points, then drop suddenly
  
    for (let day = 1; day <= days; day++) {
      let pointsGain = previousPointsGain;
  
      // Simulate a sudden drop in points
      if (day === 3) {
        pointsGain = faker.number.int({ min: 0, max: 2 }); // Sudden drop
      }
  
      const pointsDeduct = faker.number.int({ min: 2, max: 5 });
  
      points.push({
        day,
        month: faker.number.int({ min: 1, max: 12 }),
        pointsGain,
        pointsDeduct,
        mindStatus,
      });
  
      previousPointsGain = pointsGain;
    }
  
    return points;
  };

  
  const generateTiredData = (days = 7) => {
    let points = [];
    let mindStatus = "Tired";
    let previousPointsGain = 8;
  
    for (let day = 1; day <= days; day++) {
      const pointsGain = previousPointsGain - faker.number.int({ min: 0, max: 2 }); // Gradual decrease
      const pointsDeduct = faker.number.int({ min: 0, max: 3 });
  
      points.push({
        day,
        month: faker.number.int({ min: 1, max: 12 }),
        pointsGain,
        pointsDeduct,
        mindStatus,
      });
  
      previousPointsGain = pointsGain;
    }
  
    return points;
  };

  
  const generateStressedData = (days = 7) => {
    let points = [];
    let mindStatus = "Stressed";
    let previousPointsGain = 10;
  
    for (let day = 1; day <= days; day++) {
      let pointsGain = previousPointsGain;
  
      // Sudden drop in points
      if (day === 3) {
        pointsGain = faker.number.int({ min: 1, max: 3 }); // Sudden low
      }
  
      const pointsDeduct = faker.number.int({ min: 2, max: 4 });
  
      points.push({
        day,
        month: faker.number.int({ min: 1, max: 12 }),
        pointsGain,
        pointsDeduct,
        mindStatus,
      });
  
      previousPointsGain = pointsGain;
    }
  
    return points;
  };

  
  const generateFocusedData = (days = 30) => {
    let points = [];
    let mindStatus = "Focused";
    let previousPointsGain = 10;
  
    for (let day = 1; day <= days; day++) {
      const pointsGain = previousPointsGain; // Constant high performance
      const pointsDeduct = faker.number.int({ min: 0, max: 1 });
  
      points.push({
        day,
        month: faker.number.int({ min: 1, max: 12 }),
        pointsGain,
        pointsDeduct,
        mindStatus,
      });
  
      previousPointsGain = pointsGain;
    }
  
    return points;
  };

  
  const generateDataForTraining = async(userId: mongoose.Types.ObjectId) => {
      
    await connectDB();

    const defaultData = generateDefaultData(7);
    const motivatedData = generateMotivatedData(7);
    const distractedData = generateDistractedData(7);
    const tiredData = generateTiredData(7);
    const stressedData = generateStressedData(7);
    const focusedData = generateFocusedData(30);
  
    // Combine all data for training
    const allData = [
      ...defaultData,
      ...motivatedData,
      ...distractedData,
      ...tiredData,
      ...stressedData,
      ...focusedData,
    ];

    const exisitngDoc = await UserPoints.findOne({userId: userId, year: new Date().getFullYear()});
    if (!exisitngDoc) {
        console.log("No existing document found for the user. Creating a new one.");
        return;
    }

    exisitngDoc.points.push(...allData);
    exisitngDoc.markModified("points");



    try {
        await exisitngDoc.save();
        console.log("User points data saved successfully!");
      } catch (err) {
        console.error("Error saving user points data:", err);
    }

  };


  
  (async () => {
    const userId = new mongoose.Types.ObjectId('6802475234c526656db5c9da')
    await generateDataForTraining(userId);
  })();
  

  

