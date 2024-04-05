'use client'
import React, { createContext, useState, useContext} from 'react';

const FilterContext = createContext();

const defaultFilter = {turn: "",
sentiment: "",
emotion: "",
topic: "",
keywords: false,}

export const FilterProvider = ({ children }) => {
  const [selectedFilters, setSelectedFilters] = useState(defaultFilter);

  return (
    <FilterContext.Provider value={{ selectedFilters, setSelectedFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};