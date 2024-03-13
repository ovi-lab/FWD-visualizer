'use client'
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FilterContextType {
  selectedFilter: string;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string>>;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('');

  return (
    <FilterContext.Provider value={{ selectedFilter, setSelectedFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};