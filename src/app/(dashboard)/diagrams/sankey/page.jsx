"use client";
import React, { useState } from "react";
import SankeyDiagram from "./sankeyDiagram";
import { useDarkMode } from "@/app/contexts/DarkModeContext";

const SelectorButton = ({
  buttonDirection,
  directionState,
  handleRadioChange,
}) => {
  const {darkMode} = useDarkMode();
  const labeltext = () => {
    switch (buttonDirection) {
      case "robot-user":
        return "Robot to User";
      case "user-robot":
        return "User to Robot";
      case "both":
        return "Both";
      default:
        return "Unknown";
    }
  };
  return (

    <label
      htmlFor={buttonDirection}
      className={`btn mr-4 p-2 ${darkMode ? "bg-white" :  "bg-gray-200"} ${
        directionState === buttonDirection
          ? "btn-active border-2 border-sky-500 "
          : "btn-outline-success border border-stone-200"
      }`}
    >
      <input
        type="radio"
        id={buttonDirection}
        className="hidden"
        name="data-direction"
        value={buttonDirection}
        checked={directionState === buttonDirection}
        onChange={handleRadioChange}
      />
      {labeltext()}
    </label>
  );
};

function SankeyInterface() {
  const [dataDirection, setDataDirection] = useState("robot-user");

  // Event handler for radio button change
  const handleRadioChange = (event) => {
    setDataDirection(event.target.value);
  };

  return (
    <div className="p-5 w-full h-full mt-20">
      <div className="pb-4 mb-6">
        {/* <h3 className="float-left text-md font-bold mr-4">Sankey Diagram</h3> */}
        <div className="direction-selector float-right ">
          <SelectorButton
            buttonDirection={"robot-user"}
            directionState={dataDirection}
            handleRadioChange={handleRadioChange}
          />

          <SelectorButton
            buttonDirection={"user-robot"}
            directionState={dataDirection}
            handleRadioChange={handleRadioChange}
          />

          <SelectorButton
            buttonDirection={"both"}
            directionState={dataDirection}
            handleRadioChange={handleRadioChange}
          />
        </div>
      </div>
      <SankeyDiagram dataDirection={dataDirection} isBidirectional={dataDirection==="both"}/>
    </div>
  );
}

export default SankeyInterface;
