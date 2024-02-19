'use client'
import React, { useState, useEffect, createContext } from "react";
import InfoPanel from "./info/page";
import ArcDiagram from "./diagrams/arc/page";
import Chatbox from "./chat/page";
import SankeySelector from "./diagrams/sankey/page";


export const DataContext = createContext({});

export default function Dashboard() {
  return (
    <div >  
        <div className="grid grid-cols-7 row data-row">
          <InfoPanel

          />
          <div
            className="col-span-4"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3>Diagrams</h3>
            <ArcDiagram/>
            <SankeySelector/>
          </div>
          <Chatbox/>
        </div>
    </div>
  );
};

