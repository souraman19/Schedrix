"use client";

import React, { useActionState, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@mui/material";
import {z} from "zod";
import { taskSchema } from "@/lib/validation";
import { createTask } from "@/lib/action";

export default function TaskAddForm() {
  const { user } = useUserStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmitForm = async(prevState: any, formData: FormData)=> {
    try{

        // check if input is empty string and set it to undefined
        const sanitizeString = (val: FormDataEntryValue | null) =>
            typeof val === "string" && val.trim() === "" ? undefined : val;

        // check if input is file and size is 0 and set it to undefined
        // this is to prevent empty file inputs from being sent to the server
        const sanitizeFile = (val: FormDataEntryValue | null) =>
            val instanceof File && val.size ===  0? undefined : val;
          
        const formValues = {
            title: formData.get("title") as string,
            duration: sanitizeString(formData.get("duration")) ?? undefined,
            startTime: sanitizeString(formData.get("startTime")) ?? undefined,
            endTime: sanitizeString(formData.get("endTime")) ?? undefined,
            deadline: sanitizeString(formData.get("deadline")) ?? undefined,
            description: sanitizeString(formData.get("description")) as string | undefined,
            isLocked: formData.get("locked") === "true",
            isFixed: formData.get("fixed") === "true",
            category: sanitizeString(formData.get("category")) as string | undefined,
            priority: formData.get("priority") as "low" | "medium" | "high" | "critical",
            image: sanitizeFile(formData.get("image")),
            audio: sanitizeFile(formData.get("audio")),
          };

        
          console.log("form values", formValues);
        await taskSchema.parseAsync(formValues);
        const result = createTask(prevState, formValues as any);
        console.log("result", result);

        return result;

    }catch(error: any){
        if(error instanceof z.ZodError){
            const fieldErrors = error.flatten().fieldErrors;

            setErrors(fieldErrors as unknown as Record<string, string>);
            
            return {...prevState, error: "Validation failed", status: "ERROR"}
        }
        return {
            ...prevState,
            error: "An unexpected error occurred",
            status: "ERROR",
        }
    }
  }

  const [state, formAction, isPending] = useActionState(handleSubmitForm, {
    error: "",
    status: "initial",
  })

  return (
    <form
        action={formAction}
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
        <input
          type="text"
          placeholder="Enter task title..."
          style={inputBase}
        //  
         name="title"
        />
        {errors.title && 
            <span>{errors.title}</span>
        }
      </div>

      {/* Schedule */}
      <div style={sectionStyle}>
        {sectionHeading("⏱️", "Schedule")}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Duration (hours)</label>
            <input type="number" placeholder="E.g. 2" style={inputBase} name="duration" />
            {errors.duration && 
                <span>{errors.duration}</span>
            }
          </div>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Start Time</label>
            <input type="datetime-local" style={inputBase} name="startTime"/>
            {errors.startTime && 
                <span>{errors.startTime}</span>
            }
          </div>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>End Time</label>
            <input type="datetime-local" style={inputBase} name="endTime"/>
            {errors.endTime && 
                <span>{errors.endTime}</span>
            }
          </div>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Deadline</label>
            <input type="datetime-local" style={inputBase} name="deadLine"/>
            {errors.deadLine && 
                <span>{errors.deadLine}</span>
            }
          </div>
        </div>
      </div>

      {/* Task Info */}
      <div style={sectionStyle}>
        {sectionHeading("🧾", "More About Task")}

        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            placeholder="Write more about the task..."
            rows={4}
            style={textareaStyle}
            name="description"
          />
          {errors.description && 
                <span>{errors.description}</span>
            }
        </div>

        <div style={{ marginTop: "1.8rem" }}>
          <label style={labelStyle}>Upload Images</label>
          <input type="file" accept="image/*" multiple style={inputBase} name="image"/>
          {errors.image && 
                <span>{errors.image}</span>
          }
        </div>

        <div style={{ marginTop: "1.8rem" }}>
          <label style={labelStyle}>Upload Audio</label>
          <input type="file" accept="audio/*" style={inputBase} name="audio" />
            {errors.audio && 
                    <span>{errors.audio}</span>
            }
        </div>
      </div>

      {/* Lock & Fixed */}
      <div style={sectionStyle}>
        {sectionHeading("🔒", "Control Settings")}

        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Lock this task?</label>
            <select
              style={{
                ...inputBase,
                backgroundColor: "#1a1a1a",
                color: "#fff",
              }}
              
              name="locked"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
            {errors.locked && 
                <span>{errors.locked}</span>
            }
          </div>

          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Fixed Schedule?</label>
            <select
              style={{
                ...inputBase,
                backgroundColor: "#1a1a1a",
                color: "#fff",
              }}
                
                name="fixed"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
            {errors.fixed && 
                <span>{errors.fixed}</span>
            }
          </div>
        </div>
      </div>

      {/* Category & Priority */}
      <div>
        {sectionHeading("📊", "Category & Priority")}

        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Category</label>
            <input
              type="text"
              placeholder="e.g. Health, Work..."
              style={inputBase}
                
                name="category"
            />
            {errors.category && 
                <span>{errors.category}</span>
            }
          </div>

          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Priority</label>
            <select
              style={{
                ...inputBase,
                backgroundColor: "#1a1a1a",
                color: "#fff",
              }}
                
                name="priority"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            {errors.priority && 
                <span>{errors.priority}</span>
            }
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}
      >
        <Button
            type="submit"
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
            {
                isPending ? "Creating..." : "Create"
            }
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
