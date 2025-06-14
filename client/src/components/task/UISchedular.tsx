"use client";
import React from "react";
import { useState } from "react";
import DayListOfMonth from "./DayListOfMonth";
import SchedularViewCenter from "./SchedularViewCenter";

export default function UISchedular({
  currYear,
  currMonth,
  currDay,
}: {
  currYear: string;
  currMonth: string;
  currDay: string;
}) {
  const [year, setYear] = useState(currYear);
  const [month, setMonth] = useState(currMonth);
  const [day, setDay] = useState(currDay);

  return (
    <>
      <DayListOfMonth
        year={year}
        month={month}
        day={day}
        setYear={setYear}
        setMonth={setMonth}
        setDay={setDay}
      />

      <SchedularViewCenter
         year={year}
         month={month}
         day={day}
      />
      
    </>
  );
}
