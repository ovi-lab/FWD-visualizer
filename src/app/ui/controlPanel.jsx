"use client";
import React, { useState } from "react";
import { useFilter } from "../contexts/filterContext";


// Example predefined keywords
const predefinedKeywords = ["keyword1", "keyword2", "keyword3"];

// Component for the control panel
const ControlPanel = () => {
  // States to store filter selections
  const [turnFilter, setTurnFilter] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("");
  const [emotionFilter, setEmotionFilter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [keywordFilter, setKeywordFilters] = useState(false);
  const { setSelectedFilters } = useFilter();

  const topics = [1, 2, 3, 4, 5];
  const turns = ["haru", "user"];
  const sentiments = ["positive", "neutral", "negative"];
  const emotions = [
    "anger",
    "disgust",
    "fear",
    "joy",
    "neutral",
    "sadness",
    "surprise",
  ];

  const FilterCheckbox = ({
    labelText: labelText,
    filterType,
    filterValue,
    stateValue,
    onChange,
  }) => {
    return (
      <label
        htmlFor={`${filterValue}-filter`}
        className="select-none cursor-pointer rounded-lg border-2 border-gray-700 m-1
     py-1 px-2 font-bold text-gray-700 text-sm transition-colors duration-200 ease-in-out has-[:checked]:bg-green-100 has-[:checked]:text-gray-700 has-[:checked]:border-gray-700 "
      >
        <input
          type="checkbox"
          id={`${filterValue}-filter`}
          className="peer hidden checked:bg-green-100"
          name="data-direction"
          value="haru-user"
          checked={stateValue === filterValue}
          onChange={() => onChange(filterType, filterValue)}
        />
        {labelText}
      </label>
    );
  };

  // Function to handle applying filters
  const applyFilters = () => {
    // Combine all filter selections into one object
    const filters = {
      turn: turnFilter,
      sentiment: sentimentFilter,
      emotion: emotionFilter,
      topic: selectedTopic,
      keywords: keywordFilter,
    };
    setSelectedFilters(filters);
    // Put filters into context
    // You can use this context in child components to access filter selections
    // Remember to wrap your app with FilterContext.Provider
    // e.g., <FilterContext.Provider value={filters}><App /></FilterContext.Provider>
    console.log("Filters:", filters);
  };

  const resetFilters = () => {
    setTurnFilter("");
    setSentimentFilter("");
    setEmotionFilter("");
    setSelectedTopic("");
    setKeywordFilters(false);
    const filters = {
      turn: "",
      sentiment: "",
      emotion: "",
      topic: "",
      keywords: false,
    };
    setSelectedFilters(filters);
  };

  const handleCheck = (filter, value) => {
    switch (filter) {
      case "turn":
        setTurnFilter(value);
        break;
      case "sentiment":
        setSentimentFilter(value);
        break;
      case "emotion":
        setEmotionFilter(value);
        break;
      case "keywords":
        setKeywordFilters(value);
      default:
        break;
    }
  };

  return (
    <div className="control-panel rounded-lg bg-gray-700 p-0 shadow-md m-2">
      <div className="flex">
        {/* Speaker filter */}
        <div className="rounded-lg bg-gray-100 p-2 pt-0 shadow-md m-2">
          <h3 className="m-3">Speaker</h3>
          {turns.map((turn) => (
            <FilterCheckbox
              key={turn}
              labelText={turn}
              filterType={"turn"}
              filterValue={turn}
              stateValue={turnFilter}
              onChange={handleCheck}
            />
          ))}
        </div>

        {/* Sentiment filter */}
        <div className="rounded-lg bg-gray-100 p-2 pt-0 shadow-md m-2">
          <h3 className="m-3">Sentiment</h3>
          {sentiments.map((senti) => (
            <FilterCheckbox
              key={senti}
              labelText={senti}
              filterType={"sentiment"}
              filterValue={senti.substring(0, 3)} //storing the value as the first 3 chars to keep parity with backend
              stateValue={sentimentFilter}
              onChange={handleCheck}
            />
          ))}
        </div>
        {/* Emotion filter */}
        <div className="rounded-lg bg-gray-100 p-2 pt-0 shadow-md m-2">
          <h3 className="m-3">Emotion</h3>
          {emotions.map((emo) => (
            <FilterCheckbox
              key={emo}
              labelText={emo}
              filterType={"emotion"}
              filterValue={emo}
              stateValue={emotionFilter}
              onChange={handleCheck}
            />
          ))}
        </div>
        {/* Topic filter */}
        <div className="rounded-lg bg-gray-100 p-2 pt-0 shadow-md m-2">
          <h3 className="m-3">Topic</h3>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="">Select Topic</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
        {/* Keyword filter */}
        <div className="rounded-lg bg-gray-100 p-2 pt-0 shadow-md m-2">
          <h3 className="m-3">Filter with the safety list?</h3>
          {["yes", "no"].map((keySelect) => (
            <FilterCheckbox
              key={keySelect}
              labelText={keySelect}
              filterType={"keywords"}
              filterValue={keySelect === "yes" ? true : false}
              stateValue={keywordFilter}
              onChange={handleCheck}
            />
          ))}
        </div>
      </div>

      <div className="flex">
        {/* Button to apply filters */}
        <div className="rounded-lg bg-gray-100 p-1 shadow-md m-2">
          <button className="select-none cursor-pointer rounded-lg border-2 border-gray-700 m-1
     py-1 px-2 font-bold text-gray-700 text-sm">
     Apply Filters
          </button>
          <button className="select-none cursor-pointer rounded-lg border-2 border-gray-700 m-1
     py-1 px-2 font-bold text-gray-700 text-sm" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// Example usage:
// Wrap your app with FilterContext.Provider to provide access to filter selections
// <FilterContext.Provider value={filters}><App /></FilterContext.Provider>
// In any child component, use useContext(FilterContext) to access filter selections

export default ControlPanel;
