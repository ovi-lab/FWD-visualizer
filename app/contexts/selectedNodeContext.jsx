'use client'
import React, { createContext, useState, useContext } from 'react';

const SelectedNodeContext = createContext();

export const SelectedNodeProvider = ({ children }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <SelectedNodeContext.Provider value={{ selectedNode, setSelectedNode }}>
      {children}
    </SelectedNodeContext.Provider>
  );
};

export const useSelectedNode = () => useContext(SelectedNodeContext);