"use client";
import React, { useState, useEffect, useRef } from "react";
import { useFilter } from "@/app/contexts/filterContext";
import TimeLine from "./timeline";
import { useSocketData } from "@/app/contexts/socketDataContext";

const defaultFilters = {
  turn: "",
  sentiment: "",
  emotion: "",
  topic: "",
  keywords: false,
  timestamp: "",
};

const turnList = ["robot", "user"];
const sentimentList = ["positive", "neutral", "negative"];
const emotionList = [
  "anger",
  "disgust",
  "fear",
  "joy",
  "neutral",
  "sadness",
  "surprise",
];

/**
 * Component for rendering radio button style filters.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<string>} props.data - List of filter options.
 * @param {string} props.title - Title of the filter.
 * @param {string} props.filterType - Type of the filter.
 * @param {string} props.stateValue - Current state value of the filter.
 * @param {function} props.handleChange - Function to handle filter change.
 * @returns {JSX.Element} The FilterRadioButton component.
 */
const FilterRadioButton = ({
  data,
  title,
  filterType,
  stateValue,
  handleChange,
}) => {
  return (
    <div className="rounded-lg bg-gray-100 p-2 pt-0 shadow-md m-2">
      <h3 className="m-1 font-bold text-sm">{title}</h3>
      {data.map((filterOption) => (
        <label
          key={`${filterType}:${filterOption}`}
          htmlFor={`${filterType}:${filterOption}-filter`}
          className={`select-none cursor-pointer rounded-lg border-2 m-1 py-1 px-2 font-bold text-sm transition-colors duration-200 ease-in-out ${
            stateValue === filterOption
              ? "bg-green-100 text-gray-700 border-gray-700"
              : "text-gray-700 border-gray-700"
          }`}
        >
          <input
            type="radio"
            id={`${filterType}:${filterOption}-filter`}
            className="hidden"
            name={filterType}
            value={filterOption}
            checked={stateValue === filterOption}
            onChange={() => handleChange(filterType, filterOption)}
          />
          {filterOption}
        </label>
      ))}
    </div>
  );
};

/**
 * Component for rendering dropdown style filters. (mainly for topic selection)
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<string>} props.dropdownList - List of dropdown options.
 * @param {string} props.title - Title of the filter.
 * @param {string} props.promptOption - Prompt option for the dropdown.
 * @param {string} props.stateValue - Current state value of the filter.
 * @param {function} props.handleChange - Function to handle filter change.
 * @returns {JSX.Element} The FilterDropdown component.
 */
const FilterDropdown = ({
  dropdownList,
  title,
  promptOption,
  stateValue,
  handleChange,
}) => {
  return (
    <div className="rounded-lg bg-gray-100 p-2 pt-0 shadow-md m-2 font-bold text-[0.9rem]">
      <h3 className="m-1 font-bold text-sm">{title}</h3>
      <select
        value={stateValue}
        onChange={(e) => handleChange("topic", e.target.value)}
        className="border-2 border-gray-700 rounded-lg p-1 w-full"
      >
        <option className="m-1" value="">
          {promptOption}
        </option>
        {dropdownList.map((topic, i) => (
          <option key={topic + i} value={topic}>
            {topic.length < 20 ? topic : topic.slice(0, 20) + "..."}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * Component for rendering the control panel with filters.
 *
 * @component
 * @returns {JSX.Element} The ControlPanel component.
 */
const ControlPanel = () => {
  const { transcriptData } = useSocketData();
  const [filterState, setFilterState] = useState(defaultFilters);
  const [availableTopics, setAvailableTopics] = useState([]);
  const { setFilters } = useFilter();
  const loadedStartRef = useRef(null);
  const loadedEndRef = useRef(null);

  // Keep filters in step with the loaded transcript. The timeline filter hides every line
  // after its timestamp, so a filter left at the previous transcript's end time would hide
  // all of a later session (the diagram shows up empty until the page is refreshed).
  useEffect(() => {
    if (!transcriptData || transcriptData.length === 0) return;
    const start = transcriptData[0].timestamp;
    const end = transcriptData[transcriptData.length - 1].timestamp;

    if (loadedStartRef.current !== null && start !== loadedStartRef.current) {
      // A different transcript was uploaded: start again from default filters.
      const resetValue = { ...defaultFilters, timestamp: end };
      setFilterState(resetValue);
      setFilters(resetValue);
    } else if (loadedEndRef.current !== null && end !== loadedEndRef.current) {
      // Same transcript grew (live feed): if the slider was at the end, follow the new end.
      setFilterState((current) => {
        if (current.timestamp !== loadedEndRef.current) return current;
        const followed = { ...current, timestamp: end };
        setFilters(followed);
        return followed;
      });
    }

    loadedStartRef.current = start;
    loadedEndRef.current = end;
  }, [transcriptData, setFilters]);

  useEffect(() => {
    if (!transcriptData) return;
    const uniqueTopics = new Set();
    transcriptData.forEach((line) => {
      if (line.turn === "robot") {
        uniqueTopics.add(line.topic);
      }
    });
    setAvailableTopics([...uniqueTopics]);
  }, [transcriptData]);

  const resetFilters = () => {
    const resetValue = {
      ...defaultFilters,
      timestamp: filterState.timestamp,
    };
    setFilterState(resetValue);
    setFilters(resetValue);
  };

  const applyFilter = (filter, value) => {
    const newFilters = { ...filterState, [filter]: value };
    setFilterState(newFilters);
    setFilters(newFilters);
  };

  if (!transcriptData) return <div>Loading...</div>;

  return (
    <div className="bottom-0 mx-auto pr-3 pb-1 bg-gray-700 rounded-lg shadow-md w-50 max-w-full overflow-x-hidden">
      <div className="flex flex-wrap justify-center">
        {/* Speaker filter */}
        <FilterRadioButton
          data={turnList}
          title={"Speaker"}
          filterType={"turn"}
          stateValue={filterState.turn}
          handleChange={applyFilter}
        />

        {/* Sentiment filter */}
        <FilterRadioButton
          data={sentimentList}
          title={"Sentiment"}
          filterType={"sentiment"}
          stateValue={filterState.sentiment}
          handleChange={applyFilter}
        />

        {/* Emotion filter */}
        <FilterRadioButton
          data={emotionList}
          title={"Emotion"}
          filterType={"emotion"}
          stateValue={filterState.emotion}
          handleChange={applyFilter}
        />

        {/* Topic filter */}
        <FilterDropdown
          dropdownList={availableTopics}
          title={"Topic Filter"}
          promptOption={"Select Topic"}
          stateValue={filterState.topic}
          handleChange={applyFilter}
        />

        {/* Keyword filter */}
        <FilterRadioButton
          data={["yes", "no"]}
          title={"Use the safety list?"}
          filterType={"keywords"}
          stateValue={filterState.keywords ? "yes" : "no"}
          handleChange={(filter, value) => applyFilter(filter, value === "yes")}
        />

        {/* Reset button */}
        <div className="rounded-lg bg-gray-100 p-2 shadow-md m-2">
          <button
            className="select-none cursor-pointer rounded-lg border-2 border-gray-700 py-1 px-2 font-bold text-gray-700 text-sm w-full"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </div>

      {/* TimeLine component */}
      <TimeLine timestamp={filterState.timestamp} selectTime={applyFilter} />
    </div>
  );
};

export default ControlPanel;
