'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DayListOfMonth({
  year,
  month,
  day,
  setYear,
  setMonth,
  setDay,
}: {
  year: string;
  month: string;
  day: string;
  setYear: (y: string) => void;
  setMonth: (m: string) => void;
  setDay: (d: string) => void;
}) {
  const y = parseInt(year);
  const m = parseInt(month); //0 indexed
  const d = parseInt(day);

  const daysInMonth = new Date(y, m + 1, 0).getDate(); //day 0 of next month => last day of curr month to get total day count 
  const dayArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    const newDate = new Date(y, m - 1, 1);
    setYear(String(newDate.getFullYear()));
    setMonth(String(newDate.getMonth()));
    setDay('1');
  };

  const handleNextMonth = () => {
    const newDate = new Date(y, m + 1, 1);
    setYear(String(newDate.getFullYear()));
    setMonth(String(newDate.getMonth()));
    setDay('1');
  };

  return (
    <div className="w-full flex items-center justify-between bg-[#0d0d0d] border-b border-white/10 px-4 py-2 overflow-x-auto">
      {/* Left Button */}
      <button
        onClick={handlePrevMonth}
        className="text-gray-300 hover:text-green-400 transition"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Scrollable Day List */}
      <div className="flex gap-2 overflow-x-auto flex-1 px-4">
        {dayArray.map((dVal) => (
          <div
            key={dVal}
            onClick={() => setDay(String(dVal))}
            className={`min-w-[2rem] text-center px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ${
              dVal === d
                ? 'bg-gradient-to-r from-[#00c853] to-[#b2ff59] text-black shadow-md'
                : 'bg-gray-800 hover:bg-green-700/40 text-gray-300'
            }`}
          >
            {dVal}
          </div>
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={handleNextMonth}
        className="text-gray-300 hover:text-green-400 transition"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
