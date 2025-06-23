import AllQuotesSection from "@/components/quote/AllQuotesSection";
import QuoteOfTheDay from "@/components/quote/QuoteOfTheDay";
import {
  GET_QUOTE_OF_THE_DAY_ROUTE,
  GET_USER_MIND_STATUS_ROUTE,
} from "@/lib/apiRoutes";
import { cookies } from "next/headers";

export default async function ContentHomePage() {
  let mindStatus: string | null = null;

  const fetchMindStatus = async () => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("connect.sid");

    const response = await fetch(`${GET_USER_MIND_STATUS_ROUTE}`, {
      method: "GET",
      headers: {
        Cookie: `${sessionCookie?.name}=${sessionCookie?.value}`,
      },
      cache: "no-store",
    });
    
    if (response.status === 200) {
      const result = await response.json();
      mindStatus = result.mindStatus || "Default";
    }
  } catch (err) {
    console.error("Error fetching mind status:", err);
  }
};
  await fetchMindStatus();

  return (
    <div className="min-h-screen px-4 py-8 bg-black text-white">
      <div>{mindStatus && 
          <div>
            <QuoteOfTheDay mindStatus={mindStatus} />
          </div>
        }</div>
      <div>
        <AllQuotesSection />
      </div>
    </div>
  );
}
