"use client";

import {
  GET_MOTIVATIONAL_VIDEOS_ROUTE,
  USER_INFO_ROUTE,
} from "@/lib/apiRoutes";
import { useUserStore } from "@/store/useUserStore";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);


type Video = {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  channelTitle: string;
  searchTerms: string[];
  link: string;
  aspect: string;
};


export default function VideosPage() {
  const [videoItems, setVideoItems] = useState<Video[]>([]);
  const [mindStatus, setMindStatus] = useState("Default");
  const { user, setUser } = useUserStore();
  const router = useRouter();


  const fetchMindStatus = useCallback(async () => {
    if (user?.mindStatus) {
      setMindStatus(user.mindStatus);
      return;
    }
    try {
      const response = await axios.get(USER_INFO_ROUTE, {
        withCredentials: true,
      });
      setUser(response.data);
      setMindStatus(response.data.mindStatus || "Default");
    } catch (error: any) {
      if (error.response?.status === 401) router.push("/");
    }
  }, [user, setUser, router]);

  const loadVideos = useCallback(async () => {
    try {
      const response = await fetch(
        `${GET_MOTIVATIONAL_VIDEOS_ROUTE}?mindStatus=${mindStatus}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("fetched videos:", data.videos);
        setVideoItems(data.videos || []);
      } else {
        toast.error("Failed to fetch videos");
      }
    } catch (err) {
      toast.error("Failed to fetch videos");
      console.log(err);
    }
  }, [mindStatus]);

  useEffect(() => {
    const init = async () => {
      await fetchMindStatus();
    }
    init();
  }, [fetchMindStatus]);

  useEffect(() => {
    if (mindStatus) {
      loadVideos();
    }
  }, [mindStatus, loadVideos]);



  return (
    <div className="w-full min-h-screen bg-black px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-lime-300 bg-clip-text text-transparent">
        Curated Inspiration Just for You <span className="text-white">🎥</span>
      </h1>
      <div className="max-w-3xl mx-auto space-y-10">
        {videoItems.map((video) => {
          const isShort =
            video.link.includes("shorts") || video.aspect === "9:16";
          const aspectRatio = isShort ? "pt-[177.78%]" : "pt-[56.25%]";
          const postedAgo = dayjs(video.publishedAt).fromNow();

          return (
            <div
              key={video.videoId}
              className="bg-zinc-900 rounded-xl border border-white/10 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Header */}
              <div className="flex justify-between items-start p-4">
                <div>
                  <p className="text-white font-semibold text-sm">
                    {video.channelTitle}
                  </p>
                  <p className="text-gray-500 text-xs">{postedAgo}</p>
                </div>
              </div>

              {/* Video */}
              <div className={`w-full relative ${aspectRatio}`}>
                <iframe
                  src={`https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1&autoplay=0&playsinline=1`}
                  title={video.title}
                  className="absolute top-0 left-0 w-full h-full rounded-t-md"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="text-white text-lg font-semibold">
                  {video.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {video.description.length > 200
                    ? `${video.description.slice(0, 200)}...`
                    : video.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {video.searchTerms?.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-green-400 bg-white/10 px-2 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer (Static Actions)
          <div className="flex justify-between items-center px-4 py-3 border-t border-white/5 text-gray-400 text-sm">
            <div className="flex gap-6">
              <button className="hover:text-white transition">👍 Like</button>
              <button className="hover:text-white transition">💬 Comment</button>
              <button className="hover:text-white transition">🔗 Share</button>
            </div>
            <p className="text-xs">{video.source}</p>
          </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
