"use client";
import React, { useContext, useState } from "react";
import { SelectionForm } from "./selectionForm";

const SelectionButton = ({
  title,
  value,
  currentDataSource,
  handleRadioChange,
}) => (
  <div>
    <input
      type="radio"
      id={value}
      className="hidden"
      name="sourceSelector"
      value={value}
      checked={currentDataSource === value}
      onChange={handleRadioChange}
    />
    <label
      htmlFor={value}
      className={`btn m-4 p-2 ${
        currentDataSource === value
          ? "btn-active border-2 border-sky-500 "
          : "btn-outline-success border border-gray-500"
      }`}
    >
      {title}
    </label>
  </div>
);

const DataSourceSelector = () => {
  const [dataSource, setDataSource] = useState("");

  const handleRadioChange = (event) => {
    setDataSource(event.target.value);
  };

  return (
    
    <div className="flex flex-col items-center justify-center h-screen w-full">
  <div className="flex items-center justify-center mb-8">
    <h3 className="text-md font-bold mr-4">Sankey Diagram</h3>
    <SelectionButton
      title={"Load Data From a File"}
      value={"static"}
      currentDataSource={dataSource}
      handleRadioChange={handleRadioChange}
    />
    <SelectionButton
      title={"Connect Directly to the Server"}
      value={"dynamic"}
      currentDataSource={dataSource}
      handleRadioChange={handleRadioChange}
    />
  </div>
  <div className="bg-blue-100 shadow-md rounded p-8">
    <SelectionForm selected={dataSource}/>
  </div>
</div>
  );
};

export default DataSourceSelector;
