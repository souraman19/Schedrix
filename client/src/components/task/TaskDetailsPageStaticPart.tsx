import { GET_TASK_STATIC_DETAILS_ROUTE } from "@/lib/apiRoutes";
import React from "react";
import { cookies } from "next/headers";
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

    let taskData : TaskType | null = null;
    

        try{
            const cookieStore = await cookies(); 
            const sessionCookie = cookieStore.get("connect.sid");
            const response : Response = await fetch(`${GET_TASK_STATIC_DETAILS_ROUTE}/${_id}`, {
                method: "GET",
                headers:{
                    Cookie: `${sessionCookie?.name}=${sessionCookie?.value}`,
                },
                cache: "no-store",
            });
            const result = await response.json();
            // console.log("Response from server:", result);
            taskData = result.task;

        }catch(err){
            console.error("Error fetching task details:", err);
        }


    return (
        <div className="text-white p-4 space-y-2">
        <h1 className="text-xl font-bold">Task Details</h1>
        <p><strong>ID:</strong> {taskData?._id}</p>
        <p><strong>Title:</strong> {taskData?.title}</p>
        <p><strong>Category:</strong> {taskData?.category}</p>
        <p><strong>Priority:</strong> {taskData?.priority}</p>
        <p><strong>Duration:</strong> {taskData?.duration} hr</p>
        <p><strong>Start Time:</strong> {taskData?.startTime.toLocaleString()}</p>
        <p><strong>End Time:</strong> {taskData?.endTime.toLocaleString()}</p>
        <p><strong>Is Locked:</strong> {taskData?.isLocked ? "Yes" : "No"}</p>
        <p><strong>Is Fixed:</strong> {taskData?.isFixed ? "Yes" : "No"}</p>
        <p><strong>User Input (text):</strong> {taskData?.userInput?.text || "N/A"}</p>
        <p><strong>Created At:</strong> {formatDate(taskData?.createdAt)}</p>
        <p><strong>Updated At:</strong> {formatDate(taskData?.updatedAt)}</p>
      </div>
    );
}