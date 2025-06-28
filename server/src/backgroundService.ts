import { connectDB } from "./config/db";

async function initBackgroundServices() {
  await connectDB();

  await import("./tasks/cronJob");
  await import("./tasks/CheckMissedCron");
  await import("./lib/queues/reminderWorker");
  await import("./lib/queues/motivationalVideoFetchWorker");
  await import("./lib/queues/quoteFetchWorker");

  console.log("🔄 Background services initialized");
}

initBackgroundServices().catch((err) => {
  console.error("❌ Failed to initialize services:", err);
  process.exit(1);
});