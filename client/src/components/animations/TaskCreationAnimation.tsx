"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

export default function FeatureTaskCreation() {
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [taskComplete, setTaskComplete] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const fullText = "Task Title: Buy groceries";
    let index = 0;
    const typing = setInterval(() => {
      setTypedText((prev) => prev + fullText[index]);
      index++;
      if (index === fullText.length - 1) {
        clearInterval(typing);
        setTimeout(() => setTaskComplete(true), 2000);
      }
    }, 60);
    return () => clearInterval(typing);
  }, []);

  useEffect(() => {
    const blink = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    if (taskComplete) {
      controls.start({
        boxShadow: [
          "0 0 40px #00c85355",
          "0 0 80px #00c85388",
          "0 0 50px #00c85355",
        ],
        transition: { duration: 1.2 },
      });
    }
  }, [taskComplete, controls]);

  return (
    <section className="m-5 min-h-scree flex items-center justify-center px-4 py-20">
      <motion.div
        animate={controls}
        initial={{
          opacity: 0,
          scale: 0.94,
          boxShadow: "0 0 30px #00c85322",
        }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-xl w-full space-y-6 backdrop-blur-lg"
      >
        {/* Header */}
        <motion.h2
          className="text-white text-3xl font-extrabold text-center tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-green-400 to-lime-300 bg-clip-text text-transparent drop-shadow-lg">
            Create Smarter Tasks, Instantly
          </span>
        </motion.h2>

        <motion.p
          className="text-zinc-400 text-center text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Add reminders, images, and voice notes — all in one flow
        </motion.p>

        {/* Task Box */}
        <motion.div
          className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 space-y-5 shadow-inner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* Typing input */}
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="w-full bg-zinc-900 rounded-xl px-4 py-3 text-white text-base border border-zinc-700 shadow-inner tracking-wide font-mono overflow-x-auto whitespace-nowrap">
              {typedText}
              {showCursor && <span className="animate-blink">|</span>}
            </div>
          </motion.div>

          {/* 3 Image Uploads with Z-depth entry */}
          <div className="flex justify-left pt-2 gap-3">
            <motion.img
              src="/task1.png"
              alt="img1"
              className="w-20 h-20 object-cover rounded-xl border border-zinc-600 shadow-xl"
              initial={{ opacity: 0, x: -30, rotate: -6 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ delay: 1.2, type: "spring", bounce: 0.4 }}
            />
            <motion.img
              src="/task2.png"
              alt="img2"
              className="w-20 h-20 object-cover rounded-xl border border-zinc-600 shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, type: "spring", bounce: 0.4 }}
            />
            <motion.img
              src="/task3.avif"
              alt="img3"
              className="w-20 h-20 object-cover rounded-xl border border-zinc-600 shadow-xl"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.0, type: "spring", bounce: 0.6 }}
            />
          </div>

          {/* Mic Voice Note Pulse */}
          <motion.div
            className="flex items-center space-x-3 pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            <motion.div
              className="w-10 h-10 bg-green-600 text-white flex items-center justify-center rounded-full shadow-lg"
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  "0 0 10px #00c853aa",
                  "0 0 18px #00c853cc",
                  "0 0 10px #00c853aa",
                ],
              }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              🎤
            </motion.div>
            <p className="text-sm text-zinc-400">Voice note recorded</p>
          </motion.div>

          {/* Reminder Info */}
          <motion.div
            className="text-sm text-zinc-300 pt-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.0 }}
          >
            ⏰ Reminder set:{" "}
            <motion.span
              className="text-green-400 font-semibold"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ delay: 3.2, duration: 0.4 }}
            >
              Today, 5:00 PM
            </motion.span>
          </motion.div>

          {/* Final Checkmark ✅ */}
          <motion.div
            className="text-green-400 text-3xl text-center pt-6" // ⬅️ was text-5xl
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.4, 0.95, 1],
              opacity: [0, 1],
            }}
            transition={{
              delay: 3.8,
              duration: 0.8,
              type: "tween",
              ease: "easeOut",
            }}
          >
            <motion.span
              className="inline-block"
              initial={{ filter: "drop-shadow(0 0 0px #00c853)" }}
              animate={{
                filter: [
                  "drop-shadow(0 0 0px #00c853)",
                  "drop-shadow(0 0 10px #00c853aa)",
                  "drop-shadow(0 0 20px #00c85388)",
                  "drop-shadow(0 0 12px #00c85344)",
                ],
              }}
              transition={{
                delay: 4.0,
                duration: 1,
                ease: "easeOut",
              }}
            >
              ✅
            </motion.span>
          </motion.div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          onClick={() => {
            const el = document.getElementById("SchedrixLogIn");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="cursor-pointer w-full mt-4 bg-gradient-to-r from-green-500 to-lime-400 hover:from-green-600 hover:to-lime-500 text-white font-bold py-3 px-6 rounded-full shadow-2xl text-md tracking-wide"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.6 }}
        >
          Try Creating One Now →
        </motion.button>
      </motion.div>
    </section>
  );
}
