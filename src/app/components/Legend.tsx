"use client";
import React, { useState } from "react";

const Legend = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        position: "relative",
        cursor: "pointer",
      }}
      onMouseEnter={() => {
        setIsVisible(true);
      }}
      onMouseLeave={() => {
        setIsVisible(false);
      }}
    >
      {/* Question Circle */}
      <svg width="80" height="30" style={{ marginRight: "10px" }}>
        <circle
          cx="15"
          cy="15"
          r="14"
          fill="#cefafe"
          stroke="#3c3c3c"
          strokeWidth="1"
        />
        <text
          x="15"
          y="15"
          fill="#3c3c3c"
          fontSize="15"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontWeight="bold"
        >
          ?
        </text>
        <text
          x="55"
          y="15"
          fill="#3c3c3c"
          fontSize="16"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontWeight="2px"
        >
          Help
        </text>
      </svg>

      {/* Legend with Animation */}
      <div
        className={`transform transition-all duration-[400ms] ease-in-out ${
          isVisible ? "translate-x-8 opacity-100" : "translate-x-2 opacity-0"
        }`}
        style={{
          border: "1px solid #CCCCCC",
          borderRadius: "5px",
          width: "245px",
          height: "55px",
          zIndex: "1",
          padding: "8px",
          background: "white",
          position: "absolute",
        }}
      >
        <svg width="100%" height="100%">
          {/* Solid Line and Text for Visiting */}
          <line x1="0" y1="10" x2="60" y2="10" stroke="grey" strokeWidth="4" />
          <text
            x="70"
            y="10"
            fill="#3c3c3c"
            fontSize="14"
            alignmentBaseline="middle"
          >
            Visit New Topic
          </text>
          {/* Dashed Line and Text for Revisiting */}
          <line
            x1="0"
            y1="30"
            x2="60"
            y2="30"
            stroke="grey"
            strokeWidth="4"
            strokeDasharray="5, 5"
          />
          <text
            x="70"
            y="30"
            fill="#3c3c3c"
            fontSize="14"
            alignmentBaseline="middle"
          >
            Revisit Previous Topic
          </text>
        </svg>
      </div>
    </div>
  );
};

export default Legend;
