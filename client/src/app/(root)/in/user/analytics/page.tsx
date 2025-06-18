"use client";

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { GET_USER_POINTS_ANALYTICS_ROUTE } from "@/lib/apiRoutes";
import { toast } from "sonner";
import PointsGrid from "@/components/user/PointsGrid";
import ProfileAnalytics from "@/components/user/ProfileAnalytics";

export default function UserAnalyticsPage() {
  const { user, setUser } = useUserStore();
  const _id = user?._id;

  const [pointsData, setPointsData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchPointAnalytics = async () => {
    try {
      const response = await fetch(GET_USER_POINTS_ANALYTICS_ROUTE, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 200) {
        const data = await response.json();
        // console.log("Point Analytics: ", data.points);
        setPointsData(data.points);
        toast.success("Fetched point analytics successfully!");
      }
    } catch (error: any) {
      toast.error("Error fetching point analytics: ", error);
      console.error("Error fetching point analytics: ", error);
    }
  };

  useEffect(() => {
    fetchPointAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-black text-white p-8">
      <div className="max-w-7xl mx-auto p-6 rounded-lg shadow-lg bg-opacity-70">
        {pointsData && (
          <div>
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2 text-green-500">
               Points Gained ({year})
                </h3>
                <PointsGrid pointsData={pointsData} year={year} ifGain={true} />
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2 text-red-500">
                  Points Lost ({year})
                </h3>
                <PointsGrid pointsData={pointsData} year={year} ifGain={false} />
              </div>
            </div>
          </div>
        )}
        <div>
            <div>
                <ProfileAnalytics />
            </div>
        </div>

      </div>
    </div>
  );
}
