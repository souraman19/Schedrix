"use client";

import { GET_MOTIVATIONAL_VIDEOS_ROUTE, USER_INFO_ROUTE } from "@/lib/apiRoutes";
import { useUserStore } from "@/store/useUserStore";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function VideosPage() {
  const [videoItems, setVideoItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mindStatus, setMindStatus] = useState("Default");
  const { user, setUser } = useUserStore();
  const router = useRouter();

  const NAVBAR_HEIGHT = 64; // Adjust if your navbar is taller or shorter

  const fetchMindStatus = async () => {
    if (user?.mindStatus) {
      setMindStatus(user.mindStatus);
      return;
    }
    try {
      const response = await axios.get(USER_INFO_ROUTE, { withCredentials: true });
      setUser(response.data);
      setMindStatus(response.data.mindStatus || "Default");
    } catch (error: any) {
      if (error.response?.status === 401) router.push("/");
    }
  };

  const loadVideos = async () => {
    try {
      const response = await fetch(`${GET_MOTIVATIONAL_VIDEOS_ROUTE}?mindStatus=${mindStatus}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setVideoItems(data.videos || []);
      } else {
        toast.error("Failed to fetch videos");
      }
    } catch (err) {
      toast.error("Failed to fetch videos");
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchMindStatus();
      await loadVideos();
    };
    init();
  }, []);

  const goNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, videoItems.length - 1));
  };

  const goPrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const currentVideo = videoItems[currentIndex];

  return (
    <div
      className="fixed w-full top-22"
      style={{ height: `calc(95vh - ${NAVBAR_HEIGHT}px)`, padding:"3px", overflow:"hidden", marginTop:"0px" }}
    >
      {/* Background and Center Container */}
      <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-black via-zinc-900 to-neutral-900 relative overflow-hidden">

        {/* Video Display */}
        {currentVideo ? (
          <div className="relative w-auto h-full aspect-[9/16] rounded-3xl overflow-hidden border border-white/10 transition-transform duration-500 hover:scale-[1.01]">
            <iframe
              src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1&mute=1&playsinline=1`}
              title={`Motivational Video ${currentIndex + 1}`}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="text-white text-lg font-semibold">Loading your motivation...</p>
        )}

        {/* Up Button */}
        {currentIndex > 0 && (
          <button
            onClick={goPrev}
            className="cursor-pointer absolute left-80 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-lg shadow-lg border border-white/20 group transition"
          >
            <ChevronUp size={36} className="text-white group-hover:scale-110 transition" />
          </button>
        )}

        {/* Down Button */}
        {currentIndex < videoItems.length - 1 && (
          <button
            onClick={goNext}
            className="cursor-pointer absolute right-80 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-lg shadow-lg border border-white/20 group transition"
          >
            <ChevronDown size={36} className="text-white group-hover:scale-110 transition" />
          </button>
        )}
      </div>
    </div>
  );
}
