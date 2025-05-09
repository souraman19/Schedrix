"use client";

import { Button, TextField, Box } from "@mui/material";
import { resolve } from "path";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { GET_TASK_TIMINGS_ROUTE, RESOLVE_TASK_ROUTE, RESCHEDULE_TASK_ROUTE } from "@/lib/apiRoutes";
import { useRouter } from "next/navigation";

export default function TaskActions({ _id }: { _id: string }) {
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const router = useRouter();

  const [rescheduleStartTime, setRescheduleStartTime] = useState("");
  const [rescheduleEndTime, setRescheduleEndTime] = useState("");
  const [rescheduleDeadline, setRescheduleDeadline] = useState("");

  function formatDatetimeLocal(isoString: string): string {
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
  }

  function formatDateOnly(isoString: string): string {
    return new Date(isoString).toISOString().slice(0, 10); // YYYY-MM-DD
  }

  const resolveTask = async () => {
    try {
      const formData = new FormData();
      formData.append("userInputText", feedback);

      const response: Response = await axios.post(
        `${RESOLVE_TASK_ROUTE}/${_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("Response: ", response);

      toast.success("Task resolved successfully!");
      
      console.log("Task resolved successfully:", response);
      setFeedback("");
      setShowForm(false);
      // router.push(`/in/task/${_id}`); // Redirect to the task home page
    } catch (error: any) {
      console.log("Error resolving task:", error);
      if (error.response && error.response.status === 499) {
        toast.error(error.response.data.error);
      } else if (error.response && error.response.status === 404) {
        toast.error("Task not found!");
      } else if (error.response && error.response.status === 500) {
        toast.error("Internal server error!");
      } else {
        toast.error("Error resolving task!");
      }
    }
  };

  const fetchTimings = async () => {
    try {
      const response: Response = await fetch(
        `${GET_TASK_TIMINGS_ROUTE}/${_id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        console.log("Task timings: ", data.task);
        setRescheduleStartTime(formatDatetimeLocal(data.task.startTime || ""));
        setRescheduleEndTime(formatDatetimeLocal(data.task.endTime || ""));
        setRescheduleDeadline(formatDateOnly(data.task.deadline || ""));
      } else {
        toast.error("Error fetching task timings!");
      }
    } catch (error: any) {
      console.log("Error fetching timings:", error);
      if (error.response && error.response.status === 499) {
        toast.error(error.response.data.error);
      } else if (error.response && error.response.status === 404) {
        toast.error("Task not found!");
      } else if (error.response && error.response.status === 500) {
        toast.error("Internal server error!");
      } else {
        toast.error("Error fetching timings!");
      }
    }
  };

  const handleResolveClick = () => {
    if (showForm === false) {
      setShowForm(true);
    } else {
      resolveTask();
    }
  };


  const rescheduleTask = async () => {
    try{
        const formData = new FormData();
        formData.append("startTime", rescheduleStartTime);
        formData.append("endTime", rescheduleEndTime);
        formData.append("deadline", rescheduleDeadline);
        const response: Response = await axios.post(
          `${RESCHEDULE_TASK_ROUTE}/${_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        // console.log("Response: ", response);
        if(response.status === 200){
          toast.success("Task rescheduled successfully!");
          setShowRescheduleForm(false);
          // router.push(`/in/task/${_id}`); // Redirect to the task home page
        } else {
          toast.error("You have to chose new time!");
        }
    }catch(error: any){
      console.log("Error rescheduling task:", error);
      if (error.response && error.response.status === 499) {
        toast.error(error.response.data.error);
      } else if (error.response && error.response.status === 404) {
        toast.error("Task not found!");
      } else if (error.response && error.response.status === 500) {
        toast.error("Internal server error!");
      } else {
        toast.error("Error rescheduling task!");
      }
    }
  }

  const handleRescheduleClick = () => {
    if (showRescheduleForm === false) {
      setShowRescheduleForm(true);
    } else {
      rescheduleTask();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeedback(e.target.value);
  };

  useEffect(() => {
    fetchTimings();
  }, []);

  useEffect(() => {
    console.log("Reschedule Start Time: ", rescheduleStartTime);
    console.log("Reschedule End Time: ", rescheduleEndTime);
    console.log("Reschedule Deadline: ", rescheduleDeadline);
  }, [rescheduleStartTime, rescheduleEndTime, rescheduleDeadline]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #0d0d0d, #111)",
        padding: "2rem",
        paddingTop: "0",
        border: "1px solid #222",
        position: "relative",
        gap: "6rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button onClick={handleRescheduleClick}>Reschedule</Button>

        {showRescheduleForm && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div>
              <label htmlFor="">Start Time</label>
              <input
                type="datetime-local"
                value={rescheduleStartTime}
                onChange={(e) => setRescheduleStartTime(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="">End Time</label>
              <input
                type="datetime-local"
                value={rescheduleEndTime}
                onChange={(e) => setRescheduleEndTime(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="">Deadline</label>
              <input
                type="date"
                value={rescheduleDeadline}
                onChange={(e) => setRescheduleDeadline(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", maxWidth: "400px", width: "100%" }}>
        <Button
          variant="contained"
          onClick={handleResolveClick}
          style={{
            background: "linear-gradient(145deg, #00c853, #b2ff59)",
            boxShadow: "0 0 12px rgba(0, 255, 128, 0.25)",
            padding: "1rem 2rem",
            fontSize: "1.25rem", // Smaller font size
            fontWeight: "600",
            borderRadius: "999px",
            color: "#fff",
            textTransform: "none",
            marginBottom: "1.5rem",
            transition: "all 0.4s ease-in-out",
            animation: "pulse 1.5s infinite ease-in-out",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(145deg, #00e676, #b2ff59)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 255, 128, 0.5)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(145deg, #00c853, #b2ff59)";
            e.currentTarget.style.boxShadow =
              "0 0 12px rgba(0, 255, 128, 0.25)";
          }}
        >
          Resolve
        </Button>

        {showForm && (
          <Box
            style={{
              background: "linear-gradient(145deg, #101010, #121212)",
              padding: "2rem",
              borderRadius: "1.5rem",
              boxShadow: "0 0 20px rgba(0, 255, 128, 0.25)",
              color: "#e0ffe0",
              transform: "translateY(20px)",
              opacity: 0,
              animation: "fadeIn 0.6s forwards",
            }}
          >
            <h3
              style={{
                color: "#b2ff59",
                marginBottom: "1rem",
                fontSize: "1.25rem",
              }}
            >
              How good was it?
            </h3>
            <TextField
              label="Your Feedback"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={feedback}
              onChange={handleInputChange}
              style={{
                backgroundColor: "#1a1a1a",
                color: "#e0ffe0",
                borderRadius: "1rem",
                fontSize: "0.875rem", // Smaller font size
                padding: "1.25rem",
                marginBottom: "1rem",
                boxShadow: "0 0 12px rgba(0, 255, 128, 0.1)",
                transition: "all 0.3s ease-in-out",
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = "#262626";
                e.target.style.boxShadow = "0 0 15px rgba(0, 255, 128, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = "#1a1a1a";
                e.target.style.boxShadow = "0 0 12px rgba(0, 255, 128, 0.1)";
              }}
            />
          </Box>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
