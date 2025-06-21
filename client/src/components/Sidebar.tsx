"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Youtube, Quote } from "lucide-react";

const navItems = [
  { href: "/in/content/videos", label: "Shorts", icon: <Youtube size={22} /> },
  { href: "/in/content/quotes", label: "Quotes", icon: <Quote size={22} /> },
];

export default function MiniSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-16 flex flex-col items-center py-4 fixed">
      <div className="flex flex-col gap-10 mt-8">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`p-2 rounded-full transition duration-200 flex items-center justify-center border border-x-amber-950
                ${
                  isActive
                    ? "bg-gradient-to-br from-[#00c853] to-[#b2ff59] text-black shadow-lg"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              title={item.label}
            >
              {item.icon}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
