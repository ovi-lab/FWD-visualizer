'use client'
import React, { createContext, useState, useContext} from 'react';

const DataSourceContext = createContext();

const defaultDataSource = "staticFetch"

export const DataSourceProvider = ({ children }) => {
  const [dataSource, setDataSource] = useState(defaultDataSource);

  return (
    <DataSourceContext.Provider value={{ dataSource, setDataSource }}>
      {children}
    </DataSourceContext.Provider>
  );
};

export const useDataSource = () => {
  const context = useContext(DataSourceContext);
  if (!context) {
    throw new Error('useDataSource must be used within a DataSourceProvider');
  }
  return context;
};