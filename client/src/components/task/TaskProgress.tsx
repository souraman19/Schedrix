"use client";

import React from "react";

type RepeatTaskProgressProps = {
  completed: number;
  overdue: number;
  pending: number;
  total: number;
};

const TaskProgress: React.FC<RepeatTaskProgressProps> = ({
  completed,
  overdue,
  pending,
  total,
}) => {
  const radius = 120;
  const strokeWidth = 22;
  const center = 150;
  const fullCircle = 360;

  const clamp = (v: number) => Math.max(0, Math.min(v, total));
  const segments = [
    { count: clamp(completed), color: "#00c853", label: "Completed" },
    { count: clamp(overdue), color: "#f44336", label: "Overdue" },
    { count: clamp(pending), color: "#ffeb3b", label: "Pending" },
  ];

  // Function to convert polar to cartesian
  const polarToCartesian = (angle: number) => {
    const rad = (angle - 90) * (Math.PI / 180.0);
    return {
      x: center + radius * Math.cos(rad),
      y: center + radius * Math.sin(rad),
    };
  };

  // Generate arc path for a slice
  const describeArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    return [
      `M ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    ].join(" ");
  };

  // Draw each segment in sequence
  let currentAngle = 0;

  const arcs = segments
    .filter((s) => s.count > 0)
    .map((seg, i) => {
      const angle = (seg.count / total) * fullCircle;

      if (seg.count === total) {
        return (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        );
      }


      const path = describeArc(currentAngle, currentAngle + angle);
      const arc = (
        <path
          key={i}
          d={path}
          fill="none"
          stroke={seg.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      );
      currentAngle += angle;
      return arc;
    });

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #121212, #111)",
        borderRadius: "20px",
        padding: "30px",
        color: "white",
        maxWidth: "500px",
        margin: "auto",
        textAlign: "center",
        boxShadow: "0 0 20px rgba(0,0,0,0.5)",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
        Task Progress
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          margin: "auto",
        }}
      >
        <svg width="300" height="300" viewBox="0 0 300 300">
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#333"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {arcs}
        {/* Legend inside circle */}
        <foreignObject x="90" y="100" width="120" height="100">

          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8rem",
              color: "white",
              height: "100%",
              textAlign: "center",
              lineHeight: "1.3",
            }}
          >
            <Legend color="#00c853" label="Completed" count={completed} />
            <Legend color="#f44336" label="Overdue" count={overdue} />
            <Legend color="#999" label="Pending" count={pending} />
            <Legend color="#999" label="Total" count={total} />
          </div>
        </foreignObject>
      </svg>
      </div>

     
    </div>
  );
};

const Legend = ({
  color,
  label,
  count,
}: {
  color: string;
  label: string;
  count: number;
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: 5 }}>
    <div
      style={{
        width: 14,
        height: 14,
        backgroundColor: color,
        borderRadius: "50%",
      }}
    />
    <span style={{ fontSize: "0.95rem" }}>
      {label}: <strong>{count}</strong>
    </span>
  </div>
);

export default TaskProgress;
