'use client';
import React, { useEffect, useState } from 'react';

type Task = {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
};

const MINUTES_IN_DAY = 1440;
const SLOT_HEIGHT = 20; // 1 minute = 20px

const generateTimeSlots = () => {
  const slots = [];
  for (let i = 0; i < MINUTES_IN_DAY; i++) {
    const hour = Math.floor(i / 60);
    const min = i % 60;
    slots.push(`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`);
  }
  return slots;
};

const parseMinutesFromMidnight = (date: Date) => date.getHours() * 60 + date.getMinutes();


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

  const baseDate = new Date(`${year}-${month}-${day}`);
  const daysArray = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    return date;
  });

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    setTasks([
        {
          id: '1',
          title: 'Sample Task',
          startTime: new Date(`${year}-${month}-${day}T10:15:00`),
          endTime: new Date(`${year}-${month}-${day}T11:45:00`),
        },
      ]);      
  }, [day, month, year]);

  useEffect(()=> {
    console.log("taksks", tasks);
  }, [tasks])

  return (
    <div className="flex overflow-x-auto scrollbar-thin scrollbar-thumb-green-500">
      {/* Time Column */}
      <div className="w-20 shrink-0 flex flex-col items-end pt-[32px] relative">
        {timeSlots.map((slot, i) => (
          <div
            key={i}
            style={{ height: SLOT_HEIGHT }}
            className={`w-full pr-1 text-[10px] text-gray-400 ${
              slot.endsWith(':00') || slot.endsWith(':10') || slot.endsWith(':20') || slot.endsWith(':30') || slot.endsWith(':40') || slot.endsWith(':50') ? '' : 'text-transparent'
            }`}
          >
            {slot}
          </div>
        ))}
      </div>

      {/* Day Columns */}
      <div className="flex-1 flex">
        {daysArray.map((date, dayIndex) => {
          const dayTasks = tasks.filter(task => {
            const taskDateStr = task.startTime.toISOString().split('T')[0];
            const currDateStr = date.toISOString().split('T')[0];
            return taskDateStr === currDateStr;
          });          
          console.log(date, "=> ", tasks);

          return (
            <div key={dayIndex} className="relative w-48 border-l border-gray-800">
              {/* Sticky Header */}
              <div className="sticky top-0 bg-black text-green-400 text-center text-sm py-2 border-b border-gray-700 z-10">
                {date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
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
              {dayTasks.map(task => {
                const start = parseMinutesFromMidnight(task.startTime);
                const end = parseMinutesFromMidnight(task.endTime);
                const height = (end - start) * SLOT_HEIGHT;
                const top = start * SLOT_HEIGHT;

                return (
                  <div
                    key={task.id}
                    className="absolute left-2 right-2 bg-green-600/80 text-xs text-white px-2 py-1 rounded-md shadow-md overflow-hidden"
                    style={{ top, height }}
                  >
                    {task.title}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
