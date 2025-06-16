import { reminderQueue } from "./reminderQueue";

export const getReminderQueueStatus = async () => {
  const counts = await reminderQueue.getJobCounts();
    console.log("Reminder Queue Status:");
    console.log("Waiting:", counts.waiting);
    console.log("Active:", counts.active);
    console.log("Completed:", counts.completed);
    console.log("Failed:", counts.failed);
    console.log("Delayed:", counts.delayed);
    console.log("Paused:", counts.paused);
    console.log("Total Jobs in Queue:", counts.waiting + counts.active + counts.completed + counts.failed + counts.delayed);
    return counts;
};


getReminderQueueStatus();