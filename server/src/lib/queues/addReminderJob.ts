import { reminderQueue } from "./reminderQueue";

export const addReminderJob = async ({
  taskId,
  userId,
  remindAt,
  taskTitle,
}: {
  taskId: string;
  userId: string;
  remindAt: Date;
  taskTitle: string;
}) => {
  await reminderQueue.add(
    "send-task-reminder",
    {
      taskId,
      userId,
      taskTitle,
    },
    {
      delay: remindAt.getTime() - Date.now(), // wait till remindAt
      attempts: 2,
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
  const count = await reminderQueue.getJobCountByTypes(
    "waiting",
    "delayed",
    "active",
    "completed",
    "failed"
  );

  console.log("Now Total Jobs in Queue:", count);
};
