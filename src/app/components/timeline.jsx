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
export default function TimeLine({ timestamp, selectTime }) {
  const { transcriptData } = useSocketData();

  const { start, end, stepSize } = useMemo(() => {
    if (transcriptData.length === 0) {
      return { start: "", end: "", stepSize: 10000 }; // default to 10 seconds if no data
    }

    const startTime = transcriptData[0]?.timestamp;
    const endTime = transcriptData[transcriptData.length - 1]?.timestamp;
    const totalDuration = Date.parse(endTime) - Date.parse(startTime);

    // Ensure at least one step to prevent division by zero
    const totalIntervals = Math.max(1, Math.floor(totalDuration / 10000));
    const remainder = totalDuration % 10000;
    const adjustedIntervals = remainder > 0 ? totalIntervals + 1 : totalIntervals;
    const stepSize = totalDuration / adjustedIntervals; // Adjust step size to fit the range

    return { start: startTime, end: endTime, stepSize };
  }, [transcriptData]);

  useEffect(() => {
    // If timestamp is empty or undefined, set it to the end time
    if (end && (!timestamp || timestamp === "")) {
      selectTime("timestamp", end);
    }
  }, [end, timestamp, selectTime]);

  const handleTimeSelect = (e) => {
    const selectedTimestamp = new Date(Number(e.target.value)).toISOString();
    selectTime("timestamp", selectedTimestamp);
  };

  if (!transcriptData || transcriptData.length === 0) {
    return (
      <div className="rounded-lg bg-gray-100 p-1 shadow-md m-2">Loading</div>
    );
  } else {
    return (
<div className="rounded-lg bg-gray-100 p-2 shadow-md m-2 w-full max-w-full overflow-x-hidden">
<div className="flex items-center justify-between mb-2">
          <label
            htmlFor="steps-range"
            className="text-sm font-medium text-gray-900"
          >
            {new Date(start).toLocaleTimeString()}
          </label>
          <label
            htmlFor="steps-range"
            className="text-sm font-medium text-gray-900"
          >
            {timestamp ? new Date(timestamp).toLocaleTimeString() : new Date(end).toLocaleTimeString()}
          </label>
          <label
            htmlFor="steps-range"
            className="text-sm font-medium text-gray-900"
          >
            {new Date(end).toLocaleTimeString()}
          </label>
        </div>
        <input
          id="steps-range"
          type="range"
          min={Date.parse(start)}
          max={Date.parse(end)}
          step={stepSize}
          value={Date.parse(timestamp || end)}
          className="w-full h-3 bg-blue-300 rounded-lg appearance-none cursor-pointer"
          onChange={handleTimeSelect}
        />
      </div>
    );
  }
}
