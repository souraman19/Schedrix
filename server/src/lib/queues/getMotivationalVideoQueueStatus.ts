import { motivationalVideoQueue } from "./motivationalVideoQueue";

export const inspectReminderQueue = async () => {
  const counts = await motivationalVideoQueue.getJobCounts();
  const repeatableJobs = await motivationalVideoQueue.getRepeatableJobs();

  console.log("🔁 Repeatable Jobs:");
  repeatableJobs.forEach((job, i) => {
    const nextRun = job.next ? new Date(job.next).toLocaleString() : "N/A";

    console.log(`\n[${i + 1}] Job ID: ${job.id}`);
    console.log(`    Name: ${job.name}`);
    console.log(`    Next Run At: ${nextRun}`);
    console.log(`    Interval (ms): ${job.every || "cron"}`);
    console.log(`    Key: ${job.key}`);
  });

  console.log("\n📊 Queue Counts:");
  console.log("  Waiting:", counts.waiting);
  console.log("  Active:", counts.active);
  console.log("  Completed:", counts.completed);
  console.log("  Failed:", counts.failed);
  console.log("  Delayed:", counts.delayed);
  console.log("  Paused:", counts.paused);
  console.log("  Total:", counts.waiting + counts.active + counts.completed + counts.failed + counts.delayed);
};

inspectReminderQueue();
