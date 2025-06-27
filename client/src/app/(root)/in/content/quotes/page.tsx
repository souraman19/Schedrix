import AllQuotesSection from "@/components/quote/AllQuotesSection";
import QuoteOfTheDay from "@/components/quote/QuoteOfTheDay";
import { Suspense } from "react";
import { fetchMindStatus } from "@/lib/fetchMindstatus";

export default async function ContentHomePage() {
  
  const mindStatus: string | null = await fetchMindStatus();
  console.log("Mind Status fetched: ", mindStatus);

  return (
    <div className="min-h-screen px-4 pt-0 bg-black text-white">
      <Suspense
        fallback={
          <div className="mb-10 mt-0 flex items-center justify-center min-h-screen px-4 py-10 bg-gradient-to-br from-black via-[#0d0d0d] to-[#1a1a1a] text-white">
            <div className="flex flex-col items-center justify-center w-full max-w-3xl animate-pulse">
              <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-lime-300 bg-clip-text text-transparent">
                Quote of the Day
              </h1>

              <div className="relative bg-gradient-to-br py-5 px-10 from-[#0f0f0f] to-[#1c1c1c] p-4 rounded-2xl max-w-sm w-full border border-[#2e2e2e] shadow-[0_0_20px_#00c85333]">
                {/* Top Glow Accent */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-[#00c853] to-[#b2ff59] rounded-full blur-sm" />

                {/* Shimmer Image Skeleton */}
                <div className="w-full h-60 rounded-lg bg-[#222] mb-4 shimmer" />

                {/* Text Skeleton */}
                <div className="space-y-2">
                  <div className="h-5 w-3/4 bg-[#2a2a2a] rounded-md" />
                  <div className="h-4 w-1/2 bg-[#2a2a2a] rounded-md" />
                </div>

                {/* Bottom Glow */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-[2px] bg-gradient-to-r from-[#b2ff59] to-[#00c853] rounded-full blur-sm" />
              </div>
            </div>
          </div>
        }
      >
        <div>
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-lime-300 bg-clip-text text-transparent">
            Quote of the Day <span className="text-white">✨</span>
          </h1>
          {mindStatus && (
            <div>
              <h2 className="text-xl font-semibold text-center mb-4">
                Todays Mind Status: {mindStatus}
              </h2>
              <QuoteOfTheDay mindStatus={mindStatus} />
            </div>
          )}
        </div>
      </Suspense>

      <div>
        <AllQuotesSection />
      </div>
    </div>
  );
}
