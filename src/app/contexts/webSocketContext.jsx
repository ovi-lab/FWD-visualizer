'use client'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [transcriptData, setTranscriptData] = useState(null);
  const [diagramData, setDiagramData] = useState(null);

 // Callback to handle incoming data
 const handleDiagramResponse = useCallback((newData) => {
  setDiagramData(newData);
}, []);

useEffect(() => {
  // Initialize socket connection
  const newSocket = io(":6400", {
      cors: {
          origin: "http://127.0.0.1:6400",
          methods: ["GET", "POST"]
      }
  });
  setSocket(newSocket);

  // Set up event listener for 'diagram-response'
  newSocket.on("diagram-response", handleDiagramResponse);

  // Emit a request for diagram data
  newSocket.emit("diagramRequest");

  // Cleanup function to disconnect socket when component unmounts
  return () => {
      newSocket.off("diagram-response", handleDiagramResponse);
      newSocket.disconnect();
  };
}, [handleDiagramResponse]);

  return (
    <WebSocketContext.Provider value={{socket: socket, transcriptData: transcriptData, diagramData: diagramData}}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
