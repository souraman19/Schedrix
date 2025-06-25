"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const repeatPattern = [1, 3, 5]; // Mon, Wed, Fri

export default function FeatureRecurringTasks() {
  const [activeDays, setActiveDays] = useState<number[]>([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let index = 0;
    const delays = [800, 800, 800, 400];

    if (step === 2) {
      const interval = setInterval(() => {
        setActiveDays((prev) => [...prev, repeatPattern[index]]);
        index++;
        if (index >= repeatPattern.length) {
          setTimeout(() => setStep(3), delays[3]);
          clearInterval(interval);
        }
      }, 600);
      return () => clearInterval(interval);
    } else {
      const timer = setTimeout(() => setStep(step + 1), delays[step]);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="relative z-10">
      <div className="absolute -inset-1 bg-gradient-to-r from-[#00c853] to-[#b2ff59] opacity-30 blur-2xl rounded-3xl animate-pulse z-[-1]" />
      <section 
        style={{borderRadius: "1.5rem"}}
      className="min-h-[60vh] bg-gradient-to-b from-zinc-900 to-black flex flex-col items-center justify-center py-20 px-20">

        <motion.div
          className="max-w-xl w-full space-y-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
          className="text-white text-3xl font-extrabold text-center tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-green-400 to-lime-300 bg-clip-text text-transparent drop-shadow-lg">
            Repetitive Tasks Made Easy
          </span>
        </motion.h2>
          <p className="text-zinc-400">
            Save time with smart recurring task creation
          </p>

          {/* Step 0: Repeat every 1 week */}
          <motion.div
            className="mt-6 text-green-300 font-medium text-sm flex items-center justify-center gap-2 flex-wrap"
            initial={{ opacity: 0, y: 10 }}
            animate={step >= 0 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span>Repeats in every</span>
            <motion.div
              className="px-3 py-1 bg-zinc-800 border border-zinc-600 rounded-md text-green-400 font-semibold"
              initial={{ scale: 0 }}
              animate={step >= 0 ? { scale: 1 } : {}}
              transition={{ delay: 0.5, type: "spring", bounce: 0.4 }}
            >
              2
            </motion.div>
            <motion.div
              className="px-3 py-1 bg-zinc-800 border border-zinc-600 rounded-md text-green-400 font-semibold"
              initial={{ scale: 0 }}
              animate={step >= 0 ? { scale: 1 } : {}}
              transition={{ delay: 0.8, type: "spring", bounce: 0.4 }}
            >
              weeks
            </motion.div>
          </motion.div>

          {/* Day Buttons */}
          <div className="grid grid-cols-7 gap-3 mt-10">
            {days.map((day, idx) => (
              <motion.div
                key={day}
                className={`rounded-xl border border-zinc-700 px-3 py-6 text-sm text-white font-medium relative h-24 flex flex-col items-center justify-center transition-all duration-300 ${
                  activeDays.includes(idx)
                    ? "bg-green-600/20 shadow-[0_0_20px_#00c85355]"
                    : "bg-zinc-800"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.08 }}
              >
                {day}
                {activeDays.includes(idx) && (
                  <motion.div
                    className="absolute top-2 right-2 text-green-400 text-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    ✅
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Step 3: Ends after 4 times */}
          <motion.div
            className="mt-6 text-zinc-400 text-sm flex items-center justify-center gap-2 flex-wrap"
            initial={{ opacity: 0 }}
            animate={step >= 3 ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <span>Ends after</span>
            <motion.div
              className="px-3 py-1 bg-zinc-800 border border-zinc-600 rounded-md text-green-400 font-semibold"
              initial={{ scale: 0 }}
              animate={step >= 3 ? { scale: 1 } : {}}
              transition={{ delay: 0.6, type: "spring", bounce: 0.4 }}
            >
              4
            </motion.div>
            <span>times</span>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
