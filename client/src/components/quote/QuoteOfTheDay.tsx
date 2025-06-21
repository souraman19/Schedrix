import { GET_QUOTE_OF_THE_DAY_ROUTE } from "@/lib/apiRoutes";
import { cookies } from "next/headers";

export default async function QuoteOfTheDay({
  mindStatus,
}: {
  mindStatus: string | null;
}) {
  let QOTD: string | null = null;

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
    //   console.log("Quote of the Day fetched successfully: ", quote);
    }
  } catch (err) {
    console.error("Error fetching task details:", err);
  }

  return (
    <div className="flex items-center justify-center h-screen">
      {QOTD && (
        <div>
          <div>{QOTD.content}</div>
          <div>{QOTD.author}</div>
        </div>
      )}
    </div>
  );
}
