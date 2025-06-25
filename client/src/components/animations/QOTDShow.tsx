"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function FeatureQOTDImage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6 py-24 overflow-hidden">
      <div className="relative max-w-3xl w-full m-10" ref={ref}>
        {/* Aura */}
        <div className="absolute -inset-6 rounded-3xl z-[-1] blur-2xl opacity-30 m-10 bg-gradient-to-r from-[#00c853] to-[#b2ff59] animate-pulse" />

        <motion.div
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-[0_0_40px_#00c85344] flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2
            className="text-white text-3xl font-extrabold text-center tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-green-400 to-lime-300 bg-clip-text text-transparent drop-shadow-lg">
              A daily quote & AI-generated image — made just for you
            </span>
          </motion.h2>

          {/* AI Generated Image */}
          <motion.img
            src="/success.png"
            alt="AI Image based on quote"
            className="rounded-xl h-100 w-70 max-w-md border border-zinc-700 shadow-xl"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.3, duration: 1 }}
          />

          {/* Quote Text */}
          <motion.p
            className="text-lg text-zinc-300 italic text-center max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            "Success doesn’t come from what you do occasionally, it comes from
            what you do consistently."
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
