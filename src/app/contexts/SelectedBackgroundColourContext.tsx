"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the context's value
interface SelectedBackgroundColourContextType {
  selectedBackgroundColour: string;
  setSelectedBackgroundColour: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context with a default value of `undefined` (initially unset)
const SelectedBackgroundColourContext = createContext<
  SelectedBackgroundColourContextType | undefined
>(undefined);

// Provider component that supplies the context's value to children
export const SelectedBackgroundColourProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedBackgroundColour, setSelectedBackgroundColour] =
    useState<string>("white");

  return (
    <SelectedBackgroundColourContext.Provider
      value={{ selectedBackgroundColour, setSelectedBackgroundColour }}
    >
      {children}
    </SelectedBackgroundColourContext.Provider>
  );
};

// Custom hook to use the context
export const useSelectedBackgroundColour = () => {
  const context = useContext(SelectedBackgroundColourContext);
  if (!context) {
    throw new Error(
      "useSelectedColour must be used within a SelectedColourProvider"
    );
  }
  return context;
};

export default SelectedBackgroundColourContext;
