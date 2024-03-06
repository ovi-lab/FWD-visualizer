"use client";
import React, { useState, useEffect } from "react";
import ThreadList from "./threadList";
import "./infoStyles.css";
import { useSelectedNode } from "../../contexts/selectedNodeContext";
import { useChatAnchor } from "../../contexts/chatContext";


const InfoPanel = () => {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedNode } = useSelectedNode();
  const { chatAnchor, setChatAnchor } = useChatAnchor();
  const [selectedLine, setSelectedLine] = useState("");

  useEffect(() => {
    fetch(
      "http://127.0.0.1:6400/api/diagramFormat?" +
        new URLSearchParams({ selection: 'nodes' }),
      { method: "GET" }
    )
      .then((res) => res.json())
      .then((data) => {
        setNodes(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {}, [chatAnchor]);

  const anchorButtonClick = (clickedID) => {
    setChatAnchor(`response${clickedID}`);
    setSelectedLine(clickedID);
  };

  if (loading) return <p>loading...</p>;

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
            data={nodes}
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
