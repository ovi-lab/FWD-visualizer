"use client";
import React, { useState, useEffect } from "react";
import ThreadList from "./threadList";
import "./infoStyles.css";
import { useSelectedNode } from "../../contexts/selectedNodeContext";
import { useChatAnchor } from "../../contexts/chatContext";
import { io } from "socket.io-client";

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

    socket.emit("diagram-request");

    socket.on("diagram-response", (newData) => {
      setData(newData.nodes);
    });

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
    <div className=" overflow-hidden rounded-lg pb-2 border infoPanel">
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
