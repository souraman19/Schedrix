"use client";

import React from "react";
import { useEffect } from "react";
import { AlarmClock } from "lucide-react";
import toast from "react-hot-toast";
import { Messaging } from "firebase/messaging";

export default function TokenGenerator() {
  useEffect(() => {
    const setup = async () => {
      const { generateToken } = await import("@/notifications/firebase");
      const { messaging}:{ messaging: Messaging } = await import("@/notifications/firebase");
      const { onMessage } = await import("firebase/messaging");

      await generateToken();
      onMessage(messaging, (payload) => {
        const { title, body } = payload.notification as any;
        toast.custom((t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-zinc-900 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-white/10`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5 text-green-400 animate-pulse">
                  <AlarmClock className="h-10 w-10" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-white">{title}</p>
                  <p className="mt-1 text-sm text-gray-400">{body}</p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-zinc-700">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-green-400 hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Close
              </button>
            </div>
          </div>
        ));
      });
    }
    setup().catch((error) => {
      console.error("Error setting up token generation:", error);
      toast.error("Failed to set up notifications.");
    });
  }, []);

  return <></>;
}
