"use client";

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import axios from "axios";
import { GET_QUOTES_ROUTE, USER_INFO_ROUTE } from "@/lib/apiRoutes";
import { useRouter } from "next/navigation";
import { set } from "date-fns";
import { toast } from "react-hot-toast";
import QuoteCard from "@/components/quote/QuoteCard";

export default function BoostHomePage() {
  const [quotes, setQuotes] = useState([]);
  const [mindStatus, setMindStatus] = useState("Default");
  const [hashMore, setHashMore] = useState(true);
  const [loading, setLoading] = useState(false);

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
      if (loading || !hashMore) return;
      setLoading(true);

      const last = quotes[quotes.length - 1];
      const cursor = last?.fetchedAt;

      const response = await fetch(
        `${GET_QUOTES_ROUTE}?mindStatus=${mindStatus}$cursor=${
          cursor ? `&cursor=${cursor}` : ""
        }`,
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
        const newQuotes = data.quotes;
        if (newQuotes.length < 10) {
          setHashMore(false);
        }
        setQuotes((prevQuotes) => [...prevQuotes, ...newQuotes]);
        toast.success("Quotes fetched successfully");
        setLoading(false);
      } else {
        console.error("Failed to fetch quotes:", response.statusText);
        toast.error("Failed to fetch quotes");
      }
    } catch (err) {
      console.error("Error fetching quotes:", err);
      toast.error("Failed to fetch quotes");
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
  <div className="min-h-screen px-4 py-8 bg-black text-white">
    <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-lime-300 bg-clip-text text-transparent">
      Your Boost Feed
    </h1>

    <div className="grid gap-6 max-w-3xl mx-auto">
      {mindStatus && quotes.length > 0 ? (
        quotes.map((q, index) => (
          <QuoteCard key={index} quote={q} />
        ))
      ) : (
        <p className="text-center text-gray-400">No quotes found yet.</p>
      )}
    </div>

    {hashMore && (
      <div className="mt-10 flex justify-center">
        <button
          onClick={loadMore}
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-lime-400 hover:from-green-400 hover:to-lime-300 text-black font-semibold py-2 px-6 rounded-full shadow-lg hover:shadow-green-500/50 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    )}
  </div>
);

}
