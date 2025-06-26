"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Box, Chip, Divider } from "@mui/material";
import { GET_TASK_REPEAT_INFO_ROUTE } from "@/lib/apiRoutes";

export default function RepeatInfo({ _id }: { _id: string }) {
  type TaskType = {
    _id: string;
    repeat: "no repeat" | "repeat";
    customRepeat: {
      repeatInterval?: number;
      repeatUnit?: "day" | "week" | "month" | "year";
      endsType?: "date" | "afterOccurrences" | "never";
      endsOn?: {
        date?: string;
        afterOccurrences?: number;
        never?: boolean;
      };
      startDate?: string;
      weekDaysIfWeekInterval?: string[];
      monthDaysIfMonthInterval?: number[];
      yearDatesIfYearInterval?: string[];
    };
    isMaster: boolean;
  };

  const [taskData, setTaskData] = useState<TaskType | null>(null);

  const getTaskRepeatInfo = useCallback(async () => {
    try {
      const response = await fetch(`${GET_TASK_REPEAT_INFO_ROUTE}/${_id}`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      setTaskData(result.task);
    } catch (err) {
      console.error("Error fetching task details:", err);
    }
  }, [_id, setTaskData]);

  useEffect(() => {
    getTaskRepeatInfo();
  }, [getTaskRepeatInfo]);

  const containerStyle = {
    background: "linear-gradient(135deg, #121212, #111)",
    color: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.4)",
    maxWidth: "800px",
    margin: "40px auto",
    animation: "fadeIn 1.5s ease-out",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  };

  const chipStyle = {
    ml: 1,
    background: "#b2ff59",
    color: "#000",
    fontWeight: 600,
  };

  if (taskData === null) {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #121212, #0f0f0f)",
        color: "#b2ff59",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 0 30px rgba(0, 255, 128, 0.2)",
        maxWidth: "800px",
        margin: "40px auto",
        textAlign: "center",
        animation: "fadeIn 1.2s ease-out",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
        Loading Repeat Info...
      </div>
      <div style={{ fontSize: "0.95rem", color: "#ccffcc", marginBottom: "2rem" }}>
        Please wait while we fetch the task’s recurrence details.
      </div>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
        <div className="w-3/4 h-4 bg-green-900 rounded animate-pulse" />
        <div className="w-2/3 h-4 bg-green-900 rounded animate-pulse" />
        <div className="w-5/6 h-4 bg-green-900 rounded animate-pulse" />
        <div className="w-1/2 h-4 bg-green-900 rounded animate-pulse" />
      </Box>
    </Box>
  );
}


  const {
    repeat,
    customRepeat: {
      repeatInterval,
      repeatUnit,
      endsType,
      endsOn,
      startDate,
      weekDaysIfWeekInterval,
      monthDaysIfMonthInterval,
      yearDatesIfYearInterval,
    } = {},
    isMaster,
  } = taskData;

  return (
    <Box sx={containerStyle}>
      {isMaster && (
        <Chip
          label="MASTER TASK"
          sx={{
            mb: 2,
            px: 2,
            py: 1,
            fontWeight: 700,
            background: "linear-gradient(to right, #00c853, #b2ff59)",
            color: "#000",
            fontSize: "0.875rem",
            boxShadow: "0 0 10px #b2ff59aa",
            borderRadius: "8px",
            width: "fit-content",
          }}
        />
      )}

      <h5 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "20px" }}>
        Repeat Information
      </h5>

      <Divider sx={{ my: 2, background: "#333" }} />

      <div style={{ fontSize: "1rem", marginBottom: "10px" }}>
        <strong>Repeat:</strong>{" "}
        <Chip label={repeat} size="small" sx={chipStyle} />
      </div>

      {repeat === "repeat" && (
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {startDate && (
            <div style={{ fontSize: "1rem", marginBottom: "10px" }}>
              📅 <strong>Start Date:</strong>{" "}
              <Chip label={new Date(startDate).toLocaleDateString()} size="small" sx={chipStyle} />
            </div>
          )}

          <div style={{ fontSize: "1rem", marginBottom: "10px" }}>
            🔁 <strong>Repeats every:</strong>{" "}
            <Chip label={`${repeatInterval} ${repeatUnit}(s)`} size="small" sx={chipStyle} />
          </div>

          {repeatUnit === "week" && (weekDaysIfWeekInterval as any).length > 0 && (
            <Box>
              <div style={{ fontSize: "1rem", marginBottom: "10px" }}>
                📆 <strong>Repeats On (Weekdays):</strong>
              </div>
              {(weekDaysIfWeekInterval as any).map((day : any) => (
                <Chip key={day} label={day} sx={{ ...chipStyle, m: 0.5 }} />
              ))}
            </Box>
          )}

          {repeatUnit === "month" && (monthDaysIfMonthInterval as any).length > 0 && (
            <Box>
              <div style={{ fontSize: "1rem", marginBottom: "10px" }}>
                📆 <strong>Repeats On (Month Days):</strong>
              </div>
              {(monthDaysIfMonthInterval as any).map((day:any) => (
                <Chip key={day} label={`Day ${day}`} sx={{ ...chipStyle, m: 0.5 }} />
              ))}
            </Box>
          )}

          {repeatUnit === "year" && (yearDatesIfYearInterval as any).length > 0 && (
            <Box>
              <div style={{ fontSize: "1rem", marginBottom: "10px" }}>
                📆 <strong>Repeats On (Year Dates):</strong>
              </div>
              {(yearDatesIfYearInterval as any).map((date:any, idx:any) => (
                <Chip
                  key={idx}
                  label={new Date(date).toLocaleDateString()}
                  sx={{
                    ...chipStyle,
                    m: 0.5,
                    animation: `fadeSlideIn 0.4s ease-out ${idx * 0.1}s both`,
                    "&:hover": {
                      boxShadow: "0 0 10px #b2ff59cc",
                      transform: "scale(1.05)",
                      transition: "0.2s",
                    },
                  }}
                />
              ))}
            </Box>
          )}

          <div style={{ fontSize: "1rem", marginBottom: "10px" }}>
            🔚 <strong>Ends:</strong>{" "}
            {endsType === "date" ? (
              <Chip label={`On ${new Date(endsOn?.date || "").toLocaleDateString()}`} size="small" sx={chipStyle} />
            ) : endsType === "afterOccurrences" ? (
              <Chip label={`After ${endsOn?.afterOccurrences} occurrences`} size="small" sx={chipStyle} />
            ) : (
              <Chip label="Never" size="small" sx={chipStyle} />
            )}
          </div>
        </Box>
      )}
    </Box>
  );
}
