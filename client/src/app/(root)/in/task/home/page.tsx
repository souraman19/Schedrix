'use client';

import CalendarView from '@/components/task/CalenderView';
import FilterBar from '@/components/task/FilterBar';
import TaskResult from '@/components/task/TaskList';
import { useCallback, useEffect, useState } from 'react';
import { GET_FILTERED_TASKS_ROUTE } from '@/lib/apiRoutes';
import AddTaskButton from '@/components/ui/AddTaskButton';

export default function TaskHomePage() {
  const [chosenYear, setChosenYear] = useState<number>(new Date().getFullYear());
  const [chosenMonth, setChosenMonth] = useState<number>(new Date().getMonth());
  const [chosenDate, setChosenDate] = useState<number>(new Date().getDate());

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("all");
  const [priority, setPriority] = useState<string>("all");
  const [dateMode, setDateMode] = useState<"selected" | "last3" | "last7" | "all">("selected");
  const [dateField, setDateField] = useState<"createdOn" | "deadline" | "startsOn">("createdOn");
  const [category, setCategory] = useState<string>("all");
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isFixed, setIsFixed] = useState<boolean>(false);

  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(async () => {
    const data = {
      status,
      priority,
      dateMode,
      isLocked,
      isFixed,
      month: chosenMonth,
      year: chosenYear,
      date: chosenDate,
      dateField,
      category,
    };

    try {
      const response = await fetch(`${GET_FILTERED_TASKS_ROUTE}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        setTasks(result.tasks);
      } else {
        // const error = await response.json();
        // handle error
      }
    } catch (err) {
      // handle error
      console.log(err);
    }
  }, [status, priority, dateMode, isLocked, isFixed, chosenMonth, chosenYear, chosenDate, dateField, category]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="flex flex-col lg:flex-row h-full p-2 md:p-4 gap-4">
      {/* Left side: Calendar */}
      <div className="w-full lg:w-2/7 bg-[#1a1a1a] rounded-xl p-3 md:p-4 shadow-lg">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-green-400">Calendar</h2>
        <CalendarView
          chosenYear={chosenYear}
          chosenMonth={chosenMonth}
          chosenDate={chosenDate}
          setChosenYear={setChosenYear}
          setChosenMonth={setChosenMonth}
          setChosenDate={setChosenDate}
          fetchTasks={fetchTasks}
        />
      </div>

      {/* Right side */}
      <div className="w-full lg:w-5/7 flex flex-col gap-4">
        {/* Filter Bar */}
        <div className="bg-[#1a1a1a] rounded-xl p-3 md:p-4 shadow-lg">
          <FilterBar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            status={status}
            setStatus={setStatus}
            priority={priority}
            setPriority={setPriority}
            dateMode={dateMode}
            setDateMode={setDateMode}
            isLocked={isLocked}
            setIsLocked={setIsLocked}
            isFixed={isFixed}
            setIsFixed={setIsFixed}
            fetchTasks={fetchTasks}
            dateField={dateField}
            setDateField={setDateField}
            category={category}
            setCategory={setCategory}
          />
        </div>

        {/* Task Result */}
        <div className="bg-[#1a1a1a] rounded-xl p-3 md:p-4 shadow-lg flex-1 overflow-auto">
          <h2 className="text-lg md:text-xl font-semibold mb-2 text-green-400">Tasks</h2>
          <TaskResult tasks={tasks} />
        </div>
      </div>

      {/* Floating Add Task Button */}
      <div className="fixed bottom-4 right-4 md:bottom-9 md:right-8 z-50">
        <AddTaskButton />
      </div>
    </div>
  );
}
