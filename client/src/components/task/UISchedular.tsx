"use client";


import React from "react";
import { useState } from "react";
import DayListOfMonth from "./DayListOfMonth";
import SchedularViewCenter from "./SchedularViewCenter";
import { HelpCircle } from "lucide-react";

export default function UISchedular({
  currYear,
  currMonth,
  currDay,
}: {
  currYear: string;
  currMonth: string;
  currDay: string;
}) {
  const [year, setYear] = useState(currYear);
  const [month, setMonth] = useState(currMonth);
  const [day, setDay] = useState(currDay);
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);



  return (
    <>
      <div className="fixed top-43 right-3 z-50">
        <button
          onClick={handleOpen}
          title="Help"
          className="cursor-pointer flex items-center gap-2 text-sm text-white bg-gr hover:bg-gray-700 px-3 py-1.5 rounded-full shadow"
        >
          <HelpCircle size={24} />
          Help
        </button>
      </div>

      <DayListOfMonth
        year={year}
        month={month}
        day={day}
        setYear={setYear}
        setMonth={setMonth}
        setDay={setDay}
      />

      <SchedularViewCenter year={year} month={month} day={day} />


       {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-[92%] max-w-2xl text-left overflow-y-auto max-h-[90vh]">
  <h2 className="text-2xl font-bold mb-4 text-black dark:text-white text-center">
    📅 How to Use the Scheduler
  </h2>

  <ul className="text-sm text-gray-800 dark:text-gray-300 space-y-3 pl-4">
    <li>🕒 <b>Left side</b> shows the timeline; <b>top</b> shows the days of the month.</li>
    <li>📆 Click any <b>day</b> to view its tasks along with the previous day and next 6 days.</li>
    <li>🧱 Each <b>cell</b> represents <b>1 minute</b> of time.</li>
    <li>🔍 Use the <b>Zoom Timeline Slider</b> to adjust cell size and granularity of the view.</li>
    <li>⏱️ Time gap between labels adapts as you zoom in/out.</li>
    <li>🎯 <b>Click & drag</b> a task vertically to reschedule it within the same day.</li>
    <li>🚫 For vertical drag/drop to work, ensure <b>Cross-day Drag</b> is turned <i>off</i>.</li>
    <li>🔄 To move tasks across days, turn <b>Cross-day Drag</b> <i>on</i>, drag to another day, and drop it.</li>
    <li>✅ After adjustments, click <b>Reschedule</b> to save changes.</li>
    <li>↩️ <b>Undo</b> restores the previous setup before rescheduling.</li>
    <li>⚠️ <b>Undo</b> only works before hitting the <b>Reschedule</b> button!</li>
  </ul>

  <div className="text-center mt-6">
    <button
      onClick={handleClose}
      className="cursor-pointer px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow-lg transition"
    >
      Got it!
    </button>
  </div>
</div>

        </div>
      )}
    </>
  );
}
