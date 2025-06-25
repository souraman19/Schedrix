"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const mindStatusList = [
  { label: "Focused", emoji: "✅" },
  { label: "Distracted", emoji: "❗" },
  { label: "Tired", emoji: "😴" },
  { label: "Stressed", emoji: "⚠️" },
  { label: "Motivated", emoji: "💪" },
  { label: "Default", emoji: "🔄" },
];

const mockData = [
  "Default",
  "Focused",
  "Motivated",
  "Distracted",
  "Tired",
  "Stressed",
  "Focused",
];

const statusColor = {
  Focused: "#00e676",
  Distracted: "#ff9100",
  Tired: "#90a4ae",
  Stressed: "#f44336",
  Motivated: "#29b6f6",
  Default: "#9e9e9e",
};

export default function FeatureMindStatusTracking() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= mockData.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="min-h-[60vh] flex px-12 items-center mt-15 justify-center py-24 px-4 bg-gradient-to-b from-black to-zinc-900"
      style={{ borderRadius: "1.5rem" }}
    >
      <div className="relative w-full max-w-4xl p-6 rounded-3xl border border-zinc-800 bg-zinc-900 shadow-[0_0_30px_#00c85333]">
        {/* Aura */}
        <div className="absolute -inset-8 z-[-1] rounded-3xl blur-3xl bg-gradient-to-r from-[#00c853] to-[#b2ff59] opacity-25 animate-pulse" />
        <motion.h2
          className="text-white text-3xl font-extrabold text-center tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="drop-shadow-lg flex gap-4 m-3">
            <span>🤖</span>
            <span className="bg-gradient-to-r from-green-400 to-lime-300 bg-clip-text text-transparent">
              MindStatus Tracking
            </span>
          </span>
        </motion.h2>

        <div className="flex flex-col items-center gap-10">
          {/* Animated Line */}
          <svg viewBox="0 0 700 100" className="w-full max-w-3xl">
            <polyline
              fill="none"
              stroke="#00c853"
              strokeWidth="3"
              points={mockData
                .slice(0, step + 1)
                .map((status, i) => `${i * 100},${100 - i * 10}`)
                .join(" ")}
              className="transition-all duration-500 ease-in-out"
            />
            {mockData.slice(0, step + 1).map((status, i) => (
              <circle
                key={i}
                cx={i * 100}
                cy={100 - i * 10}
                r="6"
                fill={statusColor[status]}
              />
            ))}
          </svg>

          {/* Emoji */}
          <motion.div
            className="text-5xl"
            key={mockData[step]}
            initial={{ scale: 0.7, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {mindStatusList.find((s) => s.label === mockData[step])?.emoji}
          </motion.div>

          {/* Status Label */}
          <motion.div
            className="text-white text-xl font-semibold"
            key={`label-${mockData[step]}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {mockData[step]}
          </motion.div>

          <p className="text-zinc-400 text-center mb-8">
            “AI understands your mind based on your habits.”
          </p>
        </div>
      </div>
    </section>
  );
}
