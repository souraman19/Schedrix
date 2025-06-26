"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const times = ["", " ", "8 am", "9 am", ".", "."];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CELL_WIDTH = 120;
const CELL_HEIGHT = 64;

export default function FeatureTaskRescheduling() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const delays = [1500, 1500, 2000];
    let current = 0;

    const advance = () => {
      if (current < delays.length) {
        setTimeout(() => {
          setStep((s) => s + 1);
          current++;
          advance();
        }, delays[current]);
      }
    };

    advance();
  }, []);

  return (
    <section className="min-h-[60vh] flex items-center justify-center py-20 px-4 overflow-hidden">
      <div className="relative max-w-5xl m-17 w-full overflow-visible">
        {/* Outer Aura — clearly around the card */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#00c853] to-[#b2ff59] opacity-30 blur-2xl rounded-3xl animate-pulse z-[-1]" />

        <motion.div
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-[0_0_30px_#00c85333] min-w-[800px]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
          className="mb-5 mt-7 text-white text-3xl font-extrabold text-center tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-green-400 to-lime-300 bg-clip-text text-transparent drop-shadow-lg">
            Visual Task Rescheduling
          </span>
        </motion.h2>

          <p className="text-zinc-400 text-center mb-6">
            Reschedule tasks by dragging across time and days.
          </p>

          <div className="grid grid-cols-8 border border-zinc-700 rounded-xl overflow-hidden">
            {/* Time Column */}
            <div className="bg-zinc-800 border-r border-zinc-700 p-2 text-white text-xs font-semibold flex flex-col gap-4 items-center">
              {times.map((t, ind) => (
                <div key={ind}>{t}</div>
              ))}
            </div>

            {/* Day Columns */}
            {days.map((day, colIdx) => (
              <div key={colIdx} className="flex flex-col border-r border-zinc-700">
                <div className="text-center text-white text-sm py-2 bg-zinc-800 border-b border-zinc-700 font-medium">
                  {day}
                </div>
                {times.map((_, rowIdx) => {
                  const targetCol = 2;
                  const targetRow = 4;
                  const isFinalPosition = colIdx === targetCol && rowIdx === targetRow;

                  return (
                    <div
                      key={rowIdx}
                      className="h-16 border-b border-zinc-800 relative"
                    >
                      {isFinalPosition && (
                        <motion.div
                          className="absolute left-1/2 -translate-x-1/2 w-28 text-sm text-black font-semibold px-3 py-2 rounded-xl bg-gradient-to-r from-green-500 to-lime-400 shadow-md"
                          initial={{
                            x: -2 * CELL_WIDTH,
                            y: -3 * CELL_HEIGHT,
                            opacity: 0.8,
                            scale: 0.95,
                          }}
                          animate={{
                            x: 0,
                            y: 0,
                            opacity: 1,
                            scale: 1,
                          }}
                          transition={{
                            duration: step >= 2 ? 1.2 : 0,
                            ease: "easeInOut",
                          }}
                        >
                          🧘‍♂️ Yoga
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Final Tooltip */}
          {step >= 3 && (
            <motion.div
              className="mt-6 text-green-400 text-center text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              ✅ Task rescheduled to Wednesday at 2 PM
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
