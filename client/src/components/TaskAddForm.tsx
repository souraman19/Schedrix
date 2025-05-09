"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@mui/material";
import { z } from "zod";
import { taskSchema } from "@/lib/validation";
import { CREATE_TASKS_ROUTE } from "@/lib/apiRoutes";
import axios from "axios";
import { toast } from "sonner";
import CustomRepeat from "./CustomRepeat";
import { flattenZodErrors } from "@/lib/flattenedZodErrors";
import { start } from "repl";
import { Mic } from "lucide-react"; 
import QuickTask from "./voiceAssitant/QuickTask";

export default function TaskAddForm() {
  const { user } = useUserStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [repeat, setRepeat] = useState<string>("no repeat");
  const [repeatsEvery, setRepeatsEvery] = useState<string>("week");
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [duration, setDuration] = useState<string>("");


  const [customRepeat, setCustomRepeat] = useState({
    repeatInterval: "1",
    repeatUnit: "week",
    endsType: "",
    endsOn: {
      date: "",
      afterOccurrences: "",
      never: false,
    },
    startDate: "",
    weekDaysIfWeekInterval: [],
    monthDaysIfMonthInterval: [],
    yearDaysIfYearInterval: [],
  });
  const [customRepeatError, setCustomRepeatError] = useState<string>("");

  useEffect(() => {
    if (repeat !== "repeat") {
      setCustomRepeat({
        repeatInterval: "1",
        repeatUnit: "week",
        endsType: "",
        endsOn: {
          date: "",
          afterOccurrences: "",
          never: false,
        },
        startDate: "",
        weekDaysIfWeekInterval: [],
        monthDaysIfMonthInterval: [],
        yearDaysIfYearInterval: [],
      });
    }
  }, [repeat]);

  useEffect(() => {
    // console.log("custom repeat", customRepeat);
    // console.log("errors", errors);
  }, [errors]);

  const handleSubmitForm = async (prevState: any, formData: FormData) => {
    try {
      // check if input is empty string and set it to undefined
      const sanitizeString = (val: FormDataEntryValue | null) =>
        typeof val === "string" && val.trim() === "" ? undefined : val;

      // check if input is file and size is 0 and set it to undefined
      // this is to prevent empty file inputs from being sent to the server
      const sanitizeFile = (val: FormDataEntryValue | null) =>
        val instanceof File && val.size === 0 ? undefined : val;

      let formValues: any = {
        title: title as string,
        duration: sanitizeString(duration) ?? undefined,
        startTime: sanitizeString(formData.get("startTime")) ?? undefined,
        endTime: sanitizeString(formData.get("endTime")) ?? undefined,
        deadline: sanitizeString(formData.get("deadline")) ?? undefined,
        description: sanitizeString(formData.get("description")) as
          | string
          | undefined,
        isLocked: formData.get("locked") === "true",
        isFixed: formData.get("fixed") === "true",
        category: sanitizeString(formData.get("category")) as
          | string
          | undefined,
        priority: formData.get("priority") as
          | "low"
          | "medium"
          | "high"
          | "critical",
        image: sanitizeFile(formData.get("image")),
        audio: sanitizeFile(formData.get("audio")),
        repeat: formData.get("repeat") as string | undefined,
      };

      if (formValues.repeat === "repeat") {
        formValues.customRepeat = {
          repeatInterval: sanitizeString(customRepeat.repeatInterval) as
            | string
            | undefined,
          repeatUnit: sanitizeString(customRepeat.repeatUnit) as
            | string
            | undefined,
          endsType: sanitizeString(customRepeat.endsType) as string | undefined,
          endsOn: {
            date: sanitizeString(customRepeat.endsOn.date) as
              | string
              | undefined,
            afterOccurrences: sanitizeString(
              customRepeat.endsOn.afterOccurrences
            ) as string | undefined,
            never: customRepeat.endsOn.never as boolean | undefined,
          },
          startDate: sanitizeString(customRepeat.startDate) as string,
          weekDaysIfWeekInterval: customRepeat.weekDaysIfWeekInterval as
            | string[]
            | undefined,
          monthDaysIfMonthInterval: customRepeat.monthDaysIfMonthInterval as
            | string[]
            | undefined,
          yearDaysIfYearInterval: customRepeat.yearDaysIfYearInterval as
            | string[]
            | undefined,
        };
      }

      // console.log("form values", formValues);
      await taskSchema.parseAsync(formValues);
      const response = await axios.post(CREATE_TASKS_ROUTE, formValues, {
        withCredentials: true,
      });
      // console.log("task created => ", response.data);
      if (response.status === 201) toast.success("Task created successfully!");
      setTitle("");
      setDuration("");
      setRepeat("no repeat");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const flattenedErrors = flattenZodErrors(error);
        setErrors(flattenedErrors);

        toast.error("Validation failed! Please check your inputs.");

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast.error("An unexpected error occurred! Please try again.");
      return {
        ...prevState,
        error: "An unexpected error occurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleSubmitForm, {
    error: "",
    status: "initial",
  });

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
      <div 
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // gap: "5rem",
          // border: "1px solid red",
          marginBottom: "2.2rem",

        }}
      >
        <div
          style={{
            fontSize: "1.7rem",
            background: "linear-gradient(to right, #00c853, #b2ff59)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 800,
            textAlign: "center",
          }}
        >
          ✏️ Add a New Task
        </div>

        <QuickTask 
          setTitle={setTitle}
          setDuration={setDuration}
        />

      </div>
      {/* Title */}
      <div style={sectionStyle}>
        {sectionHeading("📝", "Title")}
        <input
          type="text"
          placeholder="Enter task title..."
          style={inputBase}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          //
          name="title"
        />
        {errors.title && <div style={errorTextStyle}>{errors.title}</div>}
      </div>

      {/* Schedule */}
      <div style={sectionStyle}>
        {sectionHeading("⏱️", "Schedule")}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Duration (hours)</label>
            <input
              type="number"
              placeholder="E.g. 2"
              style={inputBase}
              name="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            {errors.duration && (
              <div style={errorTextStyle}>{errors.duration}</div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Start Time</label>
            <input type="datetime-local" style={inputBase} name="startTime" />
            {errors.startTime && (
              <div style={errorTextStyle}>{errors.startTime}</div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>End Time</label>
            <input type="datetime-local" style={inputBase} name="endTime" />
            {errors.endTime && (
              <div style={errorTextStyle}>{errors.endTime}</div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Deadline</label>
            <input type="datetime-local" style={inputBase} name="deadline" />
            {errors.deadLine && (
              <div style={errorTextStyle}>{errors.deadLine}</div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Repeat</label>
            <select
              style={{
                ...inputBase,
                backgroundColor: "#1a1a1a",
                color: "#fff",
              }}
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
              name="repeat"
            >
              <option value="no repeat">No Repeat</option>
              <option value="repeat">Repeat</option>
            </select>
            {errors.repeat && (
              <div style={errorTextStyle}>{errors.deadLine}</div>
            )}
          </div>
          {repeat === "repeat" && (
            <Button
              onClick={() => setCustomModalOpen(true)}
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
              {`>`}
            </Button>
          )}

          {repeat === "repeat" && customModalOpen === true && (
            <CustomRepeat
              setRepeat={setRepeat}
              repeat={repeat}
              errors={errors}
              setErrors={setErrors}
              customModalOpen={customModalOpen}
              setCustomModalOpen={setCustomModalOpen}
              customRepeat={customRepeat}
              setCustomRepeat={setCustomRepeat}
            />
          )}
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
          {errors.description && (
            <div style={errorTextStyle}>{errors.description}</div>
          )}
        </div>

        <div style={{ marginTop: "1.8rem" }}>
          <label style={labelStyle}>Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            style={inputBase}
            name="image"
          />
          {errors.image && <div style={errorTextStyle}>{errors.image}</div>}
        </div>

        <div style={{ marginTop: "1.8rem" }}>
          <label style={labelStyle}>Upload Audio</label>
          <input type="file" accept="audio/*" style={inputBase} name="audio" />
          {errors.audio && <div style={errorTextStyle}>{errors.audio}</div>}
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
            {errors.locked && <div style={errorTextStyle}>{errors.locked}</div>}
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
            {errors.fixed && <div style={errorTextStyle}>{errors.fixed}</div>}
          </div>
        </div>
      </div>

      {/* Category & Priority */}
      <div>
        {sectionHeading("📊", "Category & Priority")}

        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <label style={labelStyle}>Category</label>
            <select
              style={{
                ...inputBase,
                backgroundColor: "#1a1a1a",
                color: "#fff",
              }}
              name="category"
            >
              <option value="health">Health</option>
              <option value="family">Family</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="learning">Learning</option>
              <option value="other">Other</option>
            </select>
            {errors.category && (
              <div style={errorTextStyle}>{errors.category}</div>
            )}
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
            {errors.priority && (
              <div style={errorTextStyle}>{errors.priority}</div>
            )}
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
          {isPending ? "Creating..." : "Create"}
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

const errorTextStyle = {
  color: "#f44336",
  marginTop: "0.4rem",
  fontSize: "0.75rem",
  fontWeight: 500,
  paddingLeft: "0.6rem",
  animation: "fadeInError 0.3s ease-in-out",
};
