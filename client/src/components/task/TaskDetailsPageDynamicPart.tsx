import React from "react";

export default function TaskDetailsPageDynamicPart({ _id }: { _id: string }) {
    return (
        <div className="text-white">
            <h1>Task Details Dynamic Part</h1>
            <p>Task ID: {_id}</p>
            {/* Add your dynamic content here */}
        </div>
    );
}