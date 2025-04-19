'use client';

import React, { useState } from 'react';
import {
  Lock,
  LockOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Coins,
  Clock,
  Flag,
  Info,
  Timer,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

const TaskCard = ({ task }: { task: any }) => {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const deadline = task.deadLine ? new Date(task.deadLine) : null;
  const createdAt = task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A';
  const endTime = task.endTime ? new Date(task.endTime).toLocaleString() : 'N/A';
  const duration = task.duration ? `${task.duration} min` : 'N/A';

  // Check if the task is overdue
  const isOverdue = deadline && new Date() > deadline;

  return (
    <div
      className={clsx(
        'bg-[#121212] rounded-2xl p-6 border border-[#2e2e2e] transition-all duration-300 ease-in-out shadow-lg shadow-[#00c85322] hover:shadow-[#b2ff5933]',
        expanded && 'shadow-[#00c85355] scale-[1.015]'
      )}
    >
      {/* Top Row */}
      <div
        className="flex items-center justify-between gap-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Title + Priority */}
        <div>
          <h3 className="text-2xl font-semibold text-[#b2ff59] tracking-wide mb-1">
            {task.title}
          </h3>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityStyle(
              task.priority
            )}`}
          >
            {task.priority.toUpperCase()}
          </span>
        </div>

        {/* Lock Status */}
        <div className="text-sm text-gray-400 flex flex-col items-center">
          {task.isLocked ? (
            <>
              <Lock size={22} className="text-red-500 mb-1" />
              <span className="text-xs font-medium">Locked</span>
            </>
          ) : (
            <>
              <LockOpen size={22} className="text-green-400 mb-1" />
              <span className="text-xs font-medium">Unlocked</span>
            </>
          )}
        </div>

        {/* Status + Deadline */}
        <div className="flex flex-col items-end text-sm text-gray-300">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(task.status)}`}>
            {task.status.toUpperCase()}
          </span>
          {task.status === 'pending' && deadline && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
              <Calendar size={14} />
              <span>{deadline.toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Section */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          expanded ? 'max-h-[1000px] opacity-100 mt-5' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-[#333] pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
          <DetailRow icon={<Flag size={16} />} label="Category" value={task.category || 'N/A'} />
          <DetailRow icon={<Clock size={16} />} label="Created At" value={createdAt} />
          <DetailRow icon={<Clock size={16} />} label="End Time" value={endTime} />
          <DetailRow icon={<Timer size={16} />} label="Duration" value={duration} />
          <DetailRow icon={<Info size={16} />} label="Is Fixed" value={task.isFixed ? 'Yes' : 'No'} />

          {task.userInput?.text && (
            <div className="col-span-2">
              <p className="font-semibold mb-1">Description:</p>
              <p className="text-gray-400 bg-[#191919] p-3 rounded-xl border border-[#2c2c2c] leading-relaxed">
                {task.userInput.text}
              </p>
            </div>
          )}

          {/* Show coins if completed, overdue, or passed the fixed time */}
          {(task.status === 'completed' || 'overdue') && (
            <div className="flex items-center gap-2 text-yellow-400 font-semibold">
              <Coins size={20} />
              {task.totalPointsContributed} pts
            </div>
          )}

          {/* Redirect Button */}
          <div className="col-span-2 text-right">
            <button
              className="mt-4 px-6 py-2 bg-gradient-to-r from-[#00c853] to-[#b2ff59] hover:from-[#00e676] hover:to-[#ccff90] text-black font-bold rounded-full flex items-center gap-2 ml-auto shadow-md shadow-[#00c85355] hover:shadow-[#b2ff5944]"
              onClick={() => router.push(`/task/${task._id}`)}
            >
              View Full Task
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Expand/Collapse Icon */}
      <div className="flex justify-center mt-4">
        {expanded ? (
          <ChevronUp className="text-gray-500 hover:text-white cursor-pointer" onClick={() => setExpanded(false)} />
        ) : (
          <ChevronDown className="text-gray-500 hover:text-white cursor-pointer" onClick={() => setExpanded(true)} />
        )}
      </div>
    </div>
  );
};

export default TaskCard;

// 🔹 Reusable detail row component
const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
}) => (
  <div className="flex items-center gap-2">
    {icon}
    <span className="font-semibold text-white">{label}:</span>
    <span className="text-gray-400">{value}</span>
  </div>
);

// 🔹 Style helpers
const getPriorityStyle = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'critical':
      return 'bg-gradient-to-r from-red-700 to-red-500 text-white shadow-md shadow-red-900';
    case 'high':
      return 'bg-gradient-to-r from-orange-600 to-yellow-500 text-white shadow-md shadow-orange-800';
    case 'medium':
      return 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-black shadow-md shadow-yellow-700';
    case 'low':
      return 'bg-gradient-to-r from-green-600 to-green-400 text-white shadow-md shadow-green-800';
    default:
      return 'bg-gray-700 text-gray-200';
  }
};

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-900 text-yellow-300 shadow-md shadow-yellow-700';
    case 'completed':
      return 'bg-green-900 text-green-300 shadow-md shadow-green-700';
    case 'missed':
      return 'bg-red-900 text-red-300 shadow-md shadow-red-700';
    default:
      return 'bg-gray-800 text-gray-300';
  }
};
