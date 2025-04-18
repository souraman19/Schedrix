"use client";

import React from "react";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@mui/material";

export default function TaskAddForm() {
  const { user } = useUserStore();

  return (
    <form
      style={{
        maxWidth: "1000px",
        margin: "4rem auto",
        padding: "3rem",
        background: "linear-gradient(145deg, #0d0d0d, #111)",
        borderRadius: "2rem",
        boxShadow: "0 0 50px rgba(0, 200, 83, 0.25)",
        border: "1px solid rgba(255,255,255,0.04)",
        backdropFilter: "blur(14px)",
        color: "var(--foreground)",
      }}
    >
        <h2
        style={{
          fontSize: "1.7rem",
          marginBottom: "2.2rem",
          background: "linear-gradient(to right, #00c853, #b2ff59)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: 800,
          textAlign: "center",
        }}
      >
        ✏️ Add a New Task
      </h2>
      {/* Title */}
      <div style={sectionStyle}>
        {sectionHeading("📝", "Title")}
        <input type="text" placeholder="Enter task title..." style={inputBase} />
      </div>

      {/* Schedule */}
      <div style={sectionStyle}>
        {sectionHeading("⏱️", "Schedule")}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Duration (hours)</label>
            <input type="number" placeholder="E.g. 2" style={inputBase} />
          </div>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Start Time</label>
            <input type="datetime-local" style={inputBase} />
          </div>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>End Time</label>
            <input type="datetime-local" style={inputBase} />
          </div>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Deadline</label>
            <input type="datetime-local" style={inputBase} />
          </div>
        </div>
      </div>

      {/* Task Info */}
      <div style={sectionStyle}>
        {sectionHeading("🧾", "More About Task")}

        <div>
          <label style={labelStyle}>Description</label>
          <textarea placeholder="Write more about the task..." rows={4} style={textareaStyle} />
        </div>

        <div style={{ marginTop: "1.8rem" }}>
          <label style={labelStyle}>Upload Images</label>
          <input type="file" accept="image/*" multiple style={inputBase} />
        </div>

        <div style={{ marginTop: "1.8rem" }}>
          <label style={labelStyle}>Upload Audio</label>
          <input type="file" accept="audio/*" style={inputBase} />
        </div>
      </div>

      {/* Lock & Fixed */}
      <div style={sectionStyle}>
        {sectionHeading("🔒", "Control Settings")}

        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Lock this task?</label>
            <select style={{ ...inputBase, backgroundColor: "#1a1a1a", color: "#fff" }}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Fixed Schedule?</label>
            <select style={{ ...inputBase, backgroundColor: "#1a1a1a", color: "#fff" }}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category & Priority */}
      <div>
        {sectionHeading("📊", "Category & Priority")}

        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Category</label>
            <input type="text" placeholder="e.g. Health, Work..." style={inputBase} />
          </div>

          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Priority</label>
            <select style={{ ...inputBase, backgroundColor: "#1a1a1a", color: "#fff" }}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
        <Button
          sx={{
            background: "linear-gradient(to right, #00c853, #b2ff59)",
            color: "#000",
            borderRadius: "999px",
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: "none",
            fontSize: "1rem",
            "&:hover": {
              background: "linear-gradient(to right, #00e676, #ccff90)",
              boxShadow: "0 0 16px #00c85388",
            },
          }}
        >
          Submit
        </Button>
      </div>
    </form>
  );
}



const inputBase = {
    background: "linear-gradient(to right, #1a1a1a, #202020)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "0.75rem 1.2rem",
    borderRadius: "999px",
    color: "#fff",
    width: "100%",
    outline: "none",
    transition: "0.3s ease",
    fontSize: "0.85rem", // Smaller font size
  };

  const textareaStyle = {
    ...inputBase,
    borderRadius: "1rem",
    resize: "vertical",
    fontFamily: "inherit",
    fontSize: "0.85rem", // Smaller font size
  };

  const labelStyle = {
    marginBottom: "0.6rem",
    display: "block",
    fontWeight: 600,
    color: "#b2ff59",
    fontSize: "0.85rem", // Smaller font size
  };

  const sectionStyle = {
    marginBottom: "3rem",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    paddingBottom: "2rem",
  };

  const sectionHeading = (icon: string, title: string) => (
    <h3
      style={{
        fontSize: "1.1rem", // Smaller font size
        marginBottom: "1.6rem",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        background: "linear-gradient(to right, #00c853, #b2ff59)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontWeight: 700,
        letterSpacing: "0.5px",
      }}
    >
      {icon} {title}
    </h3>
  );
