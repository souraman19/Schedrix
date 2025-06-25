import { GET_QUOTE_OF_THE_DAY_ROUTE } from "@/lib/apiRoutes";
import { cookies } from "next/headers";

export default async function QuoteOfTheDay({
  mindStatus,
}: {
  mindStatus: string | null;
}) {
  let QOTD: string | null = null;
  let QOTD_image_url: string | null = null;

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("connect.sid");
    const response = await fetch(
      `${GET_QUOTE_OF_THE_DAY_ROUTE}?mindStatus=${mindStatus}`,
      {
        method: "GET",
        headers: {
          Cookie: `${sessionCookie?.name}=${sessionCookie?.value}`,
        },
        cache: "no-store",
      }
    );

    if (response.status === 200) {
      const result = await response.json();
      QOTD = result.quote;
      QOTD_image_url = result.quoteImageURL;
      // console.log("Quote of the Day fetched successfully: ", result);
    }
  } catch (err) {
    console.error("Error fetching task details:", err);
  }

  return (
    <div className="mb-10 mt-0 flex items-center justify-center min-h-screen px-4 py-10 bg-gradient-to-br from-black via-[#0d0d0d] to-[#1a1a1a] text-white">
      {QOTD && (
        <div className="flex flex-col items-center justify-center w-full max-w-3xl">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-green-400 to-lime-300 bg-clip-text text-transparent">
            Quote of the Day <span className="text-white">✨</span>
          </h1>

          <div className="relative bg-gradient-to-br py-5 px-10 from-[#0f0f0f] to-[#1c1c1c] p-4 rounded-2xl max-w-sm w-full shadow-[0_0_20px_#00c85333] border border-[#2e2e2e] hover:shadow-[0_0_40px_#00e67666] transition-all duration-500 group">
            {/* Top Glow Accent */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-[#00c853] to-[#b2ff59] rounded-full blur-sm group-hover:blur group-hover:w-32 transition-all duration-300"></div>

            {/* Quote Image */}
            <img
              src={`http://localhost:5000/${QOTD_image_url}`}
              alt="Motivational Quote"
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
      )}
    </div>
  );
}
