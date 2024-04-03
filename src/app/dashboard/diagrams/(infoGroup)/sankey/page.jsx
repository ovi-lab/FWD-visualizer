"use client";
import React, { useState } from "react";
import SankeyDiagram from "./sankeyDiagram";

const SelectorButton = ({
  buttonDirection,
  directionState,
  handleRadioChange,
}) => {
  return (
    <label
      htmlFor={buttonDirection}
      className={`btn mr-4 p-2 ${
        directionState === buttonDirection
          ? "btn-active border-2 border-sky-500 "
          : "btn-outline-success border border-gray-500"
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
      {buttonDirection === "user-haru" ? "User to Haru" : "Haru to User"}
    </label>
  );
};

function SankeySelector() {
  const [dataDirection, setDataDirection] = useState("user-haru");

  // Event handler for radio button change
  const handleRadioChange = (event) => {
    setDataDirection(event.target.value);
  };

  return (
    <div className="p-5 w-full h-full">
      <div className="pb-4 mb-6">
        <h3 className="float-left text-md font-bold mr-4">Sankey Diagram</h3>
        <div className="direction-selector float-right ">
          <SelectorButton
            buttonDirection={"haru-user"}
            directionState={dataDirection}
            handleRadioChange={handleRadioChange}
          />

          <SelectorButton
            buttonDirection={"user-haru"}
            directionState={dataDirection}
            handleRadioChange={handleRadioChange}
          />
        </div>
      </div>
      <SankeyDiagram dataDirection={dataDirection} />
    </div>
  );
}

export default SankeySelector;
