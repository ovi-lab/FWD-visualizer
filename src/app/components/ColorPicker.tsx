import React, { useState } from "react";
import { useSelectedColour } from "../contexts/SelectedColourContext";
import { useDarkMode } from "@/app/contexts/DarkModeContext";

// Define arrays of colour optoins
const colors = [
  // Primary - light
  [
    "#8CD0C7",
    "#F4EC90",
    "#c8a7c9",
    "#FE7F70",
    "#81B1D1",
    "#FEB363",
    "#B2DD6A",
    "#FDCDE4",
    "#d1d1d1",
    "#edcfa6",
    "#bca498",
  ],
  // Primary - semi-dark
  [
    "#66C2A5",
    "#FFD92E",
    "#bc80bd",
    "#f47264",
    "#8DA0CB",
    "#FC8D62",
    "#a4cc5f",
    "#FF9DA8",
    "#B3B3B3",
    "#E5C494",
    "#a88572",
  ],
  // Primary - dark
  [
    "#76B8B2",
    "#EDCA4A",
    "#AF7AA1",
    "#E15759",
    "#4E79A7",
    "#F38E2C",
    "#5AA04F",
    "#E68AC2",
    "#7B7F81",
    "#e5bb80",
    "#9C755F",
  ],
  // Neutral - Dark
  [
    "#82A18F",
    "#eabf62",
    "#EBC9AA",
    "#896C68",
    "#bfa2b8",

    "#ABBD9A",
    "#EC8E75",
    "#D0BA98",
    "#F8CE87",
    "#9f8298",
    "#D49D81",
  ],
  // Neutral - Light
  [
    "#ffbf87",
    "#DCDD7A",
    "#bfa2b8",
    "#FECCA9",
    "#a7ccd1",
    "#DEB25E",
    "#D7D8B7",
    "#FFE797",
    "#FD9E7D",
    "#adb284",
    "#d6a697",
  ],
  // Girl - younger / bright
  [
    "#ffbf87",
    "#FFABAB",
    "#ff7a8c",
    "#f4c7a8",
    "#B3E0FF",
    "#A8D8B9",
    "#ffe77c",
    "#FFD5E1",
    "#C9B4FF",
    "#E3B9F5",
    "#FF9AA2",
  ],
  // Boy - younger / bright
  [
    "#A4D65E",
    "#4B9CD3",
    "#5C6BC0",
    "#FFB74D",
    "#FF6F61",
    "#78C1B3",
    "#FFD54F",
    "#ef9d2b",
    "#64B5F6",
    "#4DB6AC",
    "#FF8A65",
  ],
  // Girl - older / dark
  [
    "#EFA58A",
    "#AEBB9E",
    "#ffbf87",
    "#a08298",
    "#e8b3b2",
    "#eddf9a",
    "#d79c89",
    "#d88a9c",
    "#bfa2b8",
    "#e6c4bd",
    "#E5DEBB",
  ],
  // Boy - older / dark
  [
    "#F4A65D",
    "#5d967a",
    "#ADCFD9",
    "#47476B",
    "#737373",
    "#D7B88B",
    "#d18440",
    "#8fbc99",
    "#B58A7A",
    "#7A9BAE",
    "#C2B280",
  ],
];

const ColorPicker = () => {
  // Keep track of if spinner is open
  const [isOpen, setIsOpen] = useState(false);
  // Keep track of colour palette selected
  const { selectedColour, setSelectedColour } = useSelectedColour();
  // Kepp track of dark mode setting
  const { darkMode } = useDarkMode();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Helper function to update setSelectedColour and setIsOpen on colour section
  const selectColorScheme = (scheme: React.SetStateAction<string[]>) => {
    setSelectedColour(scheme);
    setIsOpen(false);
  };

  return (
    <div
      style={{ display: "inline-block", position: "relative" }}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      <label
        style={{
          display: "block",
          marginBottom: "8px",
        }}
      >
        <span style={{ color: darkMode ? "white" : "#3c3c3c" }}>
          Color Theme
        </span>
      </label>
      {/* Container for only the selected color scheme */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #ccc",
          padding: "4px",
          cursor: "pointer",
          width: "fit-content",
          borderRadius: "4px",
          backgroundColor: "white",
        }}
      >
        {/* Array.prototype.map((element, index) => ()) */}
        <div style={{ display: "flex", gap: "4px" }}>
          {/* Create a set of color blocks for the selected colour scheme */}
          {selectedColour.map((color, i) => (
            <span
              key={i}
              style={{
                cursor: "pointer",
                display: "inline-block",
                width: "16px",
                height: "16px",
                backgroundColor: color,
                borderRadius: "2px",
                border: "1px solid #ddd",
              }}
            />
          ))}
        </div>
        <span style={{ marginLeft: "8px", color: "#7a7a7a" }}>▼</span>

        {/* Create container for the color scheme options */}
      </div>

      <div
        className={`transform transition-all duration-[400ms] ease-in-out ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-2 opacity-0 pointer-events-none"
        } w-fit`}
        style={{
          cursor: "pointer",
          position: "absolute",
          top: "100%",
          left: 0,
          border: "1px solid #ccc",
          borderRadius: "4px",
          background: "white",
          padding: "4px",
          marginTop: "4px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          zIndex: 10,
          maxHeight: "81px",
          overflowY: "auto",
        }}
      >
        {/* Create bottom line for every colour scheme */}
        {colors.map((scheme, index) => (
          <div
            key={index}
            onClick={() => {
              selectColorScheme(scheme);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "4px",
              borderBottom:
                index !== colors.length - 1 ? "1px solid #eee" : "none", // Create bottom border for every colour scheme except for the last one
            }}
          >
            {/* Create  a set of color blocks for every color scheme options */}
            {scheme.map((color, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                  backgroundColor: color,
                  marginRight: "4px",
                  borderRadius: "2px",
                  border: "1px solid #ddd",
                }}
              />
            ))}
            {/* If the current scehme is the selectedColour, create ✓ beside the color blocks */}
            {/* { condition && (execution statement) } 
                If condition is correct execute the statement */}
            {scheme === selectedColour && (
              <span style={{ marginLeft: "auto", color: "#7a7a7a" }}>✓</span>
            )}{" "}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
