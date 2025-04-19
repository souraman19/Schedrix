'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TaskFilter() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [dateMode, setDateMode] = useState<'all' | 'selected'>('all');
  const [isLocked, setIsLocked] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

  const handleApply = () => {
    console.log({ status, priority, dateMode, isLocked, isFixed });
  };

  const handleClear = () => {
    setStatus('');
    setPriority('');
    setDateMode('all');
    setIsLocked(false);
    setIsFixed(false);
  };

  return (
    <div className="bg-[#1a1a1a]/70 backdrop-blur-md rounded-2xl text-white shadow-[0_0_14px_#00000066] transition-all duration-300 overflow-hidden">
      {/* Toggle Header (styled) */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center px-6 py-5 cursor-pointer hover:bg-white/5 transition-colors"
      >
         <h2 className="text-lg font-semibold mb-2 text-green-400">🎯 Filter Tasks</h2>
        <span className="text-2xl transition-transform duration-300">
          {isOpen ? '▲' : '▼'}
        </span>
      </div>

      {/* Collapsible Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="filter-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Status */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-white/70">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-[#2a2a2a] text-white rounded-lg px-4 py-2 border border-transparent hover:border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="inprogress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Priority */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-white/70">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="bg-[#2a2a2a] text-white rounded-lg px-4 py-2 border border-transparent hover:border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                >
                  <option value="">All</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Date Mode */}
              <div className="flex flex-col gap-2">
                <label className="text-sm text-white/70">Date</label>
                <select
                  value={dateMode}
                  onChange={(e) => setDateMode(e.target.value as 'all' | 'selected')}
                  className="bg-[#2a2a2a] text-white rounded-lg px-4 py-2 border border-transparent hover:border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                >
                  <option value="all">All</option>
                  <option value="selected">Selected</option>
                </select>
              </div>

              {/* Locked Toggle */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-white/70">Locked</span>
                <div
                  onClick={() => setIsLocked(!isLocked)}
                  className={`w-14 h-8 rounded-full p-1 flex items-center transition-all duration-300 cursor-pointer ${
                    isLocked ? 'bg-white/80' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                      isLocked ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Fixed Toggle */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-white/70">Fixed</span>
                <div
                  onClick={() => setIsFixed(!isFixed)}
                  className={`w-14 h-8 rounded-full p-1 flex items-center transition-all duration-300 cursor-pointer ${
                    isFixed ? 'bg-white/80' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                      isFixed ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={handleApply}
                className="bg-gradient-to-r from-[#00c853] to-[#b2ff59] text-black font-semibold px-6 py-2 rounded-full shadow-[0_0_10px_#00c85355] hover:scale-105 transition-transform"
              >
                Apply Filters
              </button>
              <button
                onClick={handleClear}
                className="bg-[#2e2e2e] text-white font-medium px-6 py-2 rounded-full hover:bg-[#3a3a3a] transition-all border border-white/10"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
