// components/Footer.tsx
"use client";

import { motion } from "framer-motion";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative mt-18 px-6 pb-10 pt-35 bg-black overflow-hidden">
      {/* AURA GLOW BG */}
      <div className="absolute inset-0 flex justify-center items-start">
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#00c853] to-[#b2ff59] blur-[140px] opacity-30 animate-pulse"></div>
      </div>

      {/* Glass Panel */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-6xl mx-auto rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-10 flex flex-col md:flex-row justify-between gap-10"
      >
        {/* Left Section: Logo + Tagline */}
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#00c853] to-[#b2ff59] bg-clip-text text-transparent drop-shadow-lg">
            Schedrix
          </h1>
          <p className="text-gray-400 text-sm mt-2 max-w-xs">
            Reshape your day with intelligent scheduling and task management.
          </p>
        </div>

        {/* Middle: Navigation */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Navigate</h2>
          <ul className="space-y-1 text-sm text-gray-400">
            {["About", "Features", "Support", "Privacy"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-white transition duration-300 hover:underline"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Socials */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Connect</h2>
          <div className="flex items-center gap-4 text-gray-400">
            <a
              href="https://github.com/souraman19"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="hover:text-white hover:scale-110 transition-all duration-300" />
            </a>
            <a
              href="https://x.com/souraman19"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="hover:text-white hover:scale-110 transition-all duration-300" />
            </a>
            <a
              href="https://linkedin.com/in/souraman19"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="hover:text-white hover:scale-110 transition-all duration-300" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Bottom copyright */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative z-10 text-center text-gray-500 text-xs mt-6"
      >
        © {new Date().getFullYear()} Schedrix · All rights reserved
      </motion.div>
    </footer>
  );
}
