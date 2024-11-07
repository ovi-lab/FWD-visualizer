"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the context's value
interface VisibleDivsContextType {
  visibleDivs: string[];
  setVisibleDivs: React.Dispatch<React.SetStateAction<string[]>>;
}

// Create the context with a default value of `undefined` (initially unset)
const VisibleDivsContext = createContext<VisibleDivsContextType | undefined>(
  undefined
);

// Provider component that supplies the context's value to children
export const VisibleDivsProvider = ({ children }: { children: ReactNode }) => {
  const [visibleDivs, setVisibleDivs] = useState<string[]>([]);

  return (
    <VisibleDivsContext.Provider value={{ visibleDivs, setVisibleDivs }}>
      {children}
    </VisibleDivsContext.Provider>
  );
};

// Custom hook to use the context
export const useVisibleDivs = () => {
  const context = useContext(VisibleDivsContext);
  if (!context) {
    throw new Error("useVisibleDivs must be used within a VisibleDivsProvider");
  }
  return context;
};

export default VisibleDivsContext;
