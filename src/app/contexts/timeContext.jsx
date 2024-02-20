'use client'
import React, { createContext, useState, useContext } from 'react';

const TimeContext = createContext();

export const TimeProvider = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('')

  return (
    <TimeContext.Provider value={{ currentTime, setCurrentTime }}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = () => useContext(TimeContext);