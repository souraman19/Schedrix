import { connectDB, disconnectDB } from "../../config/db";
import { User } from "./../../models/User";



export async function getUserFcmToken(userId: string): Promise<string | null> {
  await connectDB();
  const user = await User.findById(userId).select("fcmToken").lean().exec();
  await disconnectDB();
  return user?.fcmToken ?? null;
}
