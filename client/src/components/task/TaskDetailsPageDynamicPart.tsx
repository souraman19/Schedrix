import React from "react";
import { cookies } from "next/headers";
import { GET_TASK_DYNAMIC_DETAILS_ROUTE } from "@/lib/apiRoutes";
import { FaCheckCircle, FaTimesCircle, FaClock, FaUserAlt, FaCoins, FaExclamationTriangle } from "react-icons/fa";

export default async function TaskDetailsPageDynamicPart({ _id }: { _id: string }) {
  type TaskType = {
    _id: string;
    status?: string;
    totalPointsContributed?: number;
    pointsContributed?: {
      day: Date;
      points: number;
    }[];
    userOutput?: {
      text?: string;
    };
    deadline?: Date;
  };

  let taskData: TaskType | null = null;

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("connect.sid");
    const response: Response = await fetch(`${GET_TASK_DYNAMIC_DETAILS_ROUTE}/${_id}`, {
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

  const isDeadlinePassed = taskData?.deadline && new Date(taskData.deadline) < new Date();
  const isNegativePoints = taskData?.totalPointsContributed && taskData.totalPointsContributed < 0;

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "3rem auto",
        padding: "2.5rem",
        marginTop: "0px",
        marginBottom: "0px",
        background: "linear-gradient(145deg, #0d0d0d, #1a1a1a)",
        borderRadius: "1.5rem",
        boxShadow: "0 0 30px rgba(0, 255, 128, 0.25)",
        color: "#e0ffe0",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: "1rem",
        lineHeight: 1.75,
      }}
    >
      {taskData?.status && (
        <div style={{ marginBottom: "1.5rem" }}>
          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              background: "linear-gradient(to right, #00e676, #b2ff59)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "0.25rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaCheckCircle
              style={{
                color: isDeadlinePassed || isNegativePoints ? "#f44336" : "#76ff03",
                marginRight: "0.5rem",
              }}
            />
            Status
          </h3>
          <div
            style={{
              background: "#121212",
              padding: "1rem 1.25rem",
              borderRadius: "0.75rem",
              boxShadow: "0 0 12px rgba(0, 255, 128, 0.1)",
              fontWeight: 500,
              color: isDeadlinePassed || isNegativePoints ? "#f44336" : "#76ff03",
            }}
          >
            {taskData.status}
          </div>
        </div>
      )}

      {taskData?.deadline && (
        <div style={{ marginBottom: "1.5rem" }}>
          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              background: "linear-gradient(to right, #00e676, #b2ff59)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "0.25rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaExclamationTriangle
              style={{
                color: isDeadlinePassed ? "#f44336" : "#76ff03",
                marginRight: "0.5rem",
              }}
            />
            Deadline
          </h3>
          <div
            style={{
              background: "#121212",
              padding: "1rem 1.25rem",
              borderRadius: "0.75rem",
              boxShadow: "0 0 12px rgba(0, 255, 128, 0.1)",
              fontWeight: 500,
              color: isDeadlinePassed ? "#f44336" : "#76ff03",
            }}
          >
            {new Date(taskData.deadline).toLocaleString()}
          </div>
        </div>
      )}

      {typeof taskData?.totalPointsContributed === "number" && (
        <div style={{ marginBottom: "2rem" }}>
          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              background: "linear-gradient(to right, #00e676, #b2ff59)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "0.25rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaCoins
              style={{
                color: isNegativePoints ? "#f44336" : "#76ff03",
                marginRight: "0.5rem",
              }}
            />
            Total Points Contributed
          </h3>
          <div
            style={{
              background: "#121212",
              padding: "1rem 1.25rem",
              borderRadius: "0.75rem",
              boxShadow: "0 0 12px rgba(0, 255, 128, 0.1)",
              fontWeight: 600,
              color: isNegativePoints ? "#f44336" : "#76ff03",
            }}
          >
            {taskData.totalPointsContributed}
          </div>
        </div>
      )}

      {taskData?.pointsContributed?.length > 0 && (
        <>
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#b2ff59",
              marginBottom: "0.75rem",
              textShadow: "0 0 10px #00c85366",
            }}
          >
            Points Contributed
          </h3>

          <ul style={{ listStyle: "none", padding: 0, marginBottom: "2rem" }}>
            {taskData.pointsContributed.map((point, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.85rem 1.25rem",
                  marginBottom: "0.6rem",
                  background: "linear-gradient(145deg, #101010, #1a1a1a)",
                  borderRadius: "0.75rem",
                  boxShadow: "0 0 12px rgba(0, 255, 128, 0.1)",
                  fontWeight: 500,
                }}
              >
                <span>{new Date(point.day).toLocaleDateString()}</span>
                <span
                  style={{
                    color: point.points < 0 ? "#f44336" : "#76ff03",
                    fontWeight: 600,
                  }}
                >
                  <FaCoins style={{ marginRight: "0.25rem" }} />
                  {point.points} pts
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

      {taskData?.userOutput?.text && (
        <>
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#b2ff59",
              marginBottom: "0.75rem",
              textShadow: "0 0 10px #00c85366",
            }}
          >
            User Output
          </h3>

          <div
            style={{
              backgroundColor: "#141414",
              padding: "1.25rem 1.5rem",
              borderRadius: "1rem",
              boxShadow: "inset 0 0 25px rgba(0, 255, 128, 0.25)",
              fontWeight: 400,
              fontSize: "1rem",
              color: "#ccffcc",
              whiteSpace: "pre-wrap",
              lineHeight: 1.8,
            }}
          >
            {taskData.userOutput.text}
          </div>
        </>
      )}
    </div>
  );
}
