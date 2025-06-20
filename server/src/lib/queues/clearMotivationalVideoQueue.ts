import { motivationalVideoQueue } from "./motivationalVideoQueue";

const clearQueue = async () => {
  // 1. Remove all repeatable jobs
  const repeatables = await motivationalVideoQueue.getRepeatableJobs();
  for (const job of repeatables) {
    await motivationalVideoQueue.removeRepeatableByKey(job.key);
  }

  // 2. Obliterate all jobs from the queue
  await motivationalVideoQueue.obliterate({ force: true });

  console.log("✅ Queue cleared (including repeatable jobs).");

};

clearQueue().catch(console.error);
