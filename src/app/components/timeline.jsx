"use client";
import { useMemo, useEffect } from "react";
import { useSocketData } from "@/app/contexts/socketDataContext";

/**
 * TimeLine component renders a timeline slider to select a timestamp.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.timestamp - The current timestamp in filters.
 * @param {function} props.selectTime - Function to update the selected timestamp in filters.
 * @returns {JSX.Element} The TimeLine component.
 */
export default function TimeLine({timestamp, selectTime}) {
  const { transcriptData } = useSocketData();

  const { start, end, steps } = useMemo(() => {
    if (transcriptData.length === 0) {
      return { start: "", end: "", steps: 10000 }; // default to 10 seconds if no data
    }
    const startTime = transcriptData[0]?.timestamp;
    const endTime = transcriptData[transcriptData.length - 1]?.timestamp;
    const totalDuration = Date.parse(endTime) - Date.parse(startTime);
    const fullIntervals = Math.floor(totalDuration / 10000);
    const remainder = totalDuration % 10000;
    const totalIntervals = remainder > 0 ? fullIntervals + 1 : fullIntervals;
    const stepSize = totalDuration / totalIntervals; // Adjust step size to exactly fit the range

    return { start: startTime, end: endTime, steps: stepSize };
  }, [transcriptData]);

  useEffect(() => {
    if (end && timestamp === "") {
      selectTime("timestamp", end);
    }
  }, [end, timestamp]);

  const handleTimeSelect = (e) => {
    // Parse the input value as a date string
    const selectedDate = new Date(Number(e.target.value));
    // Check if the parsed date is valid
    if (!isNaN(selectedDate.getTime())) {
      // If the date is valid, update the selected time in the context
      selectTime("timestamp", selectedDate.toString());
    }
  };

  if (!transcriptData || transcriptData.length === 0)
    return (
      <div className=" rounded-lg bg-gray-100 p-1 shadow-md m-2">Loading</div>
    );
  else
    return (
      <div className="rounded-lg bg-gray-100 p-1 shadow-md m-2 w-100%">
        <div className="flex items-center justify-between">
          <label
            htmlFor="steps-range"
            className="text-sm font-medium text-gray-900 mr-auto"
          >
            {start}
          </label>
          <label
            htmlFor="steps-range"
            className="text-sm font-medium text-gray-900 mx-auto"
          >
            {timestamp}
          </label>
          <label
            htmlFor="steps-range"
            className="text-sm font-medium text-gray-900 ml-auto"
          >
            {end}
          </label>
        </div>
        <input
          id="steps-range"
          type="range"
          min={Date.parse(start)}
          max={Date.parse(end)}
          step={steps}
          defaultValue={Date.parse(timestamp)}
          className="w-full h-3 bg-blue-300 rounded-lg appearance-none cursor-pointer"
          onChange={handleTimeSelect}
        />
      </div>
    );
}
