import { GET_QUOTE_OF_THE_DAY_ROUTE } from "@/lib/apiRoutes";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Quote = {
  type: string; // e.g., "quote", "video"
  content: string; // actual quote or message
  author: string;
  link?: string; // optional YouTube or external link
  tags: string[]; // array of tags
  source: string;
  fetchedAt: Date;
  contentHash: string;
};

export default function QuoteOfTheDay({
  mindStatus,
}: {
  mindStatus: string | null;
}) {
  const [QOTD, setQOTD] = useState<Quote | null>(null);
  const [QOTD_image_url, setQOTD_image_url] = useState<string | null>(null);

  const fetchQuote = useCallback(async () => {
    try {
      const res = await fetch(
        `${GET_QUOTE_OF_THE_DAY_ROUTE}?mindStatus=${mindStatus}`,
        {
          method: "GET",
          credentials: "include", 
        }
      );

      if (res.ok) {
        const result = await res.json();
        setQOTD(result.quote);
        setQOTD_image_url(result.quoteImageURL);
        console.log("Quote of the Day fetched successfully: ", result);
      } else {
        console.warn("Failed to fetch Quote of the Day", res.status);
      }
    } catch (err) {
      console.error("Error fetching Quote of the Day:", err);
    }
  }, [mindStatus]);

  useEffect(() => {
    fetchQuote();
  }, [mindStatus, fetchQuote]);

  return (
    <div className="mb-10 mt-0 flex items-center justify-center min-h-screen px-4 py-10 bg-gradient-to-br from-black via-[#0d0d0d] to-[#1a1a1a] text-white">
      {QOTD ? (
        <div className="flex flex-col items-center justify-center w-full max-w-3xl">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-lime-300 bg-clip-text text-transparent">
            Quote of the Day <span className="text-white">✨</span>
          </h1>

          <div className="relative bg-gradient-to-br py-5 px-10 from-[#0f0f0f] to-[#1c1c1c] p-4 rounded-2xl max-w-sm w-full shadow-[0_0_20px_#00c85333] border border-[#2e2e2e] hover:shadow-[0_0_40px_#00e67666] transition-all duration-500 group">
            {/* Top Glow Accent */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-[#00c853] to-[#b2ff59] rounded-full blur-sm group-hover:blur group-hover:w-32 transition-all duration-300"></div>

            {/* Quote Image */}
            <Image
              src={QOTD_image_url || 'https://images.unsplash.com/photo-1658611694395-60e62e5353f3?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
              alt="Motivational Quote"
              height={240}
              width={400}
              className="w-full h-auto rounded-lg border border-[#2a2a2a] mb-4 shadow-inner"
            />

            {/* Quote Content */}
            <div className="text-center">
              <h2 className="text-lg font-semibold text-emerald-400 leading-snug">
                “{QOTD.content}”
              </h2>
              <p className="text-xs text-gray-400 italic mt-2">
                — {QOTD.author || "Unknown"}
              </p>
            </div>

            {/* Glowing Bottom Border */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-[2px] bg-gradient-to-r from-[#b2ff59] to-[#00c853] rounded-full blur-sm group-hover:w-32 transition-all duration-300"></div>
          </div>
        </div>
      ) : (
        // 🟢 Fallback Skeleton
        <div className="relative bg-gradient-to-br py-5 px-10 from-[#0f0f0f] to-[#1c1c1c] p-4 rounded-2xl max-w-sm w-full border border-[#2e2e2e] shadow-[0_0_20px_#00c85333] animate-pulse">
          {/* Top Glow Accent */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-[#00c853] to-[#b2ff59] rounded-full blur-sm" />

          {/* Image Skeleton */}
          <div className="w-full h-60 rounded-lg bg-[#222] mb-4" />

          {/* Text Skeleton */}
          <div className="space-y-3 text-center">
            <div className="h-5 w-3/4 mx-auto bg-[#2a2a2a] rounded-md" />
            <div className="h-4 w-1/2 mx-auto bg-[#2a2a2a] rounded-md" />
          </div>

          {/* Bottom Glow */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-[2px] bg-gradient-to-r from-[#b2ff59] to-[#00c853] rounded-full blur-sm" />
        </div>
      )}
    </div>
  );
}
