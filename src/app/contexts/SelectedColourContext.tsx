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
  const [selectedColour, setSelectedColour] = useState<string[]>([]);

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
