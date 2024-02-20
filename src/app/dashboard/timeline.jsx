"use client";
import { useContext, useEffect, useState } from "react";
import { useTime } from '../contexts/timeContext'
export default function TimeLine() {
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(2);
  const [selectedTime, setSelectedTime] = useState("");
  const {currentTime, setCurrentTime} = useTime()

  useEffect(() => {
    fetch("../../data/new_robot_data_2_20.json")
      .then((res) => res.json())
      .then((data) => {
        setStart(new Date(data.nodes.at(-1).interactions.at(-1).timestamp));
        const end = new Date(data.nodes.at(0).interactions.at(0).timestamp);
        console.log(end)
        setEnd(end);
        setSelectedTime(end);
      });
  }, []);

  const minTime = Date.parse(start);
  const maxTime = Date.parse(end);
  const timeStep = maxTime/minTime;

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <label
          htmlFor="steps-range"
          className="text-sm font-medium text-gray-900 mr-auto"
        >
          Left Text
        </label>
        <label
          htmlFor="steps-range"
          className="text-sm font-medium text-gray-900 mx-auto"
        >
          Center Text
        </label>
        <label
          htmlFor="steps-range"
          className="text-sm font-medium text-gray-900 ml-auto"
        >
          Right Text
        </label>
      </div>
      <input
        id="steps-range"
        type="range"
        min={minTime}
        max={maxTime}
        step={timeStep}
        className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}
