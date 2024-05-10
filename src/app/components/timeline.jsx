"use client";
import { useMemo } from "react";
import { useFilter } from "@/app/contexts/filterContext";
import { useSocketData } from "@/app/contexts/socketDataContext";

export default function TimeLine() {
  const { transcriptData } = useSocketData();
  const {filters, setFilters} = useFilter();

  const { start, end, steps } = useMemo(() => {
    if (transcriptData.length === 0) {
      return { start: "", end: "", steps: 10000 }; // default to 10 seconds if no data
    }
    const startTime = transcriptData[0]?.timestamp;
    const endTime = transcriptData[transcriptData.length - 1]?.timestamp;
    setFilters({...filters, ["timestamp"]: endTime});
    const totalDuration = Date.parse(endTime) - Date.parse(startTime);
    const fullIntervals = Math.floor(totalDuration / 10000);
    const remainder = totalDuration % 10000;
    const totalIntervals = remainder > 0 ? fullIntervals + 1 : fullIntervals;
    const stepSize = totalDuration / totalIntervals; // Adjust step size to exactly fit the range

    return { start: startTime, end: endTime, steps: stepSize };
  }, [transcriptData]);

  const handleTimeSelect = (e) => {
    // Parse the input value as a date string
    const selectedDate = new Date(Number(e.target.value));
    // Check if the parsed date is valid
    if (!isNaN(selectedDate.getTime())) {
      // If the date is valid, update the selected time in the context
      setFilters({...filters, ["timestamp"]: selectedDate.toString()});
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
            {filters.timestamp}
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
          defaultValue={Date.parse(filters.timestamp)}
          className="w-full h-3 bg-blue-300 rounded-lg appearance-none cursor-pointer"
          onChange={handleTimeSelect}
        />
      </div>
    );
}
