import React from "react";
import TaskCard from "./TaskCard"; // Assuming TaskCard is in the same directory

const TaskList = ({ tasks }: { tasks: any[] }) => {
  return (
    <div className="text-white">
      {tasks.length === 0 ? (
        <div className="h-64 border border-gray-700 rounded-lg flex items-center justify-center mb-4">
          <span className="text-gray-400">Task Results will appear here</span>
        </div>
      ) : (
        tasks.map((task) => <TaskCard key={task._id} task={task} />)
      )}
    </div>
  );
};

export default TaskList;
