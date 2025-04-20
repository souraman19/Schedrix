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

  return (
    <div className="bg-[#111] text-white p-8 rounded-lg shadow-xl max-w-3xl mx-auto">
      <div className="space-y-6">
        <div className="flex justify-between">
          <p className="text-lg font-semibold">Title:</p>
          <p className="text-lg">{taskData?.title}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-lg font-semibold">Category:</p>
          <p className="text-lg">{taskData?.category}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-lg font-semibold">Priority:</p>
          <p className="text-lg">{taskData?.priority}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-lg font-semibold">Duration:</p>
          <p className="text-lg">{taskData?.duration} hr</p>
        </div>

        <div className="flex justify-between">
          <p className="text-lg font-semibold">Start Time:</p>
          <p className="text-lg">{taskData?.startTime.toLocaleString()}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-lg font-semibold">End Time:</p>
          <p className="text-lg">{taskData?.endTime.toLocaleString()}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-lg font-semibold">Is Locked:</p>
          <p className="text-lg">{taskData?.isLocked ? "Yes" : "No"}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-lg font-semibold">Is Fixed:</p>
          <p className="text-lg">{taskData?.isFixed ? "Yes" : "No"}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-lg font-semibold">User Input (text):</p>
          <p className="text-lg">{taskData?.userInput?.text || "N/A"}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-lg font-semibold">Created At:</p>
          <p className="text-lg">{formatDate(taskData?.createdAt)}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-lg font-semibold">Updated At:</p>
          <p className="text-lg">{formatDate(taskData?.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
}
