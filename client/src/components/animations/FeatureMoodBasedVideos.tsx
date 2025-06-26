"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

const moodSequence = [
  { label: "Default", emoji: "🔄" },
  { label: "Stressed", emoji: "⚠️" },
];

const dummyVideos = [
  {
    title: "How to Stay Calm Under Pressure",
    thumbnail: "/calm.png",
  },
  {
    title: "5 Minute Breathing Exercise",
    thumbnail: "/breathe.jpg",
  },
  {
    title: "Overcoming Overwhelm - Motivation",
    thumbnail: "/overwhelm.jpg",
  },
];

export default function FeatureMoodBasedVideos() {
  const [step, setStep] = useState(0); // 0 = default, 1 = stressed, 2 = show videos

  useEffect(() => {
    const delays = [1500, 1500];
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
    <section className="min-h-[80vh] flex flex-col items-center justify-center py-24 px-6 bg-gradient-to-b from-black to-zinc-900 overflow-hidden">
      <div className="relative w-full max-w-5xl">
        {/* Aura */}
        <div className="absolute -inset-5 rounded-3xl bg-gradient-to-r from-[#00c853] to-[#b2ff59] blur-2xl opacity-25 animate-pulse z-[-1]" />

        <motion.div
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-[0_0_40px_#00c85333]"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Mood Status Display */}
          <motion.div
            className="text-center text-2xl font-bold text-white flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {step >= 1 ? moodSequence[1].emoji : moodSequence[0].emoji}
            <span className="text-green-400">
              {step >= 1 ? moodSequence[1].label : moodSequence[0].label}
            </span>
          </motion.div>

          {/* Motivational Video Grid */}
          {step >= 2 && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {dummyVideos.map((video, idx) => (
                <motion.div
                  key={idx}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-lg hover:shadow-green-500/20 transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + idx * 0.2 }}
                >
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 text-white text-sm font-medium text-center">
                    {video.title}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Caption */}
          {step >= 2 && (
            <motion.div
              className="mt-8 text-green-400 text-md text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              “Get the right videos when you need it most.”
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
