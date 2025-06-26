"use client";

import React, { useCallback } from "react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import {
  UPDATE_USER_LAST_ACTIVE_DAY_ROUTE,
  UPDATE_USER_LAST_MIND_STATUS_ASK_DAY_ROUTE,
  USER_INFO_ROUTE,
} from "./apiRoutes";
import axios from "axios";

const MIND_STATUSES = [
  "Focused",
  "Distracted",
  "Tired",
  "Stressed",
  "Motivated",
  "Default",
];

export const isSameDate = (d1: Date, d2: Date): boolean => {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

export default function AskMindStatusModal() {
  const { setUser, user } = useUserStore(); // Get the Zustand store state
  const [currentMindStatus, setCurrentMindStatus] = React.useState<
    string | null
  >(user?.mindStatus || "Default");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const router = useRouter();

  const fetchUserInfo = useCallback(async () => {
    // toast("Fetching user info...");
    try {
      const response = await axios.get(`${USER_INFO_ROUTE}`, {
        withCredentials: true,
      });
      // console.log('User data:', response.data);
      setUser(response.data); // Set the user info in the Zustand store
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        // console.log("User not authenticated");
        router.push("/"); // Redirect to the login page
      } else {
        console.error("Error fetching user data:", error);
      }
    }
  }, [setUser, router]);

  const checkUserActivenessData = useCallback(async () => {
    // toast("Checking your activeness...");
    const lastActiveDayFromZustand = user?.lastActiveDay ?? null;
    // const lastMindStatusAskedDayFromZustand =
    //   user?.lastDateAskedMindStatus ?? null;
    if (lastActiveDayFromZustand !== null) {
      const currentDate = new Date();
      const formattedLastActiveDayFromZustand = new Date(
        lastActiveDayFromZustand
      );
      if (isSameDate(formattedLastActiveDayFromZustand, currentDate)) {
        // toast.success("You have been active today!");
        return; // User is active today, no need to fetch data again
      }
    }

    //update the user activeness data in database
    try {
      const response = await fetch(UPDATE_USER_LAST_ACTIVE_DAY_ROUTE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lastActiveDay: new Date().toISOString(),
        }),
        credentials: "include",
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.user);
      } else {
        const errorData = await response.json();
        // console.error("Error updating last active day: ", errorData);
        toast.error("Error updating last active day: " + errorData.message);
      }
    } catch (err) {
      console.error("Error updating last active day: ", err);
      toast.error("Error updating last active day: " + err);
    }
  }, [user, setUser]);

  const checkUserMindStatusAskedData = useCallback(async () => {
    // toast("Checking if you have been asked about your mind status today...");
    const lastMindStatusAskedDayFromZustand =
      user?.lastDateAskedMindStatus ?? null;
    // console.log( "Last mind status asked day from Zustand:", user);

    if (lastMindStatusAskedDayFromZustand !== null) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 1);
      const formattedLastMindStatusAskedDayFromZustand = new Date(
        lastMindStatusAskedDayFromZustand
      );
      const activeDaysCount = user?.activeDaysCount ?? 0;

      if (isSameDate(formattedLastMindStatusAskedDayFromZustand, currentDate)) {
        // toast.success("You have been asked about your mind status today!");
        return; // User has been asked today, no need to fetch data again
      }

      // toast.success("Asking about your mind status...");
      if (activeDaysCount < 30) {
        setIsModalOpen(true); //ask mindastatus if active days count is less than 30
      } else {
        const today = new Date();
        const lastDateAskedMindStatusFormatted = new Date(
          lastMindStatusAskedDayFromZustand
        );

        const date1 = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        const date2 = new Date(
          lastDateAskedMindStatusFormatted.getFullYear(),
          lastDateAskedMindStatusFormatted.getMonth(),
          lastDateAskedMindStatusFormatted.getDate()
        );

        const msPerDay = 24 * 60 * 60 * 1000; // milliseconds in a day
        const diffInMs = date1.getTime() - date2.getTime();
        const diffInDays = Math.floor(diffInMs / msPerDay);

        if (diffInDays > 3) {
          setIsModalOpen(true); //ask mindastatus if last date asked mind status is more than 3 days ago
        }
      }
    } else {
      //if last mind status asked day is null, it means user has never been asked before
      setIsModalOpen(true);
    }
  }, [user]);

  useEffect(() => {
    const init = async () => {
      await fetchUserInfo(); //wait until user info is fetched
    };
    init();
  }, [fetchUserInfo]);

  useEffect(() => {
    if (user) {
      (async () => {
        await checkUserActivenessData();
        await checkUserMindStatusAskedData();
      })();
    }
  }, [user, checkUserActivenessData, checkUserMindStatusAskedData]);

  const handleMindStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMindStatus) {
      toast.error("Please select a mind status before submitting.");
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    //update the last mind status ask day in database
    try {
      const response = await fetch(UPDATE_USER_LAST_MIND_STATUS_ASK_DAY_ROUTE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lastDateAskedMindStatus: yesterday.toISOString(),
          mindStatus: currentMindStatus,
        }),
        credentials: "include",
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.user);
        // console.log(
        //   "Last mind status ask day updated successfully:",
        //   updatedUser
        // );
        setIsModalOpen(false); // Close the modal after successful submission
        toast.success("Last mind status ask day updated successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error updating last mind status ask day: ", errorData);
        toast.error(
          "Error updating last mind status ask day: " + errorData.message
        );
      }
    } catch (err) {
      console.error("Error updating last mind status ask day: ", err);
      toast.error("Error updating last mind status ask day: " + err);
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-zinc-900 text-white p-6 rounded-2xl w-[90%] max-w-md shadow-lg border border-zinc-700">
            <h2 className="text-xl font-semibold mb-4">
              How were you feeling yesterday?
            </h2>

            <form onSubmit={handleMindStatusSubmit} className="space-y-4">
              {MIND_STATUSES.map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="radio"
                    name="mindStatus"
                    value={status}
                    checked={currentMindStatus === status}
                    onChange={() => setCurrentMindStatus(status)}
                    className="accent-green-500"
                  />
                  <span>{status}</span>
                </label>
              ))}

              <button
                type="submit"
                className="cursor-pointer mt-4 w-full bg-gradient-to-r from-green-600 to-lime-400 text-black font-semibold py-2 rounded-full shadow-md hover:shadow-green-500/30 transition"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
