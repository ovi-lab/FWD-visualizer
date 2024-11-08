import React, { useState } from "react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useSelectedBackgroundColour } from "../contexts/SelectedBackgroundColourContext";

// Define arrays of color options
const colors = [["White"], ["#D5DEF3"], ["#D7EBE5"], ["#F0EEDD"], ["#ffeaec"]];

const BackgroundColorPicker = () => {
  const { setSelectedBackgroundColour } = useSelectedBackgroundColour();
  const { darkMode } = useDarkMode();
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(
    colors[0]
  );

  // Helper function to update selected color
  const selectColorScheme = (scheme: string[]) => {
    setSelectedBackgroundColor(scheme);
    setSelectedBackgroundColour(scheme[0]); // Pass only the first color to setSelectedBackgroundColour
  };

  return (
    <div style={{ width: "fit-content" }}>
      <div
        style={{
          display: "flex",
          gap: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          background: "white",
          padding: "4px",
        }}
      >
        {colors.map((scheme, index) => (
          <div
            key={index}
            onClick={() => selectColorScheme(scheme)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px",
              cursor: "pointer",
              borderRadius: "4px",
              border:
                scheme === selectedBackgroundColor
                  ? "2px solid #727272"
                  : "1px solid #ddd",
              backgroundColor: scheme[0] === "White" ? "#fff" : scheme[0],
            }}
          >
            {scheme.map((color, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  width: "8px",
                  height: "8px",
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundColorPicker;
