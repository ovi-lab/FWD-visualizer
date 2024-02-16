'use client'
import React, { useState, useEffect, createContext } from "react";
import InfoPanel from "./info/page";
import ArcDiagram from "./diagrams/arc/page";
import Chatbox from "./chat/page";
import SankeySelector from "./diagrams/sankey/page";


export const DataContext = createContext({});

const Dashboard = () => {
  const [data, setData] = useState({});
  const [fetchDone, setFetchDone] = useState(false);
  const [selected, setSelected] = useState(null);
  const [chatAnchor, setChatAnchor] = useState(null);
  

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    fetch("../data/new_robot_data_2_15.json")
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
  // TODO: Replace prop drilling with context
  const handleNodeInteraction = (type, name, id) => {
    setSelected(name);
  };

  const handleAnchorInteraction = (anchorId: any) => {
    setChatAnchor(anchorId);
  };

  return (
    <div >
      {fetchDone ? (
        <div className="grid grid-cols-7 row data-row">
          <DataContext.Provider value={data}>
          <InfoPanel
            data={data}
            selected={selected}
            anchorSelect={handleAnchorInteraction}
          />
          <div
            className="col-span-4"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3>Diagrams</h3>
            <ArcDiagram
              selected={selected}
              handleInteraction={handleNodeInteraction}
            />
            <SankeySelector
              selected={selected}
              handleInteraction={handleNodeInteraction}
            />
          </div>
          <Chatbox chatAnchor={chatAnchor} />
          </DataContext.Provider>
        </div>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
