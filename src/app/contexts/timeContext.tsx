'use client'
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TimeContextType {
  selectedTime: string | undefined;
  setSelectedTime: React.Dispatch<React.SetStateAction<string>>;
}

const TimeContext = createContext<TimeContextType | undefined>(undefined);

export const TimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedTime, setSelectedTime] = useState<string>("1970-01-01 16:26:31");

  return (
    <TimeContext.Provider value={{ selectedTime, setSelectedTime }}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = (): TimeContextType | undefined => {
  const context = useContext(TimeContext);
  if (!context) {
    throw new Error('useTime must be used within a TimeProvider');
  }
  return context;
};