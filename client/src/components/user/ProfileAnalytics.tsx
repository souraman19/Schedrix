"use client";

import {
  EDIT_MIND_STATUS_ROUTE,
  GET_USER_MIND_STATUS_ROUTE,
  GET_USER_PROFILE_ROUTE,
} from "@/lib/apiRoutes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import TaskProgress from "../task/TaskProgress";
import PointProgress from "../task/PointProgress";
import { getMindStatusIcon } from "../../utils/icons";


const mindStatusOptions = [
  "Focused",
  "Distracted",
  "Tired",
  "Stressed",
  "Motivated",
  "Default",
];


export default function ProfileAnalytics() {
  const [userAnalysisData, setUserAnalysisData] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("Default");

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

  const getMindStatus = async () => {
    try {
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
        setSelectedStatus(data.mindStatus);
        toast.success("Fetched mind status successfully!");
      }
    } catch (err: any) {
      console.log("Error fetching mind status: ", err);
      toast.error("Error fetching mind status: ", err);
    }
  };

  const handleMindStatusSubmit = async () => {
    try{
      const response = await fetch(EDIT_MIND_STATUS_ROUTE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mindStatus: selectedStatus,
        }),
        credentials: "include",
      })
      console.log("Response: ", response);
      if(response.ok){
        console.log("Mind status updated successfully");
        toast.success("Mind status updated successfully!");
        setUserAnalysisData((prevData: any) => ({
          ...prevData,
          mindStatus: selectedStatus,
        }));
      } else {
        console.error("Failed to update mind status: ", response.statusText);
        toast.error("Failed to update mind status.");
      }
    }catch(err: any) {
      console.error("Error submitting mind status: ", err);
      toast.error("Error submitting mind status.");
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
          <div>
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
            </div>

            <div className="flex items-center justify-center mt-6">
  <div className="relative w-full max-w-md p-6 rounded-2xl bg-gradient-to-br from-[#0f0f0f] via-[#111111] to-[#0c0c0c] backdrop-blur-lg border border-green-700 shadow-[0_0_60px_#00c85333] overflow-hidden group transition-all duration-500 hover:shadow-[0_0_90px_#00e67677] hover:scale-[1.02]">

    {/* Aura glow layer */}
    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#00c853] to-[#b2ff59] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-700 animate-[pulse_3.5s_ease-in-out_infinite] pointer-events-none" />

    <div className="relative z-10 flex flex-col items-center gap-5">
      <div className="text-6xl text-green-400 drop-shadow-[0_0_20px_#00e676] animate-[pulse_3.5s_ease-in-out_infinite]">
        {getMindStatusIcon(selectedStatus)}
      </div>

      <span className="px-6 py-2 text-lg font-semibold uppercase tracking-wider rounded-full bg-green-900 text-green-200 shadow-inner shadow-green-700/60 ring-1 ring-green-600 hover:bg-green-800 transition-all duration-300">
        {/* Dropdown selection */}
      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className=" border-0 text-green-300 p-2 rounded-xl text-lg"
      >
        {mindStatusOptions.map((status) => (
          <option key={status} value={status} className="bg-green-900 text-green-200 hover:bg-green-800">
            {status}
          </option>
        ))}
      </select>
      </span>

      {/* Submit button (show only if changed) */}
      {selectedStatus !== userAnalysisData.mindStatus && (
        <button
          onClick={handleMindStatusSubmit}
          className="cursor-pointer bg-green-600 hover:bg-green-500 text-black px-4 py-2 rounded-full font-semibold shadow-lg"
        >
          Submit
        </button>
      )}

      <p className="text-sm text-green-100/80 italic tracking-wide text-center max-w-xs">
        Your mind state for today
      </p>
    </div>
  </div>
</div>

          </div>
        )}
      </div>
    </>
  );
}
