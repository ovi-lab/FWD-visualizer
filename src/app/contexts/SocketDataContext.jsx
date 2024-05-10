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
    setDiagramData(newData);
  }, []);
  
  const handleTranscriptResponse = useCallback((newData) => {
    setTranscriptData(newData);
  }, []);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(":6400", {
      cors: {
        origin: "http://127.0.0.1:6400",
        methods: ["GET", "POST"],
      },
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
