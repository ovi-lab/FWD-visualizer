'use client'
import React, { createContext, useState, useContext } from 'react';

const SelectedContext = createContext();

export const SelectedProvider = ({ children }) => {
  const [selected, setSelected] = useState(null);

  return (
    <SelectedContext.Provider value={{ selected, setSelected }}>
      {children}
    </SelectedContext.Provider>
  );
};

export const useSelected = () => useContext(SelectedContext);