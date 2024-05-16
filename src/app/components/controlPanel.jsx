"use client";
import React, { useState, useEffect, useCallback, use } from "react";
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

const turnList = ["haru", "user"];
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
 * Component for rendering checkbox style filters.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array<string>} props.data - List of filter options.
 * @param {string} props.title - Title of the filter.
 * @param {string} props.filterType - Type of the filter.
 * @param {string} props.stateValue - Current state value of the filter.
 * @param {function} props.handleChange - Function to handle filter change.
 * @returns {JSX.Element} The FilterCheckbox component.
 */
const FilterCheckbox = ({
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
          className="select-none cursor-pointer rounded-lg border-2 border-gray-700 m-1
   py-1 px-2 font-bold text-gray-700 text-sm transition-colors duration-200 ease-in-out has-[:checked]:bg-green-100 has-[:checked]:text-gray-700 has-[:checked]:border-gray-700 "
        >
          <input
            type="checkbox"
            id={`${filterType}:${filterOption}-filter`}
            className="peer hidden checked:bg-green-100"
            name="data-direction"
            value="haru-user"
            checked={stateValue === filterOption}
            onChange={() => {
              if (stateValue === filterOption)
                handleChange(filterType, defaultFilters[filterType]);
              else handleChange(filterType, filterOption);
            }}
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
      >
        <option className="m-1 " value="">
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
  // States to store filter selections
  const { transcriptData } = useSocketData();
  const [filterState, setFilterState] = useState(defaultFilters);
  const [availableTopics, setAvailableTopics] = useState([]);
  const { setFilters } = useFilter();

  useEffect(() => {
    if (!transcriptData) return;
    // Create a new Set to collect unique topics where 'turn' is 'haru'
    const uniqueTopics = new Set();

    // Iterate over the data array to filter out unique 'haru' topics
    transcriptData.forEach((line) => {
      if (line.turn === "haru") {
        uniqueTopics.add(line.topic);
      }
    });

    // Convert the Set back to an array and update the state
    setAvailableTopics([...uniqueTopics]);
  }, [transcriptData]);

  /**
   * Sets all the filter states to their default values
   * and also applies them to the selectedFilters context to reset any filtered components
   */
  const resetFilters = () => {
    const resetValue = {...defaultFilters, ["timestamp"]: filterState.timestamp}
    setFilterState(resetValue);
    setFilters(resetValue);
  };

  /**
   * Applies a filter and updates the filter state and context.
   *
   * @param {string} filter - The filter type.
   * @param {string|boolean} value - The value to set for the filter.
   */
  const applyFilter = (filter, value) => {
    const newFilters = { ...filterState, [filter]: value };
    setFilterState(newFilters);
    setFilters(newFilters);
  };

  if (!transcriptData) return <div>loading</div>;

  return (
    <div className="bottom-0 mr-auto ml-auto pb-1 bg-gray-700 rounded-lg shadow-md">
      <div className="flex">
        {/* Speaker filter */}
        <FilterCheckbox
          data={turnList}
          title={"Speaker"}
          filterType={"turn"}
          stateValue={filterState.turn}
          handleChange={applyFilter}
        />

        {/* Sentiment filter */}

        <FilterCheckbox
          data={sentimentList}
          title={"Sentiment"}
          filterType={"sentiment"}
          stateValue={filterState.sentiment}
          handleChange={applyFilter}
        />

        {/* Emotion filter */}
        <FilterCheckbox
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
        <FilterCheckbox
          data={["yes", "no"]}
          title={"Use the safety list?"}
          filterType={"keywords"}
          stateValue={filterState.keywords}
          handleChange={applyFilter}
        />

        {/* Button to apply filters */}
        <div className="flex-left rounded-lg bg-gray-100 p-1 shadow-md m-2">
          <button
            className="select-none cursor-pointer rounded-lg border-2 border-gray-700 m-1 py-1 px-2 font-bold text-gray-700 text-sm"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </div>
      <TimeLine timestamp={filterState.timestamp} selectTime={applyFilter} />
    </div>
  );
};

export default ControlPanel;
