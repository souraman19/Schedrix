'use client';


import LinkForMasterTask from "@/components/task/LinkForMasterTask";
import RepeatInfo from "@/components/task/RepeatInfo";
import TaskDetailsPageDynamicPart from "@/components/task/TaskDetailsPageDynamicPart";
import TaskDetailsPageStaticPart from "@/components/task/TaskDetailsPageStaticPart";
import TaskActions from "@/components/task/TaskActions";
import React from "react";
import AddTaskButton from "@/components/ui/AddTaskButton";

export default async function Task({
  params,
}: {
  params: Promise<{ _id: string }>;
}) {
  const _id = (await params)._id;

  return (
    <div className="space-y-6">
      <div className=" rounded-lg shadow-lg">
        <TaskDetailsPageStaticPart _id={_id} />
      </div>
      <div className=" rounded-lg shadow-lg">
        <LinkForMasterTask _id={_id} />
      </div>

      <div className=" rounded-lg shadow-lg">
        <RepeatInfo _id={_id} />
      </div>

    
        <div className="rounded-lg shadow-lg p-3">
          <TaskDetailsPageDynamicPart _id={_id} />
        </div>

      <div>
        <TaskActions _id={_id} />
      </div>
      <div className="fixed bottom-9 right-8">
        <AddTaskButton />
      </div>
    </div>
  );
}
