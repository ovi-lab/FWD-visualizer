"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the context's value
interface SelectedColourContextType {
  selectedColour: string[];
  setSelectedColour: React.Dispatch<React.SetStateAction<string[]>>;
}

// Create the context with a default value of `undefined` (initially unset)
const SelectedColourContext = createContext<
  SelectedColourContextType | undefined
>(undefined);

// Provider component that supplies the context's value to children
export const SelectedColourProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedColour, setSelectedColour] = useState<string[]>([
    "#8CD0C7",
    "#F4EC90",
    "#c8a7c9",
    "#FE7F70",
    "#81B1D1",
    "#FEB363",
    "#B2DD6A",
    "#FDCDE4",
    "#d1d1d1",
    "#edcfa6",
    "#bca498",
  ]);

  return (
    <SelectedColourContext.Provider
      value={{ selectedColour, setSelectedColour }}
    >
      {children}
    </SelectedColourContext.Provider>
  );
};

// Custom hook to use the context
export const useSelectedColour = () => {
  const context = useContext(SelectedColourContext);
  if (!context) {
    throw new Error(
      "useSelectedColour must be used within a SelectedColourProvider"
    );
  }
  return context;
};

export default SelectedColourContext;
