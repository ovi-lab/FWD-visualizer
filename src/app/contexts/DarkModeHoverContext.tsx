// Import "use client", createContext, useContext, and useState to use context
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the types for the context
interface DarkModeHoverContextType {
  darkModeHover: boolean;
  setDarkModeHover: React.Dispatch<React.SetStateAction<boolean>>;
}

const DarkModeHoverContext = createContext<
  DarkModeHoverContextType | undefined
>(undefined);

// Provider component
export const DarkModeHoverProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [darkModeHover, setDarkModeHover] = useState<boolean>(false);
  return (
    <DarkModeHoverContext.Provider value={{ darkModeHover, setDarkModeHover }}>
      {children}
    </DarkModeHoverContext.Provider>
  );
};

// Custom hook to use the context
export const useDarkModeHover = () => {
  const context = useContext(DarkModeHoverContext);
  if (!context) {
    throw new Error("useDarkMode called outside of DarkModeProvider");
  }
  return context;
};
