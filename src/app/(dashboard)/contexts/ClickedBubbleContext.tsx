// Import "use client", createContext, useContext, and useState to use context
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the types for the context
/* Define context type
   interface varContextType {
    var: type1 | type2;
    setVar: React.Dispatch<React.SetStateAction<type1 | type2>>;
   } 
   * React.Dispatch: function that takes one argument and returns nothing (void function)
   * <React.SetStateAction<Type>: a type for the argument that can be passed to setState functions    
*/
interface ClickedBubbleContextType {
  clickedBubble: string | null;
  setClickedBubble: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create the context
/* Create Context
   const varContext = createContext<varContextType | undefined>(undefined); */
const ClickedBubbleContext = createContext<
  ClickedBubbleContextType | undefined
>(undefined);

// Provider component
/* 
   Create provider to provide the 'clickedBubble' state and the 'setClickedBubble' React Functional Component (FC)function to any component nested inside varProvider

   export const varProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [var, setVar] = useState<type1 | type2>(null);
    return (
        <varContext.Provider value={{var, setVar}}>
            {children}
        </varContext.Provider>
    );
   };
*/
export const ClickedBubbleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Keep track of clickedBubble by updating with function setClickedBubble using useState
  const [clickedBubble, setClickedBubble] = useState<string | null>(null);
  // All child components passed to ClickedBubbleProvider will have access to the context values provided (clickedBubble and setClickedBubble)
  return (
    <ClickedBubbleContext.Provider value={{ clickedBubble, setClickedBubble }}>
      {children}
    </ClickedBubbleContext.Provider>
  );
};

// Custom hook to use the context
/*  Custom hook to use the context using useContext

    export const useClickedBubble = () => {
        const context = useContext(varContext);
        if(!context){
            throw new Error("error message")
        }
        return context;
    }

    * By convention, custom hooks in React start with the prefix use-
    * useContext allows the hook to access the current context value from context, 
      which was set up in the ClickedBubbleProvider
    * Safeguard to prevent potential errors or undefined behavior when trying to access the context
    * Check whether context is undefined
      If useClickedBubble is being called outside of a ClickedBubbleProvider, an error is thrown
*/
export const useClickedBubble = () => {
  const context = useContext(ClickedBubbleContext);
  if (!context) {
    throw new Error("useClickedBubble called outside of ClickedBubbleProvider");
  }
  return context;
};
