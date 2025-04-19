'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarView() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(prev => prev - 1);
    } else {
      setMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(prev => prev + 1);
    } else {
      setMonth(prev => prev + 1);
    }
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const days = getDaysInMonth(month, year);
  const daysArray = Array.from({ length: days }, (_, i) => i + 1);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="text-gray-400 hover:text-white">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-green-400">
          {months[month]} {year}
        </h2>
        <button onClick={handleNextMonth} className="text-gray-400 hover:text-white">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 text-center text-sm text-gray-400 mb-2">
        {weekdays.map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 text-center gap-y-2 text-sm">
        {Array(new Date(year, month, 1).getDay()).fill('').map((_, i) => (
          <div key={`empty-${i}`}></div>
        ))}

        {daysArray.map(day => (
          <div
            key={day}
            className="p-2 rounded-md hover:bg-green-700/30 transition cursor-pointer"
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
