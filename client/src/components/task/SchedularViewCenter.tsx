"use client";
import { GET_TASK_7days, RESCHEDULE_TASKLISTS_ROUTE } from "@/lib/apiRoutes";
import React, { useEffect, useRef, useState } from "react";
import { start } from "repl";
import { toast } from "sonner";

type UndoStep = {
  taskId: string;
  prevStart: Date;
  prevEnd: Date;
  rescheduleStatus: boolean;
};

type Task = {
  _id: string;
  title: string;
  status: "pending" | "completed" | "overdue";
  duration?: number; // in minutes
  startTime?: Date;
  endTime?: Date;
  deadline?: Date;
  isLocked: boolean;
  isFixed: boolean;
  rescheduleStatus: boolean;
  userOutput: {
    text: string;
    image: string[];
    video: string[];
    audio: string[];
  };
  userInput: {
    text: string;
    image: string[];
    video: string[];
    audio: string[];
  };
  OutputAnalysis: {
    text: string;
    image: string[];
    video: string[];
    audio: string[];
  };
  pointsContributed: {
    day: Date;
    points: number;
  }[];
  totalPointsContributed: number;
  category: "work" | "family" | "health" | "personal" | "other" | "learning";
  createdBy: string; // MongoDB ObjectId as string
  priority: "low" | "medium" | "high" | "critical";
  repeat?: "no repeat" | "repeat";
  customRepeat?: {
    repeatInterval?: number;
    repeatUnit?: "day" | "week" | "month" | "year";
    endsType?: "date" | "afterOccurrences" | "never";
    endsOn?: {
      date?: Date;
      afterOccurrences?: number;
      never?: boolean;
    };
    startDate?: Date;
    weekDaysIfWeekInterval?: string[];
    monthDaysIfMonthInterval?: number[];
    yearDatesIfYearInterval?: Date[];
  };
  tags: string[];
  isMaster: boolean;
  masterTaskId?: string | null; // ObjectId
  masterStatus: "pending" | "completed" | "N/A";
  createdAt: Date;
  updatedAt: Date;
};

const MINUTES_IN_DAY = 1440;

const generateTimeSlots = () => {
  const slots = [];
  for (let i = 0; i < MINUTES_IN_DAY; i++) {
    const hour = Math.floor(i / 60);
    const min = i % 60;
    slots.push(
      `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`
    );
  }
  return slots;
};

const parseMinutesFromMidnight = (date: Date) =>
  date.getHours() * 60 + date.getMinutes();

const formatDate = (d: Date) => d.toLocaleDateString("en-CA"); // Format: yyyy-mm-dd  //Used to compare only the date portion (ignores time), for matching task dates.

export default function SchedulerViewCenter({
  day,
  month,
  year,
}: {
  day: string;
  month: string;
  year: string;
}) {
  const [originalTasks, setOriginalTasks] = useState<Task[]>([]);
  //for storing original tasks fetched from backend, used to compare with changed tasks for rescheduling
  //This is used to reset the tasks if user cancels rescheduling or to compare with changed tasks

  const [tasks, setTasks] = useState<Task[]>([]);
  //to show tasks in the timeline view
  //state is updated here when user slide or reschedule tasks

  const [changedTasks, setChangedTasks] = useState<Record<string, Task>>({});
  //to store tasks that have been changed by the user during drag and drop to send to backend for rescheduling
  //key is task._id, value is the updated task object

  const [SLOT_HEIGHT, SET_SLOT_HEIGHT] = useState(1);
  const [timeMarksList, setTimeMarksList] = useState<String[]>(["00"]);
  const [undoStack, setUndoStack] = useState<UndoStep[]>([]);

  const draggingTaskRef = useRef<Task | null>(null);
  const offsetYRef = useRef<number>(0);

  const setUpTimeMarkings = () => {
    if (SLOT_HEIGHT === 1) {
      setTimeMarksList(["00"]);
    } else if (SLOT_HEIGHT === 6) {
      setTimeMarksList(["00", "30"]);
    } else if (SLOT_HEIGHT === 11) {
      setTimeMarksList(["00", "30", "15", "45"]);
    } else if (SLOT_HEIGHT === 16) {
      setTimeMarksList(["00", "10", "20", "30", "40", "50"]);
    } else if (SLOT_HEIGHT === 21) {
      setTimeMarksList([
        "00",
        "10",
        "20",
        "30",
        "40",
        "50",
        "05",
        "15",
        "25",
        "35",
        "45",
        "55",
      ]);
    }
  };

  const priorityColors = {
    low: "bg-green-600/70",
    medium: "bg-yellow-500/70",
    high: "bg-orange-500/80",
    critical: "bg-red-600/80",
  };

  const handleUndoStep = () => {
    setUndoStack((prevStack) => {
      if (prevStack.length === 0) return prevStack;

      const newStack = [...prevStack];
      const lastStep = newStack.pop();
      if (!lastStep) return prevStack;

      const { taskId, prevStart, prevEnd, rescheduleStatus } = lastStep;

      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId
            ? {
                ...task,
                startTime: prevStart,
                endTime: prevEnd,
                rescheduleStatus,
              }
            : task
        )
      );

      const originalTask = originalTasks.find((task) => task._id === taskId);
      const isSameAsOriginal =
        originalTask &&
        originalTask.startTime?.getTime() === prevStart.getTime() &&
        originalTask.endTime?.getTime() === prevEnd.getTime();

      setChangedTasks((prev) => {
        const updated = { ...prev };
        if (isSameAsOriginal) {
          delete updated[taskId];
        } else {
          updated[taskId] = {
            ...updated[taskId],
            startTime: prevStart,
            endTime: prevEnd,
            rescheduleStatus,
          };
        }
        return updated;
      });

      toast.info("Undo successful");
      return newStack;
    });
  };

  const checkIfSlotsEndsWidth = (slot: string) => {
    return timeMarksList.some((timeMark) => slot.endsWith(timeMark));
  };

  const baseDate = new Date(`${year}-${parseInt(month) + 1}-${day}`); //YYYY-MM-DD => proper format like in write in real

  //Builds an array of 7 Dates: from day-1 to day+5.
  //Used to render each day's column.
  const daysArray = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i - 1);
    return date;
  });

  const timeSlots = generateTimeSlots(); //Creates the array of minute labels once.

  //   useEffect(() => {
  //     console.log("taksks", tasks);
  //   }, [tasks]);

  useEffect(() => {
    setUpTimeMarkings();
  }, [SLOT_HEIGHT]);

  const get7DaysTasks = async () => {
    try {
      const startDay = daysArray[0];
      const response: Response = await fetch(`${GET_TASK_7days}/${startDay}`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      // console.log(result);

      //calculate startTime and endTime for each task
      result.tasks.forEach((task: Task) => {
        if (task.startTime) task.startTime = new Date(task.startTime);
        if (task.endTime) task.endTime = new Date(task.endTime);
        if (task.startTime && task.duration && !task.endTime)
          task.endTime = new Date(
            task.startTime.getTime() + task.duration * 60 * 60 * 1000
          );
        if (task.endTime && task.duration && !task.startTime)
          task.startTime = new Date(
            task.endTime.getTime() - task.duration * 60 * 60 * 1000
          );
      });

      setOriginalTasks(result.tasks);
      setTasks(result.tasks);
    } catch (err) {
      console.error("Error in fetching task of 7 days", err);
    }
  };

  useEffect(() => {
    get7DaysTasks();
  }, []);

  const handleMouseDown = (task: Task, e: React.MouseEvent<HTMLDivElement>) => {
    draggingTaskRef.current = task;
    offsetYRef.current =
      e.clientY - e.currentTarget.getBoundingClientRect().top;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingTaskRef.current) return;

    const container = document.querySelector(".timeline-container");
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const y = e.clientY - rect.top - offsetYRef.current;

    const minutes = Math.floor(y / SLOT_HEIGHT); // Use floor instead of round
    const clampedMinutes = Math.max(0, Math.min(minutes, MINUTES_IN_DAY - 1));

    const newStart = new Date(draggingTaskRef.current.startTime!);
    newStart.setHours(0, 0, 0, 0); // reset time to midnight first
    newStart.setMinutes(clampedMinutes); // then set total minutes directly

    const durationInMs = draggingTaskRef.current.duration! * 60 * 60 * 1000;
    const newEnd = new Date(newStart.getTime() + durationInMs);

    setTasks((prev) =>
      prev.map((t) =>
        t._id === draggingTaskRef.current!._id
          ? {
              ...t,
              startTime: newStart,
              endTime: newEnd,
              rescheduleStatus: true,
            }
          : t
      )
    );

    setChangedTasks((prev) => ({
      ...prev,
      [draggingTaskRef.current!._id]: {
        ...draggingTaskRef.current!,
        startTime: newStart,
        endTime: newEnd,
      },
    }));
  };

  const handleMouseUp = async () => {
    const draggingTask = draggingTaskRef.current; //saving before nullifying it
    if (!draggingTask) return;
    setUndoStack((prev) => [
      ...prev,
      {
        taskId: draggingTask!._id,
        prevStart: draggingTask!.startTime!,
        prevEnd: draggingTask!.endTime!,
        rescheduleStatus: draggingTask!.rescheduleStatus,
      },
    ]);
    draggingTaskRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleRescheduleSubmit = async () => {
    const updatedTasks = Object.values(changedTasks);
    // console.log(updatedTasks);
    try {
      const response = await fetch(RESCHEDULE_TASKLISTS_ROUTE, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tasks: updatedTasks }),
      });
      if (response.ok) {
        setChangedTasks({});
        await get7DaysTasks();
        toast.success("Task rescheduled successfully");
      } else {
        toast.error("Error rescheduling tasks");
      }
    } catch (err) {
      console.error("Error in rescheduling task lists, err");
      toast.error("Error rescheduling tasks");
    }
  };

  return (
  <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-[#00ff88] bg-gradient-to-br from-black via-zinc-950 to-neutral-900 text-white">
    {/* Time Column */}
    <div className="w-20 shrink-0 flex flex-col items-end pt-[32px] relative border-r border-[#00ff8877] bg-black/80 backdrop-blur-lg">
      {timeSlots.map((slot, i) => (
        <div
          onClick={() => {
            const hour = Math.floor(i / 60)
              .toString()
              .padStart(2, "0");
            const minute = (i % 60).toString().padStart(2, "0");
            toast.info(`Time: ${hour}:${minute}`);
          }}
          key={i}
          style={{ height: SLOT_HEIGHT }}
          className={`w-full pr-1 text-[10px] font-mono ${
            checkIfSlotsEndsWidth(slot)
              ? "text-[#00ff88] hover:text-white transition"
              : "text-transparent"
          } cursor-pointer`}
        >
          {slot}
        </div>
      ))}
    </div>

    {/* Day Columns */}
    <div className="flex-1 flex timeline-container">
      {daysArray.map((date, dayIndex) => {
        const dayTasks = tasks.filter((task) => {
          if (!task.startTime || !task.endTime) return false;
          const taskStartDateStr = formatDate(task.startTime);
          const taskEndDateStr = formatDate(task.endTime);
          const currDateStr = formatDate(date);
          return (
            taskStartDateStr === currDateStr || taskEndDateStr === currDateStr
          );
        });

        return (
          <div
            key={dayIndex}
            className="relative w-48 border-l border-[#00c85344] bg-black/50 backdrop-blur"
          >
            {/* Sticky Day Header */}
            <div className="day-header sticky top-0 bg-black/70 backdrop-blur-md text-[#b2ff59] font-semibold text-center text-sm py-2 shadow-[0_2px_10px_#00c85388] z-10 border-b border-green-500/30">
              {date.toLocaleDateString("en-US", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>

            {/* Minute slots */}
            {timeSlots.map((slot, i) => {
              const isMarked = checkIfSlotsEndsWidth(slot);
              return (
                <div
                  key={i}
                  style={{ height: SLOT_HEIGHT }}
                  className={`border-t ${
                    isMarked ? "border-[#00ff88]" : "border-gray-700"
                  } hover:bg-[#00ff8822] transition cursor-pointer`}
                  onClick={() => {
                    const hour = Math.floor(i / 60)
                      .toString()
                      .padStart(2, "0");
                    const minute = (i % 60).toString().padStart(2, "0");
                    toast.info(`Time: ${hour}:${minute}`);
                  }}
                />
              );
            })}

            {/* Tasks */}
            {dayTasks.map((task) => {
              const start = parseMinutesFromMidnight(task.startTime!);
              const end = parseMinutesFromMidnight(task.endTime!);
              const height = (end - start) * SLOT_HEIGHT;
              const headerOffsetHeight =
                document.querySelector(".day-header")?.clientHeight || 40;
              const top = start * SLOT_HEIGHT + headerOffsetHeight;

              return (
                <div
                  key={task._id}
                  onMouseDown={(e) => handleMouseDown(task, e)}
                  title={`Start: ${task.startTime}\nEnd: ${task.endTime}`}
                  className={`absolute left-2 right-2 cursor-grab ${
                    priorityColors[task.priority]
                  } px-3 py-1 rounded-xl border border-[#00ff8877] shadow-[0_0_16px_#00ff8866] backdrop-blur-md bg-gradient-to-br from-[#00c853]/70 to-[#b2ff59]/40 hover:scale-[1.03] transition-all`}
                  style={{
                    top,
                    height,
                    transition: "top 0.2s",
                    zIndex: 20,
                  }}
                >
                  <div className="flex justify-center m-1 gap-2 text-xs text-black font-semibold border border-black/20 bg-white/80 px-2 py-1 rounded-full">
                    {task.isLocked && <span>🔒</span>}
                    <span>{task.title}</span>
                    {task.rescheduleStatus && (
                      <span
                        style={{
                          backgroundColor: "white",
                          color: "black",
                          height: "20px",
                          width: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid black",
                          borderRadius: "100px",
                        }}
                      >
                        R
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      {Object.keys(changedTasks).length > 0 && (
        <div className="fixed bottom-28 right-4 z-50 flex flex-col gap-3">
          <button
            onClick={handleRescheduleSubmit}
            className=" cursor-pointer bg-gradient-to-r from-[#00c853] to-[#b2ff59] hover:from-[#b2ff59] hover:to-[#00c853] text-black font-bold px-6 py-3 rounded-full shadow-[0_0_24px_#00ff8866] transition-transform transform hover:scale-105"
          >
            Reschedule ({Object.keys(changedTasks).length})
          </button>

          {undoStack.length > 0 && (
            <button
              onClick={handleUndoStep}
              className=" cursor-pointer bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 text-black font-bold px-5 py-2 rounded-full shadow-md hover:shadow-yellow-500 transition"
            >
              Undo ({undoStack.length})
            </button>
          )}
        </div>
      )}
    </div>

    {/* Slider to control slot height */}
    <div className="fixed bottom-4 right-4 bg-zinc-900/80 backdrop-blur-xl border border-[#00ff88] rounded-xl p-4 shadow-[0_0_18px_#00ff8855] z-50">
      <label className="text-[#00ff88] text-xs font-bold uppercase block mb-2 tracking-wider">
        Zoom Timeline
      </label>
      <input
        type="range"
        min={1}
        max={21}
        step={5}
        value={SLOT_HEIGHT}
        onChange={(e) => {
          SET_SLOT_HEIGHT(Number(e.target.value));
        }}
        className="w-36 h-2 rounded-full bg-[#00ff8822] appearance-none cursor-pointer accent-[#00ff88] shadow-inner"
      />
    </div>
  </div>
);

}
