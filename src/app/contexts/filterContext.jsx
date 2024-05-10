'use client'
import React, { createContext, useState, useContext, useEffect} from 'react';
import { useSocketData } from './socketDataContext';
import { filterData } from '../utils/filters';
import { link } from 'fs';
import ArcDiagram from '../dashboard/diagrams/arc/page';

const FilterContext = createContext();

const defaultFilters = {turn: "",
sentiment: "",
emotion: "",
topic: "",
keywords: false,
timestamp: "1970-01-01 16:26:31"}

const defaultFilteredDiagramData = {
  nodes: [],
  links: {
    haru: [],
    user: [],
  },
  attributes: {}
}

export const FilterProvider = ({ children }) => {
  const {transcriptData, diagramData} = useSocketData();
  const [filters, setFilters] = useState(defaultFilters);
  const [filteredTranscript, setFilteredTranscript] = useState([])
  const [filteredDiagram, setFilteredDiagram] = useState(defaultFilteredDiagramData)

  useEffect(() => {
    if (!transcriptData || !diagramData) return

    setFilteredTranscript(filterData(transcriptData, filters))
    
    const filteredNodes = filterData(diagramData.nodes, filters)
    const filteredHaruLinks = filterData(diagramData.links.haru, filters)
    const filteredUserLinks = filterData(diagramData.links.user, filters)

    setFilteredDiagram({nodes: filteredNodes, links: {haru: filteredHaruLinks, user: filteredUserLinks}, attributes: diagramData.attributes})
    
  }, [filters, transcriptData, diagramData])
  

  return (
    <FilterContext.Provider value={{ filters, setFilters , filteredTranscript, filteredDiagram}}>
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