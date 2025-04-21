"use client";

import { GET_USER_PROFILE_ROUTE } from "@/lib/apiRoutes";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfileAnalytics() {


    const [userAnalysisData, setUserAnalysisData] = useState(null);

    const getProfileAnalytics = async () => {
        try{
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
        }catch(err: any){
            console.log("Error fetching profile analytics: ", err);
            toast.error("Error fetching profile analytics: ", err);
        }
    }

    useEffect(() => {
        getProfileAnalytics();
    }, []);

    return (
        <>
            <div>
                <h3 className="text-xl font-semibold mb-2 text-green-500">
                    Profile Analytics
                </h3>
                {userAnalysisData && (
                    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                        <p className="text-white">points: {userAnalysisData.progress.points}</p>
                        <p className="text-white">comleted tasks: {userAnalysisData.progress.completedTasks}</p>
                        <p className="text-white">total tasks: {userAnalysisData.progress.totalTasks}</p>
                        <p className="text-white">overdue: {userAnalysisData.progress.overDueTasks}</p>
                        <p className="text-white">mind status: {userAnalysisData.mindStatus}</p>
                    </div>
                )}
            </div>
        </>
    );
}