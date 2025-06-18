'use client';

import React, { useState } from "react";


export default function BoostHomePage() {
  const [quotes, setQuotes] = useState([]);
  const [mindStatus, setMindStatus] = useState("Default");

  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Boost Your Mind</h1>
      <p className="text-lg text-gray-700 mb-8">
        Coming soon! Stay tuned for exciting updates.
      </p>
      <img
        src="/images/coming-soon.svg"
        alt="Coming Soon"
        className="w-64 h-64"
      />
    </div>
  );
}