"use client";

import { Button, TextField, Box } from "@mui/material";
import { resolve } from "path";
import React, { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { RESOLVE_TASK_ROUTE } from "@/lib/apiRoutes";
import { useRouter } from "next/navigation";

export default function Resolve({ _id }: { _id: string }) {
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState("");

    const router = useRouter();

  const resolveTask = async() => {
    try {
        const formData = new FormData();
        formData.append("userInputText", feedback);

        const response: Response = await axios.post(`${RESOLVE_TASK_ROUTE}/${_id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            }
        )
        console.log("Response: ", response);

            toast.success("Task resolved successfully!");
            router.push(`/in/task/${_id}`); // Redirect to the task home page
        
        console.log('Task resolved successfully:', response);
    }catch(error: any) {
        console.log('Error resolving task:', error);
        if(error.response && error.response.status === 499){
            toast.error(error.response.data.error);
        } else if(error.response && error.response.status === 404){
            toast.error("Task not found!");
        } else if(error.response && error.response.status === 500){
            toast.error("Internal server error!");
        } else {
            toast.error("Error resolving task!");
        }
    }
  }

  const handleResolveClick = () => {
    if(showForm === false){
        setShowForm(true);
    } else {
        resolveTask();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeedback(e.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #0d0d0d, #111)",
        padding: "2rem",
        paddingTop: "0",
        border: "1px solid #222",
        position: "relative",
      }}
    >
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
            e.currentTarget.style.background = "linear-gradient(145deg, #00e676, #b2ff59)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 255, 128, 0.5)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "linear-gradient(145deg, #00c853, #b2ff59)";
            e.currentTarget.style.boxShadow = "0 0 12px rgba(0, 255, 128, 0.25)";
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
            <h3 style={{ color: "#b2ff59", marginBottom: "1rem", fontSize: "1.25rem" }}>
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
