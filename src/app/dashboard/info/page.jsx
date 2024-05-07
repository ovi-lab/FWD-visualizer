"use client";
import React, { useState, useEffect, useCallback } from "react";
import ThreadList from "./threadList";
import "./infoStyles.css";
import { useSelectedNode } from "../../contexts/selectedNodeContext";
import { useChatAnchor } from "../../contexts/chatContext";
import { useWebSocket } from "@/app/contexts/webSocketContext";

const InfoPanel = () => {
  const {socket} = useWebSocket()
  const [data, setData] = useState([]);
  const { selectedNode } = useSelectedNode();
  const { chatAnchor, setChatAnchor } = useChatAnchor();
  const [selectedLine, setSelectedLine] = useState("");

  const handleResponse = useCallback((newData) => {
    setData(newData.nodes);
  }, []);

  useEffect(() => {
    if (!socket) return;
    // Listen for data updates from the Flask server
    socket.emit("diagramRequest")
  }, [socket]);
  
  useEffect(() => {
    if (!socket) return;
    socket.on("diagram-response", handleResponse
    );
  });


  useEffect(() => {}, [chatAnchor]);

  const anchorButtonClick = (clickedID) => {
    setChatAnchor(`response${clickedID}`);
    setSelectedLine(clickedID);
  };

  if (!data) return <p>loading...</p>;

  return (
    <div className=" overflow-hidden rounded-lg border">
    <div className="flex rounded-lg items-center justify-center bg-cyan-100">
      <h3 className="text-lg font-semibold">Information Panel</h3>
      </div>
      {!selectedNode ? (
        <p>Select an item on either diagram to get started</p>
      ) : (
        <div>
        <div className="items-center justify-center p-1">
          <h4 className="font-bold">{selectedNode}</h4>
          <p>Items in node:</p>
      </div>
          <ThreadList
            data={data}
            selected={selectedNode}
            anchorClick={anchorButtonClick}
            selectedLine={selectedLine}
          />
        </div>
      )}
    </div>
  );
};

export default InfoPanel;
