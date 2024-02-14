'use client'
import React, { useState } from "react";
import SankeyDiagram from "./sankeyDiagram";

function SankeySelector({ selected, handleInteraction}) {
  const [dataDirection, setDataDirection] = useState("haru-user");

  // Event handler for radio button change
  const handleRadioChange = (event) => {
    setDataDirection(event.target.value);
  };

  return (
    <div className="p-5 w-100% h-100%">
      <h3 style={{float:"left"}}>Sankey Diagram</h3>
      <input
        type="radio"
        className="btn-check"
        name="options-outlined"
        id="haru-user"
        value={"haru-user"}
        checked={dataDirection === "haru-user"}
        onChange={handleRadioChange}
      />
      <label className="btn btn-outline-success" htmlFor="haru-user">
        Haru to Child
      </label>
      <input
        type="radio"
        className="btn-check"
        name="options-outlined"
        id="user-haru"
        value={"user-haru"}
        checked={dataDirection === "user-haru"}
        onChange={handleRadioChange}
      />
      <label className="btn btn-outline-success" htmlFor="user-haru">
        Child to Haru
      </label>
      <SankeyDiagram dataDirection={dataDirection} selected={selected} handle={handleInteraction}/>
    </div>
  );
}

export default SankeySelector;
