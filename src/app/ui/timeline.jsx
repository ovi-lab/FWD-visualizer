"use client";
import { useEffect, useState } from "react";
import { useTime } from "../contexts/timeContext";
import io from "socket.io-client";

export default function TimeLine() {
  const [data, setData] = useState([]);
  const [start, setStart] = useState("1970-01-01 16:26:30");
  const [end, setEnd] = useState("1970-01-01 16:26:31");
  const [steps, setSteps] = useState(0);
  const { selectedTime, setSelectedTime } = useTime();

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
    console.log("data", data);
    if (!data || data.length === 0) return;
    const start = data.at(-1).timestamp;
    const final = data.at(0).timestamp;
    setStart(start);
    setEnd(final);
    setSelectedTime(final);
    setSteps(
      Math.ceil((Date.parse(final) - Date.parse(start)) / data.length / 1000)
    );
  }, [data, setSelectedTime]);

  const handleTimeSelect = (e) => {
    // Parse the input value as a date string
    const selectedDate = new Date(Number(e.target.value));
    // Check if the parsed date is valid
    if (!isNaN(selectedDate.getTime())) {
      // If the date is valid, update the selected time in the context
      setSelectedTime(selectedDate.toString());
    }
  };

  const handlePlay = (e) => {};

  if (!data || data.length === 0)
    return (
      <div className=" rounded-lg bg-gray-100 p-1 shadow-md m-2">Loading</div>
    );
  else
    return (
      <div className=" rounded-lg bg-gray-100 p-1 shadow-md m-2">
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
          className="w-full h-2 bg-blue-300 rounded-lg appearance-none cursor-pointer"
          onChange={handleTimeSelect}
        />
      </div>
    );
}
