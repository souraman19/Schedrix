import React from "react";
import { cookies } from "next/headers";
import { GET_TASK_DYNAMIC_DETAILS_ROUTE } from "@/lib/apiRoutes";

export default async function TaskDetailsPageDynamicPart({ _id }: { _id: string }) {
  type TaskType = {
    _id: string;
    status: string;
    totalPointsContributed: number;
    pointsContributed: {
      day: Date;
      points: number;
    }[];
    userOutput: {
      text: string;
    };
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

  return (
    <div className="text-white p-4 space-y-4">
      <p><strong>Status:</strong> {taskData?.status}</p>
      <p><strong>Total Points Contributed:</strong> {taskData?.totalPointsContributed}</p>

      <h2 className="text-lg font-semibold">Points Contributed:</h2>
      <ul>
        {taskData?.pointsContributed.map((point, index) => (
          <li key={index}>
            <strong>{new Date(point.day).toLocaleDateString()}:</strong> {point.points} points
          </li>
        ))}
      </ul>

      <h2 className="text-lg font-semibold">User Output:</h2>
      <p><strong>Text:</strong> {taskData?.userOutput.text || "No user input provided."}</p>
    </div>
  );
}
