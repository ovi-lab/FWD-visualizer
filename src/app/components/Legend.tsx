import React from "react";

const Legend = () => {
  return (
    <div
      style={{
        border: "1px solid #CCCCCC",
        borderRadius: "5px",
        display: "inline-block",
        width: "265px",
        height: "55px",
        zIndex: "1",
        position: "relative",
        padding: "8px",
        paddingLeft: "15px",
        background: "white",
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
          Visiting New Topic
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
          Revisiting Previous Topic
        </text>
      </svg>
    </div>
  );
};

export default Legend;
