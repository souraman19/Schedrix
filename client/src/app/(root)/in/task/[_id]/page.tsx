import LinkForMasterTask from "@/components/task/LinkForMasterTask";
import RepeatInfo from "@/components/task/RepeatInfo";
import TaskDetailsPageDynamicPart from "@/components/task/TaskDetailsPageDynamicPart";
import TaskDetailsPageStaticPart from "@/components/task/TaskDetailsPageStaticPart";
import TaskActions from "@/components/task/TaskActions";
import { Button } from "@mui/material";
import React, { Suspense } from "react";

export const experimantal_ppr = "true";

export default async function Task({params}: {params: Promise<{_id: string}>}) {
  const _id = (await params)._id;

  return (
    <div className="space-y-6">
      {/* Static part */}
      <div className=" rounded-lg shadow-lg">
        <TaskDetailsPageStaticPart _id={_id} />
      </div>
      <div className=" rounded-lg shadow-lg">
        <LinkForMasterTask _id={_id} />
      </div>

      <div className=" rounded-lg shadow-lg">
        <RepeatInfo _id={_id} />
      </div>

      {/* Dynamic part */}
      <Suspense fallback={<div>Loading...</div>}>
        <div className="rounded-lg shadow-lg p-3">
          <TaskDetailsPageDynamicPart _id={_id} />
        </div>
      </Suspense>
      
      <div>
        <TaskActions _id={_id} />
      </div>
    </div>
  );
}
