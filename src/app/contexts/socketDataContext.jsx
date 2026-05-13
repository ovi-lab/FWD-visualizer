"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import io from "socket.io-client";

const socketDataContext = createContext();

export const SocketDataProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [transcriptData, setTranscriptData] = useState(null);
  const [diagramData, setDiagramData] = useState(null);

  // Callback to handle incoming data
  const handleDiagramResponse = useCallback((newData) => {
    if (newData === undefined) return;
    setDiagramData(newData);
  }, []);

  const handleTranscriptResponse = useCallback((newData) => {
    if (newData === undefined) return;
    setTranscriptData(newData);
  }, []);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("http://localhost:6400", {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    // Set up event listener for 'diagram_response'
    newSocket.on("diagram_response", handleDiagramResponse);

    newSocket.on("transcript_response", handleTranscriptResponse);
    newSocket.emit("transcript_request");

    // Emit a request for diagram data
    newSocket.emit("diagram_request");

    // Cleanup function to disconnect socket when component unmounts
    return () => {
      newSocket.off("diagram_response", handleDiagramResponse);
      newSocket.disconnect();
    };
  }, [handleDiagramResponse, handleTranscriptResponse]);

  return (
    <socketDataContext.Provider
      value={{
        socket: socket,
        transcriptData: transcriptData,
        diagramData: diagramData,
      }}
    >
      {children}
    </socketDataContext.Provider>
  );
};

export const useSocketData = () => {
  return useContext(socketDataContext);
};
