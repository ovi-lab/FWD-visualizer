"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useTime } from "@/app/contexts/timeContext";
import { useWebSocket } from "@/app/contexts/webSocketContext";

export default function TimeLine() {
  const {socket} = useWebSocket()
  const [data, setData] = useState([]);
  const { selectedTime, setSelectedTime } = useTime();

  const handleResponse = useCallback((newData) => {
    setData(newData);
  }, []);

  useEffect(() => {
    if (!socket) return;
    // Listen for data updates from the Flask server
    socket.emit("transcriptRequest");
  }, [socket]);
  
  useEffect(() => {
    if (!socket) return;
    socket.on("transcript-response", handleResponse
    );
  });

  const { start, end, steps } = useMemo(() => {
    if (data.length === 0) {
      return { start: "", end: "", steps: 10000 }; // default to 10 seconds if no data
    }
    const startTime = data[0]?.timestamp;
    const endTime = data[data.length - 1]?.timestamp;
    setSelectedTime(endTime)
    const totalDuration = Date.parse(endTime) - Date.parse(startTime);
    const fullIntervals = Math.floor(totalDuration / 10000);
    const remainder = totalDuration % 10000;
    const totalIntervals = remainder > 0 ? fullIntervals + 1 : fullIntervals;
    const stepSize = totalDuration / totalIntervals; // Adjust step size to exactly fit the range

    return { start: startTime, end: endTime, steps: stepSize };
  }, [data]);


  const handleTimeSelect = (e) => {
    // Parse the input value as a date string
    const selectedDate = new Date(Number(e.target.value));
    // Check if the parsed date is valid
    if (!isNaN(selectedDate.getTime())) {
      // If the date is valid, update the selected time in the context
      setSelectedTime(selectedDate.toString());
    }
  };


  if (!data || data.length === 0)
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
            {selectedTime}
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
          defaultValue={Date.parse(selectedTime)}
          className="w-full h-3 bg-blue-300 rounded-lg appearance-none cursor-pointer"
          onChange={handleTimeSelect}
        />
      </div>
    );
}
