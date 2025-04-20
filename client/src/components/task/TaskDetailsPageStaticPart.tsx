import React from "react";
import { cookies } from "next/headers";
import { GET_TASK_STATIC_DETAILS_ROUTE } from "@/lib/apiRoutes";
import { formatDate } from "@/lib/utils";

export default async function TaskDetailsPageStaticPart({ _id }: { _id: string }) {
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
  };

  let taskData: TaskType | null = null;

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("connect.sid");
    const response: Response = await fetch(`${GET_TASK_STATIC_DETAILS_ROUTE}/${_id}`, {
      method: "GET",
      headers: {
        Cookie: `${sessionCookie?.name}=${sessionCookie?.value}`,
      },
      cache: "no-store",
    });
    const result = await response.json();
    taskData = result.task;
  } catch (err) {
    console.error("Error fetching task details:", err);
  }

  // Container Style with a dark gradient and soft shadows
  const containerStyle = {
    background: "linear-gradient(135deg, #121212, #111)",
    color: "white",
    padding: "40px",
    paddingTop: "0px",
    paddingBottom: "0px",
    borderRadius: "20px",
    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.4)",
    maxWidth: "800px",
    margin: "40px auto",
    animation: "fadeIn 1.5s ease-out",
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

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Task Details</h2>
      <div>
        {taskData?.title && (
          <div style={{ ...cardStyle, ...hoverCardStyle }}>
            <div className="flex justify-between">
              <p style={labelStyle}>Title:</p>
              <p style={valueStyle}>{taskData?.title}</p>
            </div>
          </div>
        )}

        {taskData?.category && (
          <div style={{ ...cardStyle, ...hoverCardStyle }}>
            <div className="flex justify-between">
              <p style={labelStyle}>Category:</p>
              <p style={valueStyle}>{taskData?.category}</p>
            </div>
          </div>
        )}

        {taskData?.priority && (
          <div style={{ ...cardStyle, ...hoverCardStyle }}>
            <div className="flex justify-between">
              <p style={labelStyle}>Priority:</p>
              <p style={valueStyle}>{taskData?.priority}</p>
            </div>
          </div>
        )}

        {taskData?.duration && (
          <div style={{ ...cardStyle, ...hoverCardStyle }}>
            <div className="flex justify-between">
              <p style={labelStyle}>Duration:</p>
              <p style={valueStyle}>{taskData?.duration} hr</p>
            </div>
          </div>
        )}

        {taskData?.startTime && (
          <div style={{ ...cardStyle, ...hoverCardStyle }}>
            <div className="flex justify-between">
              <p style={labelStyle}>Start Time:</p>
              <p style={valueStyle}>{taskData?.startTime.toLocaleString()}</p>
            </div>
          </div>
        )}

        {taskData?.endTime && (
          <div style={{ ...cardStyle, ...hoverCardStyle }}>
            <div className="flex justify-between">
              <p style={labelStyle}>End Time:</p>
              <p style={valueStyle}>{taskData?.endTime.toLocaleString()}</p>
            </div>
          </div>
        )}

        {taskData?.isLocked !== undefined && (
          <div style={{ ...cardStyle, ...hoverCardStyle }}>
            <div className="flex justify-between">
              <p style={labelStyle}>Is Locked:</p>
              <p style={{ ...valueStyle, ...lockedStyle }}>
                {taskData?.isLocked ? "Yes" : "No"}
              </p>
            </div>
          </div>
        )}

        {taskData?.isFixed !== undefined && (
          <div style={{ ...cardStyle, ...hoverCardStyle }}>
            <div className="flex justify-between">
              <p style={labelStyle}>Is Fixed:</p>
              <p style={{ ...valueStyle, ...fixedStyle }}>
                {taskData?.isFixed ? "Yes" : "No"}
              </p>
            </div>
          </div>
        )}

        {taskData?.userInput?.text && (
          <div style={{ ...cardStyle, ...hoverCardStyle }}>
            <div className="flex justify-between">
              <p style={labelStyle}>User Input (text):</p>
              <p style={valueStyle}>{taskData?.userInput?.text}</p>
            </div>
          </div>
        )}

        {taskData?.createdAt && (
          <div style={{ ...cardStyle, ...hoverCardStyle }}>
            <div className="flex justify-between">
              <p style={labelStyle}>Created At:</p>
              <p style={valueStyle}>{formatDate(taskData?.createdAt)}</p>
            </div>
          </div>
        )}

        {taskData?.updatedAt && (
          <div style={{ ...cardStyle, ...hoverCardStyle }}>
            <div className="flex justify-between">
              <p style={labelStyle}>Updated At:</p>
              <p style={valueStyle}>{formatDate(taskData?.updatedAt)}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
