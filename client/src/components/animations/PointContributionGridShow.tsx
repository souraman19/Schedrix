"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weeks = 52; // 30 columns

const getRandomValue = () => Math.floor(Math.random() * 5); // 0–4 scale

export default function FeatureProductivityHeatmap() {
  const [data, setData] = useState<number[][]>([]);

  useEffect(() => {
    const newData: number[][] = Array.from({ length: weeks }, () =>
      Array.from({ length: 7 }, getRandomValue)
  );

    let week = 0;
    const interval = setInterval(() => {
      setData((prev) => {
        const next = [...prev];
        next[week] = newData[week];
        return next;
      });
      week++;
      if (week >= weeks) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const colorScale = [
    "bg-zinc-800",
    "bg-lime-900",
    "bg-lime-700",
    "bg-lime-500",
    "bg-lime-300",
  ];

  return (
    <section className="min-h-[60vh] bg-gradient-to-b from-black to-zinc-900 flex flex-col items-center justify-center py-20 px-4"
      style={{ borderRadius: "1.5rem" }}>
      <div className="relative max-w-6xl px-12 w-full flex flex-col items-center"
        
      >
        {/* Glowing Aura Behind Grid */}
        <div className="absolute -inset-8 bg-gradient-to-r from-[#00c853] to-[#b2ff59] blur-2xl opacity-25 rounded-3xl animate-pulse z-[-1]" />

        <motion.h2
          className="text-white text-3xl font-bold mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Your Productivity Grid
        </motion.h2>

        <motion.p
          className="text-zinc-400 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          See your productivity journey unfold.
        </motion.p>

        <div className="flex gap-1">
          {Array.from({ length: weeks }).map((_, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {days.map((_, dIdx) => (
                <motion.div
                  key={dIdx}
                  className={`w-4 h-4 rounded-sm ${colorScale[data[wIdx]?.[dIdx] || 0]}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: wIdx * 0.03 + dIdx * 0.01 }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
