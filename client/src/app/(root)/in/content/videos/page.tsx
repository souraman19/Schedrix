'use client';

import { GET_MOTIVATIONAL_VIDEOS_ROUTE, USER_INFO_ROUTE } from "@/lib/apiRoutes";
import { useUserStore } from "@/store/useUserStore";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function VideosPage() {
    const [videoItems, setVideoItems] = useState([]);
      const [mindStatus, setMindStatus] = useState("Default");
      const { user, setUser } = useUserStore();
    const router = useRouter();

      const fetchMindStatus = async () => {
    if (user && user.mindStatus) {
      setMindStatus(user.mindStatus);
      toast.success("Mind status already set");
      return;
    }
    try {
      const response = await axios.get(`${USER_INFO_ROUTE}`, {
        withCredentials: true,
      });
      console.log("User data:", response.data);
      setUser(response.data); // Set the user info in the Zustand store
      setMindStatus(response.data.mindStatus || "Default");
      toast.success("Mind status fetched successfully");
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        console.log("User not authenticated");
        router.push("/"); // Redirect to the login page
      } else {
        console.error("Error fetching user data:", error);
      }
    }
  };


    const loadMore = async () => {
      try {
  
        const response = await fetch(
          `${GET_MOTIVATIONAL_VIDEOS_ROUTE}?mindStatus=${mindStatus}}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          const newVideoItems = data.videos;
          setVideoItems((prevVideoItems) => [...prevVideoItems, ...newVideoItems]);
          toast.success("videos fetched successfully");
        } else {
          console.error("Failed to fetch videos:", response.statusText);
          toast.error("Failed to fetch video");
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
        toast.error("Failed to fetch videos");
      }
    };
  
    useEffect(() => {
      const init = async () => {
          await fetchMindStatus();
          await loadMore();
      }
      init();
    }, []);
    

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-4">Motivational Videos</h1>
      { videoItems.length > 0 && (videoItems.map((videoItem, index) => (
        <div>
            {videoItem.link}
        </div>
      )))}
    </div>
  );
}