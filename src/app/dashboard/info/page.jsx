"use client";
import React, { useState, useEffect } from "react";
import ThreadList from "./threadList";
import "./infoStyles.css";
import { useSelectedNode } from "../../contexts/selectedNodeContext";
import { useChatAnchor } from "../../contexts/chatContext";
import { io } from "socket.io-client";
import { on } from "events";

const InfoPanel = () => {
  const [data, setData] = useState([]);
  const { selectedNode } = useSelectedNode();
  const { chatAnchor, setChatAnchor } = useChatAnchor();
  const [selectedLine, setSelectedLine] = useState("");

  useEffect(() => {
    const socket = io(":6400", {
      cors: { origin: "http://127.0.0.1:6400", methods: ["GET", "POST"] },
    });
    // Listen for data updates from the Flask server
    socket.on('connect', () => {
      socket.emit('static-diagram-request', 'nodes');
    })
    socket.on('static-diagram-response-nodes', (newData) => {
      setData(newData);
    })

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {}, [chatAnchor]);

  const anchorButtonClick = (clickedID) => {
    setChatAnchor(`response${clickedID}`);
    setSelectedLine(clickedID);
  };

  if (!data) return <p>loading...</p>;

  return (
    <div className="col-span-1 infoPanel">
      <h3>Information Panel</h3>
      {!selectedNode ? (
        <p>Select an item on either diagram to get started</p>
      ) : (
        <div>
          <h4>{selectedNode}</h4>
          <p>Here are the items attached to the selected node:</p>
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
