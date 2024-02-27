"use client";
import {useEffect, useState } from "react";
import { useTime } from '../contexts/timeContext'

export default function TimeLine() {
  const [start, setStart] = useState('1970-01-01 16:26:30');
  const [end, setEnd] = useState('1970-01-01 16:26:31');
  const [steps, setSteps] = useState(0)
  const {selectedTime, setSelectedTime} = useTime()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("../../data/raw/log-02-20.json")
      .then((res) => res.json())
      .then((data) => {
        const start = data.at(-1).timestamp
        const final = data.at(0).timestamp
        console.log('Date.parse(start)', Date.parse(start))
        console.log('Date.parse(final)', Date.parse(final))
        console.log('Date.parse(final)', )
        setStart(start);
        setEnd(final);
        setSelectedTime(final);
        setSteps(Math.ceil(((Date.parse(final)-Date.parse(start))/data.length)/1000))
        setLoading(false)
      });
  }, [setSelectedTime]);
  
  const handleTimeSelect = (e) => {
   // Parse the input value as a date string
  const selectedDate = new Date(Number(e.target.value));
  // Check if the parsed date is valid
  if (!isNaN(selectedDate.getTime())) {
    // If the date is valid, update the selected time in the context
    setSelectedTime(selectedDate.toString()); 
  }
  }
  console.log('steps', steps)
if (loading) return <p> Loading</p>

else return (
    <div >
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
          {(selectedTime)}
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
        className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
        onChange={handleTimeSelect}
      />
    </div>
  );
}
