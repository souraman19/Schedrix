'use client'

import React, { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import axios from "axios";
import { EDIT_REMINDER_TIME_ROUTE } from "@/lib/apiRoutes";
import { toast } from "sonner";


export default function EditReminderTimeBefore({taskData}: {taskData: any}) {
      const [editedReminderTimeBefore, setEditedReminderTimeBefore] = React.useState<number | null>(taskData?.reminder?.reminderTimeBefore ?? null);
    const [isEditing, setIsEditing] = useState(false);

    const updateReminderTime = async() => {
        if (editedReminderTimeBefore === null) return;
        try{
            const response = await axios.put(EDIT_REMINDER_TIME_ROUTE, {
                taskId: taskData._id,
                remainderTimeBefore: editedReminderTimeBefore
            },
        {
            withCredentials: true,
        });
            if(response.status === 200){
                console.log("Remainder time updated successfully:", response.data);
                toast.success("Remainder time updated successfully!");
                setIsEditing(false);
            } else {
                console.error("Failed to update remainder time:", response.data);
                toast.error("Failed to update remainder time.");
            }
        }catch(err){
            console.error("Error updating remainder time:", err);
            toast.error("Error updating remainder time.");
        }
    }

    return (
        <>
            {taskData?.reminder?.enabled! && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      background: "linear-gradient(to right, #00e676, #b2ff59)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      marginBottom: "0.25rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Before
                  </h3>
            
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                      background: "#121212",
                      padding: "1rem 1.25rem",
                      borderRadius: "0.75rem",
                      boxShadow: "0 0 12px rgba(0, 255, 128, 0.1)",
                      fontWeight: 500,
                      color: "#76ff03",
                    }}
                  >
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedReminderTimeBefore ?? 0}
                        onChange={(e) => {
                            if(Number(e.target.value) >= 0){
                                setEditedReminderTimeBefore(Number(e.target.value));
                            }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") updateReminderTime();
                        }}
                        style={{
                          background: "transparent",
                          color: "inherit",
                          border: "1px solid #76ff03",
                          borderRadius: "8px",
                          padding: "0.25rem 0.5rem",
                          width: "80px",
                        }}
                      />
                    ) : (
                      <span>{editedReminderTimeBefore} minutes</span>
                    )}
            
                    <div
                      onClick={() => {
                        if(isEditing){
                            setEditedReminderTimeBefore(taskData?.reminder?.reminderTimeBefore ?? null);
                        }
                        setIsEditing(!isEditing);
                      }}
                      style={{
                        cursor: "pointer",
                        background: "#1c1c1c",
                        padding: "0.4rem",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 12px rgba(0, 255, 128, 0.1)",
                      }}
                    >
                      <Edit size={18} />
                    </div>
                  </div>
                </div>
              ) }
        </>
    )
}