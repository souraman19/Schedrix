import TaskDetailsPageDynamicPart from "@/components/task/TaskDetailsPageDynamicPart";
import TaskDetailsPageStaticPart from "@/components/task/TaskDetailsPageStaticPart";
import React, { Suspense } from "react";

export const experimantal_ppr = "true";

export default async function Task({params}: {params: Promise<{_id: string}>}) {
  const _id = (await params)._id;

  return (
    <div className="space-y-6">
      {/* Static part */}
      <div className=" rounded-lg shadow-lg p-3">
        <TaskDetailsPageStaticPart _id={_id} />
      </div>

      {/* Dynamic part */}
      <Suspense fallback={<div>Loading...</div>}>
        <div className="rounded-lg shadow-lg p-6">
          <TaskDetailsPageDynamicPart _id={_id} />
        </div>
      </Suspense>
    </div>
  );
}
