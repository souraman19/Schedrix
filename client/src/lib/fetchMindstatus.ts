import { cookies } from "next/headers";
import { GET_USER_MIND_STATUS_ROUTE } from "@/lib/apiRoutes";

export async function fetchMindStatus() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("connect.sid");

  if (!sessionCookie) {
    return null;
  }

  const res = await fetch(GET_USER_MIND_STATUS_ROUTE, {
    headers: {
      Cookie: `connect.sid=${sessionCookie.value}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.mindStatus || "Default";
}
    