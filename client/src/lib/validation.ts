import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  duration: z.coerce.number().min(0.01, "Duration must be greater than 0").optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  deadline: z.coerce.date().optional(),
  description: z.string().optional(),
  image: z.instanceof(File).optional(),
  audio: z.instanceof(File).optional(), 
  category: z.string(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  tags: z.array(z.string()).optional(),
  isLocked: z.coerce.boolean(),
  isFixed: z.coerce.boolean(),
})
  .superRefine((data, ctx) => {
    if (data.isFixed) {
      const hasStartAndDuration = !!data.startTime && !!data.duration;
      const hasDeadline = !!data.deadline;

      if (!hasStartAndDuration && !hasDeadline) {
        ctx.addIssue({
          path: ["startTime"],
          code: z.ZodIssueCode.custom,
          message: "As task is fixed, provide either both start time & duration or a deadline.",
        });
        ctx.addIssue({
          path: ["deadline"],
          code: z.ZodIssueCode.custom,
          message: "As task is fixed, provide either both start time & duration or a deadline.",
        });
      }
    }
  });
