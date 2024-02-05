'use client'

import React, { useState, useEffect } from "react";
import InfoPanel from "./info/infoPanel";
import ArcDiagram from "./graphs/arcDiagram";
import Chatbox from "./chat/chatBox";
import SankeySelector from "./graphs/sankeySelector";

interface DashboardProps {}

const Page: React.FC<DashboardProps> = () => {
  const [data, setData] = useState<Record<string, any>>({});
  const [fetchDone, setFetchDone] = useState<boolean>(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [chatAnchor, setChatAnchor] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []); // Empty dependency array means this effect runs once, similar to componentDidMount

  const loadData = () => {
    fetch("../data/processed_data_new.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setFetchDone(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Event handler for hovering over or clicking over a specific part of a visualization, either a link or a node, on every graph
  const handleNodeInteraction = (type: string, name: string, id: string) => {
    setSelected(name);
  };

  const handleAnchorInteraction = (anchorId: string) => {
    setChatAnchor(anchorId);
  };

  return (
    <div>
      {fetchDone ? (
        <div className="grid grid-cols-7 gap-4">
          <InfoPanel
            data={data}
            selected={selected}
            anchorSelect={handleAnchorInteraction}
          />
          <div
            className="flex flex-col col-span-3 h-screen graph-panel"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3>Diagrams</h3>
            <ArcDiagram
              data={data}
              selected={selected}
              handleInteraction={handleNodeInteraction}
            />
            <SankeySelector
              data={data}
              selected={selected}
              handleInteraction={handleNodeInteraction}
            />
          </div>
          <Chatbox data={data} chatAnchor={chatAnchor} />
        </div>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
};

export default Page;
