"use client";

import Link from "next/link";

export default function AddTaskButton() {
  return (
    <Link href="/in/task/add" className="no-underline">
      <button
        className="cursor-pointer z-50 group
               rounded-full p-[4px] bg-gradient-to-tr from-[#00c853] to-[#b2ff59]
               hover:from-[#00e676] hover:to-[#ccff90]
               transition-all duration-300 shadow-[0_0_20px_#00c85388] animate-pulse"
        title="Add Task"
        aria-label="Add Task"
      >
        <div
          className="flex items-center justify-center w-13 h-13
                 rounded-full bg-gray-700 bg-opacity-90 
                 text-white text-3xl font-bold 
                 border-[3px] border-[#b2ff59] 
                 shadow-inner shadow-[#00c85355] 
                 group-hover:scale-105 group-hover:shadow-[0_0_25px_#b2ff5988]
                 transition-all duration-300 ease-in-out"
        >
          ➕
        </div>
      </button>
    </Link>
  );
}
