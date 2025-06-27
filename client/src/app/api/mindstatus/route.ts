
import { GET_USER_MIND_STATUS_ROUTE } from "@/lib/apiRoutes";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("connect.sid");

  if (!sessionCookie) {
    return Response.json({ error: "No session" }, { status: 401 });
  }

  const response = await fetch(GET_USER_MIND_STATUS_ROUTE, {
    headers: {
      Cookie: `connect.sid=${sessionCookie.value}`,
    },
    cache: "no-store",
  });

  const data = await response.json();
  return Response.json(data);
}
