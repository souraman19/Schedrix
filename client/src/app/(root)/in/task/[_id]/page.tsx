import TaskDetailsPageDynamicPart from "@/components/task/TaskDetailsPageDynamicPart";
import TaskDetailsPageStaticPart from "@/components/task/TaskDetailsPageStaticPart";
import React, { Suspense } from "react";

export const experimantal_ppr = "true";


export default async function Task({params}: {params:Promise <{_id: string}>}){
    const _id = (await params)._id;
    


    return (
        <>
            <div>
                <TaskDetailsPageStaticPart _id={_id}/>
            </div>
            <Suspense >
                <TaskDetailsPageDynamicPart _id={_id}/>
            </Suspense>
        </>
    );
}