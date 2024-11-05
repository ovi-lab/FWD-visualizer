// Import "use client", createContext, useContext, and useState to use context
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the types for the context
interface DarkModeContextType {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
);

// Provider component
export const DarkModeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

// Custom hook to use the context
export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode called outside of DarkModeProvider");
  }
  return context;
};
