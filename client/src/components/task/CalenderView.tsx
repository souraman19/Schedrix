'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { number } from 'zod';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarView({chosenDate, chosenMonth, chosenYear, setChosenYear, setChosenMonth, setChosenDate}: {chosenDate: number, chosenMonth: number, chosenYear: number, setChosenYear: (chosenYear: number) => void, setChosenMonth: (chosenMonth: number) => void, setChosenDate: (date: number) => void}) {
  const today = new Date().getDate();

  const handlePrevMonth = () => {
    if (chosenMonth === 0) {
      setChosenMonth(11);
      setChosenYear(prev  => prev - 1);
    } else {
      setChosenMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (chosenMonth === 11) {
      setChosenMonth(0);
      setChosenYear(prev => prev + 1);
    } else {
      setChosenMonth(prev => prev + 1);
    }
  };

  const getDaysInMonth = (chosenMonth: number, chosenYear: number) => {
    return new Date(chosenYear, chosenMonth + 1, 0).getDate();
  };

  const days = getDaysInMonth(chosenMonth, chosenYear);
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
          {months[chosenMonth]} {chosenYear}
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
        {Array(new Date(chosenYear, chosenMonth, 1).getDay()).fill('').map((_, i) => (
          <div key={`empty-${i}`}></div>
        ))}

        {daysArray.map(day => (
          <div
            key={day}
            id='day'
            className={`p-2 rounded-md 
              ${day === chosenDate ? 'bg-green-500'  : ''} 
              ${day !== today && day !== chosenDate ? 'hover:bg-green-700/30' : ''}
              ${day === today && day !== chosenDate ? 'bg-red-300' : ''}
              transition cursor-pointer`}
            onClick={() => setChosenDate(day)}
            
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
