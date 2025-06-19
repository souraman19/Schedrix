"use client";
import { motion } from "framer-motion";

export default function QuoteCard({ quote }: { quote: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="w-full max-w-2xl min-h-[220px] mx-auto bg-gradient-to-br from-[#0d0d0d] to-[#131313] border border-green-600/20 rounded-3xl p-8 shadow-[0_0_24px_#00c85333] hover:shadow-[0_0_32px_#00e67666] transition-all duration-300 group"
    >
      <div className="relative pl-6 m-3">
        {/* Quotation Icon */}
        <div className="absolute top-[-10px] left-[-12px] text-6xl text-green-500/10 group-hover:text-green-500/20 transition duration-300">
          “
        </div>

        {/* Quote Text */}
        <p className="text-lg sm:text-xl text-gray-100 font-light italic tracking-wide leading-snug">
          {quote.content}
        </p>

        {/* Author */}
        {quote.author && (
          <p className="mt-6 text-right text-green-400 text-sm font-semibold">
            — {quote.author}
          </p>
        )}

        {/* Tags */}
        {quote.tags && quote.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {quote.tags.map((tag: string, i: number) => (
              <span
                key={i}
                className="bg-green-900/10 text-green-300 text-xs sm:text-sm px-3 py-1 rounded-full border border-green-400/30 backdrop-blur-sm hover:bg-green-700/10 transition"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
