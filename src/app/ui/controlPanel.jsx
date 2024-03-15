"use client";
import React, { useState, useEffect } from "react";
import { useFilter } from "../contexts/filterContext";
import TimeLine from "./timeline";
import { io } from "socket.io-client";

// Example predefined keywords
const predefinedKeywords = ["keyword1", "keyword2", "keyword3"];

const FilterCheckbox = ({ title, data, filterType, stateValue, onChange }) => {
  return (
    <div className="rounded-lg bg-gray-100 p-2 pt-0 shadow-md m-2">
      <h3 className="m-1 font-bold text-sm">{title}</h3>
      {data.map((filterCategory) => (
        <label
          key={filterCategory}
          htmlFor={`${filterCategory}-filter`}
          className="select-none cursor-pointer rounded-lg border-2 border-gray-700 m-1
   py-1 px-2 font-bold text-gray-700 text-sm transition-colors duration-200 ease-in-out has-[:checked]:bg-green-100 has-[:checked]:text-gray-700 has-[:checked]:border-gray-700 "
        >
          <input
            type="checkbox"
            id={`${filterCategory}-filter`}
            className="peer hidden checked:bg-green-100"
            name="data-direction"
            value="haru-user"
            checked={stateValue === filterCategory}
            onChange={() => onChange(filterType, filterCategory)}
          />
          {filterCategory}
        </label>
      ))}
    </div>
  );
};

// Component for the control panel
const ControlPanel = () => {
  // States to store filter selections
  const [data, setData] = useState([])
  const [turnFilter, setTurnFilter] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("");
  const [emotionFilter, setEmotionFilter] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [availableTopics, setAvailableTopics] = useState([]);
  const [keywordFilter, setKeywordFilters] = useState(false);
  const { setSelectedFilters } = useFilter();

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

  useEffect(() => {

    const socket = io(":6400", {cors: {origin: 'http://127.0.0.1:6400', methods: ['GET', 'POST']}});
    // Listen for data updates from the Flask server
    socket.on("linear_updates", (newData) => {
      console.log('newData', newData)
      setData(newData);
    });

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const topics = data
    .filter((node) => node.turn === "haru")
    .map((d) => d.topic);
  setAvailableTopics(topics);
  }, [data])

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
    console.log('filter', filter)
    console.log('value', value)
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
        console.log("value", value);
        setKeywordFilters(value);
      default:
        break;
    }
  };

  return (
    <div className="control-panel rounded-lg bg-gray-700 p-0 shadow-md mx-2 pb-1">
      <div className="flex">
        {/* Speaker filter */}
        <FilterCheckbox
          data={turns}
          title={"Speaker"}
          filterType={"turn"}
          stateValue={turnFilter}
          onChange={handleCheck}
        />

        {/* Sentiment filter */}

        <FilterCheckbox
          data={sentiments}
          title={"Sentiment"}
          filterType={"sentiment"}
          stateValue={sentimentFilter}
          onChange={handleCheck}
        />

        {/* Emotion filter */}
        <FilterCheckbox
          data={emotions}
          title={"Emotion"}
          filterType={"emotion"}
          stateValue={emotionFilter}
          onChange={handleCheck}
        />
        {/* Topic filter */}
        <div className="rounded-lg bg-gray-100 p-2 pt-0 shadow-md m-2">
          <h3 className="m-1 font-bold text-sm">Topic Filter</h3>
          <select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value);
            }}
          >
            <option value="">Select Topic</option>
            {availableTopics.toReversed().map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        {/* Keyword filter */}
        <FilterCheckbox
          data={["yes", "no"]}
          title={"Use the safety list?"}
          filterType={"keywords"}
          stateValue={keywordFilter}
          onChange={handleCheck}
        />

        {/* Button to apply filters */}
        <div className="flex-left rounded-lg bg-gray-100 p-1 shadow-md m-2">
          <button
            className="select-none cursor-pointer rounded-lg border-2 border-gray-700 m-1
     py-1 px-2 font-bold text-gray-700 text-sm"
            onClick={applyFilters}
          >
            Apply
          </button>
          <button
            className="select-none cursor-pointer rounded-lg border-2 border-gray-700 m-1
     py-1 px-2 font-bold text-gray-700 text-sm"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </div>

      <TimeLine />
    </div>
  );
};

// Example usage:
// Wrap your app with FilterContext.Provider to provide access to filter selections
// <FilterContext.Provider value={filters}><App /></FilterContext.Provider>
// In any child component, use useContext(FilterContext) to access filter selections

export default ControlPanel;
