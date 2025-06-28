import { connectDB } from "./config/db";
import express, {Request, Response} from "express";

const app = express();
const port = process.env.PORT || 8000;


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


app.get("/", (req: Request, res: Response) => {
  res.send("Background services are running");
});

app.listen(port, () => {
  console.log(`Background service server is running on http://localhost:${port}`);
});
