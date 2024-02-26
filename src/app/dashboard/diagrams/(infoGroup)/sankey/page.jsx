"use client";
import React, { useState } from "react";
import SankeyDiagram from "./sankeyDiagram";

function SankeySelector() {
  const [dataDirection, setDataDirection] = useState("haru-user");


  // Event handler for radio button change
  const handleRadioChange = (event) => {
    setDataDirection(event.target.value);
  };

  return (
    <div className="p-5 w-100% h-100%">
      <div className="pb-4">
        <h3 className="float-left text-lg font-bold mr-4">
          Select Data Direction:
        </h3>
        <input
          type="radio"
          id="haru-user"
          className="hidden"
          name="data-direction"
          value="haru-user"
          checked={dataDirection === "haru-user"}
          onChange={handleRadioChange}
        />
        <label
          htmlFor="haru-user"
          className={`btn m-4 p-2 ${
            dataDirection === "haru-user"
              ? "btn-active border-2 border-sky-500 "
              : "btn-outline-success border border-gray-500"
          }`}
        >
          Haru to User
        </label>
        <input
          type="radio"
          id="user-haru"
          className="hidden"
          name="data-direction"
          value="user-haru"
          checked={dataDirection === "user-haru"}
          onChange={handleRadioChange}
        />
        <label
          htmlFor="user-haru"
          className={`btn mr-4 p-2 ${
            dataDirection === "user-haru"
              ? "btn-active border-2 border-sky-500 "
              : "btn-outline-success border border-gray-500"
          }`}
        >
          User to Haru
        </label>
      </div>
      <SankeyDiagram
        dataDirection={dataDirection}
      />
    </div>
  );
}

export default SankeySelector;
