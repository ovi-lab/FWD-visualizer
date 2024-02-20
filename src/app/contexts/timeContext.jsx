'use client'
import React, { createContext, useState, useContext } from 'react';

const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
  const [selectedTime, setSelectedTime] = useState('')

  return (
    <TimeContext.Provider value={{ selectedTime, setSelectedTime }}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = () => useContext(TimeContext);