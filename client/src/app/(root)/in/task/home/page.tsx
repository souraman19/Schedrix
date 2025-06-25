'use client';

import CalendarView from '@/components/task/CalenderView';
import FilterBar from '@/components/task/FilterBar';
import TaskResult from '@/components/task/TaskList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { GET_FILTERED_TASKS_ROUTE } from '@/lib/apiRoutes';
import { toast } from 'sonner';
import AddTaskButton from '@/components/ui/AddTaskButton';

export default function TaskHomePage() {

    const [chosenYear, setChosenYear] = useState(new Date().getFullYear());
    const [chosenMonth, setChosenMonth] = useState(new Date().getMonth());
    const [chosenDate, setChosenDate] = useState(new Date().getDate());
    

    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState("all");
    const [priority, setPriority] = useState("all");
    const [dateMode, setDateMode] = useState<"selected" | "last3" | "last7" | "all">("selected");
    const [dateField, setDateField] = useState<"createdOn" | "deadline" | "startsOn">("createdOn");
    const [category, setCategory] = useState("all");
    const [isLocked, setIsLocked] = useState(false);
    const [isFixed, setIsFixed] = useState(false);
    
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        const data = {
            status: status,
            priority: priority,
            dateMode: dateMode,
            isLocked: isLocked,
            isFixed: isFixed,
            month: chosenMonth,
            year: chosenYear,
            date: chosenDate,
            dateField: dateField,
            category: category,
        }
        
        try{
            const response : Response = await fetch(`${GET_FILTERED_TASKS_ROUTE}`,{
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },  
                credentials: "include",
            })

            if(response.ok){
                const result = await response.json();
                // console.log("Tasks fetched successfully: ", result);
                setTasks(result.tasks);
            } else {
                const error = await response.json();
                // console.error("Error fetching tasks: ", error);
                // toast.error("Failed to fetch tasks!");
            }
            
        }catch(err){
            // console.error("Error fetching tasks: ", err);
            // console.log("Data: ", data);
        }
    }

    useEffect(() => {
        fetchTasks();
    }, [])

  return (
    <div className="flex h-full p-4 gap-4">
      {/* Left side: Calendar */}
      <div className="w-2/7 bg-[#1a1a1a] rounded-xl p-4 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-green-400">Calendar</h2>
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
      <div className="w-5/7 flex flex-col gap-4">
        {/* Top: Filter */}
        <div className="bg-[#1a1a1a] rounded-xl p-4 shadow-lg">
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

        {/* Bottom: Result */}
        <div className="bg-[#1a1a1a] rounded-xl p-4 shadow-lg flex-1 overflow-auto">
          <h2 className="text-lg font-semibold mb-2 text-green-400">Tasks</h2>
          <TaskResult  tasks = {tasks}/>
        </div>
      </div>

      <div className="fixed bottom-9 right-8">
        <AddTaskButton />
      </div>
    </div>
  );
}
