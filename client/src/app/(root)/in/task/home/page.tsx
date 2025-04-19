'use client';

import CalendarView from '@/components/task/CalendarView';
import FilterBar from '@/components/task/FilterBar';
import TaskResult from '@/components/task/TaskResult';

export default function TaskHomePage() {
  return (
    <div className="flex h-full p-4 gap-4">
      {/* Left side: Calendar */}
      <div className="w-2/7 bg-[#1a1a1a] rounded-xl p-4 shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-green-400">Calendar</h2>
        <CalendarView />
      </div>

      {/* Right side */}
      <div className="w-5/7 flex flex-col gap-4">
        {/* Top: Filter */}
        <div className="bg-[#1a1a1a] rounded-xl p-4 shadow-lg">
          <FilterBar />
        </div>

        {/* Bottom: Result */}
        <div className="bg-[#1a1a1a] rounded-xl p-4 shadow-lg flex-1 overflow-auto">
          <h2 className="text-lg font-semibold mb-2 text-green-400">Results</h2>
          <TaskResult />
        </div>
      </div>
    </div>
  );
}
