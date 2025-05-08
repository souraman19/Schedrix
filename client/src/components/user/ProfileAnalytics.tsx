"use client";

import { GET_USER_MIND_STATUS_ROUTE, GET_USER_PROFILE_ROUTE } from "@/lib/apiRoutes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import TaskProgress from "../task/TaskProgress";
import PointProgress from "../task/PointProgress";
import { getMindStatusIcon } from "../../utils/icons";

export default function ProfileAnalytics() {
  const [userAnalysisData, setUserAnalysisData] = useState(null);

  const getProfileAnalytics = async () => {
    try {
      const response = await fetch(GET_USER_PROFILE_ROUTE, {
        method: "GET",
        credentials: "include",
      });
      if (response.status === 200) {
        const data = await response.json();
        console.log("Profile Analytics: ", data.user);
        setUserAnalysisData(data.user);
        toast.success("Fetched profile analytics successfully!");
      }
    } catch (err: any) {
      console.log("Error fetching profile analytics: ", err);
      toast.error("Error fetching profile analytics: ", err);
    }
  };

  const getMindStatus = async() => {
    try{
      const response = await fetch(GET_USER_MIND_STATUS_ROUTE, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log("Mind Status: ", data.mindStatus);
        setUserAnalysisData((prevData: any) => ({
          ...prevData,
          mindStatus: data.mindStatus,
        }));
        toast.success("Fetched mind status successfully!");
      }
    }catch(err: any){
      console.log("Error fetching mind status: ", err);
      toast.error("Error fetching mind status: ", err);
    }
  }

  useEffect(() => {
    getProfileAnalytics();
  }, []);
  useEffect(() => {
    getMindStatus();
  }, []);


  return (
    <>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-green-500">
          Profile Analytics
        </h3>
        {userAnalysisData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg shadow-md">
              <TaskProgress
                completed={userAnalysisData.progress.completedTasks}
                overdue={userAnalysisData.progress.overdueTasks}
                pending={
                  userAnalysisData.progress.totalTasks -
                  userAnalysisData.progress.overdueTasks -
                  userAnalysisData.progress.completedTasks
                }
                total={userAnalysisData.progress.totalTasks}
              />
            </div>

            <div className=" p-4 rounded-lg shadow-md">
              <PointProgress
                pointsGained={userAnalysisData.progress.pointsGained}
                pointsLost={
                  userAnalysisData.progress.points -
                  userAnalysisData.progress.pointsGained
                }
                total={userAnalysisData.progress.points}
              />
            </div>

            <div className="flex items-center gap-2 mt-4">
              {getMindStatusIcon(userAnalysisData.mindStatus)}
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-900 text-green-300">
                {userAnalysisData.mindStatus}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
