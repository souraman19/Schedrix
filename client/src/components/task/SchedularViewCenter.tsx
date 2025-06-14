"use client";
import { GET_TASK_7days } from "@/lib/apiRoutes";
import React, { useEffect, useState } from "react";

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [SLOT_HEIGHT, SET_SLOT_HEIGHT] = useState(1);
  const [timeMarksList, setTimeMarksList] = useState<String[]>(["00"]);

  const setUpTimeMarkings = () => {
    if(SLOT_HEIGHT === 1){
        setTimeMarksList(["00"])
    } else if(SLOT_HEIGHT === 6){
        setTimeMarksList(["00", "30"])
    } else if(SLOT_HEIGHT === 11){
        setTimeMarksList(["00", "30", "15", "45"])
    } else if(SLOT_HEIGHT === 16){
        setTimeMarksList(["00", "10", "20", "30", "40", "50"])
    } else if(SLOT_HEIGHT === 21){
        setTimeMarksList(["00", "10", "20", "30", "40", "50", "05", "15", "25", "35", "45", "55"]);
    }
  }

  const priorityColors = {
    low: "bg-green-600/70",
    medium: "bg-yellow-500/70",
    high: "bg-orange-500/80",
    critical: "bg-red-600/80",
  };
  

  const checkIfSlotsEndsWidth = (slot: string) => {
    return timeMarksList.some((timeMark) => slot.endsWith(timeMark));
  }

  const baseDate = new Date(`${year}-${parseInt(month) + 1}-${day}`); //YYYY-MM-DD => proper format like in write in real

  //Builds an array of 7 Dates: from day-1 to day+5.
  //Used to render each day's column.
  const daysArray = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i - 1);
    return date;
  });

  const timeSlots = generateTimeSlots(); //Creates the array of minute labels once.

  useEffect(() => {
    console.log("taksks", tasks);
  }, [tasks]);

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
      setTasks(result.tasks);
    } catch (err) {
      console.error("Error in fetching task of 7 days", err);
    }
  };

  useEffect(() => {
    get7DaysTasks();
  }, []);

  return (
    <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-green-500">
      {/* Time Column */}
      <div className="w-20 shrink-0 flex flex-col items-end pt-[32px] relative">
        {timeSlots.map((slot, i) => (
          <div
            key={i}
            style={{ height: SLOT_HEIGHT }}
            className={`w-full pr-1 text-[10px] text-gray-400 ${ checkIfSlotsEndsWidth(slot) ? ""
                : "text-transparent"
            }`}
          >
            {slot}
          </div>
        ))}
      </div>

      {/* Day Columns */}
      <div className="flex-1 flex">
        {daysArray.map((date, dayIndex) => {
          const dayTasks = tasks.filter((task) => {
            if (!task.startTime || !task.endTime) return false;
            const taskStartDateStr = formatDate(task.startTime);
            const taskEndDateStr = formatDate(task.endTime);
            const currDateStr = formatDate(date);
            return taskStartDateStr === currDateStr || taskEndDateStr === currDateStr;
          });

          return (
            <div
              key={dayIndex}
              className="relative w-48 border-l border-gray-800"
            >
              {/* Sticky Day Header */}
              <div className="sticky top-0 bg-black text-green-400 text-center text-sm py-2 border-b border-gray-700 z-10">
                {date.toLocaleDateString("en-US", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>

              {/* Minute slots */}
              {timeSlots.map((_, i) => (
                <div
                  key={i}
                  style={{ height: SLOT_HEIGHT }}
                  className="border-t border-gray-700"
                />
              ))}

              {/* Tasks */}
              {dayTasks.map((task) => {
                const start = parseMinutesFromMidnight(task.startTime);
                const end = parseMinutesFromMidnight(task.endTime);
                const height = (end - start) * SLOT_HEIGHT;
                const top = start * SLOT_HEIGHT;

                return (
                  <div
                    key={task._id}
                    title={`priority - ${task.priority}\n locked - ${task.isLocked}`}
                    className={`absolute left-2 right-2 ${priorityColors[task.priority]} text-xs text-white px-2 py-1 rounded-md shadow-md overflow-hidden`}
                    style={{ top, height, transition: 'top 0.2s, height 0.2s',display:"flex", justifyContent:"center", alignItems:"center"}}
                  >
                    {task.title}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Slider to control slot height */}
      <div className="fixed bottom-4 right-4 bg-black/80 border border-green-500 rounded-xl p-3 shadow-lg z-50">
        <label className="text-green-400 text-xs block mb-1">Zoom in-out slider</label>
        <input
          type="range"
          min={1}
          max={21}
          step={5}
          value={SLOT_HEIGHT}
          onChange={(e) => {
            SET_SLOT_HEIGHT(Number(e.target.value));
          }}
          className="w-32 accent-green-500 cursor-pointer"
        />
      </div>
    </div>
  );
}
