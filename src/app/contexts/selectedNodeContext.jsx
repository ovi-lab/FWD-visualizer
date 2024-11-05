'use client'
import React, { createContext, useState, useContext } from 'react';

const SelectedNodeContext = createContext();

/**
 * component that provides the selected node context to its children. e.g. When the user clicks on a node in the Sankey diagram, the node is highlighted and the information panel displays the sentences in this topic to be clicked.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components that will have access to the selected node context.
 * @returns {JSX.Element} The provider component that wraps its children with the selected node context.
 */
export const SelectedNodeProvider = ({ children }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <SelectedNodeContext.Provider value={{ selectedNode, setSelectedNode }}>
      {children}
    </SelectedNodeContext.Provider>
  );
};

export const useSelectedNode = () => useContext(SelectedNodeContext);