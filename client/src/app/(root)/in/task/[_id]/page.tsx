const exp = true;
export { exp as experimental_ppr };


import LinkForMasterTask from "@/components/task/LinkForMasterTask";
import RepeatInfo from "@/components/task/RepeatInfo";
import TaskDetailsPageDynamicPart from "@/components/task/TaskDetailsPageDynamicPart";
import TaskDetailsPageStaticPart from "@/components/task/TaskDetailsPageStaticPart";
import TaskActions from "@/components/task/TaskActions";
import React, { Suspense } from "react";
import AddTaskButton from "@/components/ui/AddTaskButton";

export default async function Task({
  params,
}: {
  params: Promise<{ _id: string }>;
}) {
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
      <Suspense
        fallback={
          <div
  className="mx-auto max-w-3xl mt-10 p-8 rounded-2xl shadow-2xl bg-[#0d0d0d] border border-green-800 animate-pulse text-center text-green-200"
  style={{
    boxShadow: "0 0 30px rgba(0, 255, 128, 0.2)",
    fontFamily: "Inter, system-ui, sans-serif",
  }}
>
  <h2 className="text-2xl font-semibold text-lime-400 tracking-wide mb-2">
    Loading Task Details...
  </h2>
  <p className="text-sm text-green-400 mb-6">
    Hold tight while we gather your task data.
  </p>

  <div className="space-y-4">
    <div className="h-5 w-3/4 mx-auto bg-green-950 rounded" />
    <div className="h-5 w-2/3 mx-auto bg-green-950 rounded" />
    <div className="h-5 w-5/6 mx-auto bg-green-950 rounded" />
    <div className="h-5 w-1/2 mx-auto bg-green-950 rounded" />
  </div>
</div>

        }
      >
        <div className="rounded-lg shadow-lg p-3">
          <TaskDetailsPageDynamicPart _id={_id} />
        </div>
      </Suspense>

      <div>
        <TaskActions _id={_id} />
      </div>
      <div className="fixed bottom-9 right-8">
        <AddTaskButton />
      </div>
    </div>
  );
}
