'use client';
import React, { useEffect, useState } from 'react';

type Task = {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
};

const MINUTES_IN_DAY = 1440;
const SLOT_HEIGHT = 20; // 1 minute = ? px

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

const formatDate = (d: Date) => d.toLocaleDateString('en-CA'); // Format: yyyy-mm-dd  //Used to compare only the date portion (ignores time), for matching task dates.

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

  const baseDate = new Date(`${year}-${parseInt(month)+1}-${day}`); //YYYY-MM-DD => proper format like in write in real


  //Builds an array of 7 Dates: from day-1 to day+5. 
  //Used to render each day's column.
  const daysArray = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i - 1); 
    return date;
  });

  const timeSlots = generateTimeSlots(); //Creates the array of minute labels once.

  useEffect(() => {
    setTasks([
        {
          id: '1',
          title: 'Morning Routine',
          //in below + 1 in month added as we have to write YYYY_MM-DD in proper look 
          startTime: new Date(new Date(`${year}-${parseInt(month)+1}-${day}`).getTime() +  60 * 60 * 1000 + 8 * 60 * 60 * 1000),
          endTime: new Date(new Date(`${year}-${parseInt(month)+1}-${day}`).getTime() + 60 * 60 * 1000 + 9 * 60 * 60 * 1000),
        },
      ]);
         
  }, [day, month, year]);

//   useEffect(()=> {
//     console.log("taksks", tasks);
//     console.log("today", baseDate);
//   }, [tasks])

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
            const taskDateStr = formatDate(task.startTime);
            const currDateStr = formatDate(date);
            return taskDateStr === currDateStr;
          });          

          return (
            <div key={dayIndex} className="relative w-48 border-l border-gray-800">
              {/* Sticky Day Header */}
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
