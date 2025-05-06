"use client";

import React, { useEffect, useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { GET_TASK_STATIC_DETAILS_ROUTE } from "@/lib/apiRoutes";
import { ArrowBigRight } from "lucide-react";
import { useRouter } from "next/navigation";


export default function LinkForMasterTask({ _id }: { _id: string }) {

     type TaskType = {
        _id: string;
        title: string;
        category: string;
        userInput: { text: string };
        duration: number;
        startTime: Date;
        endTime: Date;
        isLocked: boolean;
        isFixed: boolean;
        priority: string;
        createdAt: Date;
        updatedAt: Date;
        masterTaskId: string | null;
      };
    
        const router = useRouter();
    
      const experimantal_ppr = "true";
    
      const [taskData, setTaskData] = useState<TaskType | null>(null);
    
    
      const getTaskData = async () => {

        try {
            const response: Response = await fetch(`${GET_TASK_STATIC_DETAILS_ROUTE}/${_id}`, {
              method: "GET",
                credentials: "include",
            });
            const result = await response.json();
            setTaskData(result.task);
            // console.log("Task data fetched successfully: ", taskData);
          } catch (err) {
            console.error("Error fetching task details:", err);
          }
      }

      useEffect(() => {
        getTaskData();
      }, [])
    
      const containerStyle = {
        background: "linear-gradient(135deg, #121212, #111)",
        color: "white",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.4)",
        maxWidth: "800px",
        margin: "40px auto",
        animation: "fadeIn 1.5s ease-out",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      };

      if (taskData === null) {
        return <div>Loading task data...</div>;
      }
      if(taskData?.masterTaskId === null){
        return <></>
      }

    return (
        <>
            {taskData && (
                <div style={containerStyle}>
                { taskData?.masterTaskId && (
                         <div style={{ ...cardStyle, ...hoverCardStyle }}>
                           <div className="flex justify-between">
                             <p style={labelStyle}>Go for master Task:</p>
                             <Button
                                onClick={() => router.push(`/in/task/${taskData?.masterTaskId}`)}
                             >
                                <ArrowBigRight/>
                             </Button>
                           </div>
                         </div>
                       )}
           </div>
            )}
        </>
    );
}



const containerStyle = {
    background: "linear-gradient(135deg, #121212, #111)",
    color: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.4)",
    maxWidth: "800px",
    margin: "40px auto",
    animation: "fadeIn 1.5s ease-out",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  };

  // Title Style with Bright Neon and glowing effect
  const titleStyle = {
    fontSize: "1.8rem",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "40px",
    color: "#00c853",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    background: "linear-gradient(45deg, #00c853, #b2ff59)",
    WebkitBackgroundClip: "text",
    color: "transparent",
    textShadow: "0 0 12px rgba(0, 200, 83, 0.8), 0 0 20px rgba(0, 200, 83, 0.6)",
  };

  // Card Style with Hover Effect, Smooth Shadow and Gradient
  const cardStyle = {
    backgroundColor: "#222222",
    borderRadius: "12px",
    padding: "20px 25px",
    marginBottom: "20px",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
    transition: "transform 0.4s ease, box-shadow 0.4s ease",
    backgroundImage: "linear-gradient(145deg, #333, #212121)",
  };

  const hoverCardStyle = {
    ":hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.5)",
      background: "linear-gradient(145deg, #444, #333)",
    },
  };

  // Label Style with Neon Glow and Smooth Transition
  const labelStyle = {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#b2ff59",
    textTransform: "uppercase",
    letterSpacing: "1px",
    textShadow: "0 0 6px rgba(178, 255, 89, 0.6)",
    transition: "color 0.3s ease, text-shadow 0.3s ease",
  };

  // Value Style with Subtle Light Text and Padding for Clarity
  const valueStyle = {
    fontSize: "1rem",
    fontWeight: "500",
    color: "#e0e0e0",
    paddingLeft: "10px",
    transition: "color 0.3s ease",
  };

  // Locked and Fixed Status Styles with Glowing Effects
  const lockedStyle = {
    color: "#ff1744",
    fontWeight: "600",
    textShadow: "0 0 8px rgba(255, 23, 68, 0.6)",
  };

  const fixedStyle = {
    color: "#ff9800",
    fontWeight: "600",
    textShadow: "0 0 8px rgba(255, 152, 0, 0.6)",
  };
