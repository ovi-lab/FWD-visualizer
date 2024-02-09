'use client'
import React, { useState } from "react";
import SankeyDiagram from "./sankeyDiagram";

function SankeySelector({ data, selected, handleInteraction}) {
  const [dataDirection, setDataDirection] = useState("haru-user");
  const [nodes, setNodes] = useState(data.nodes);
  const [links, setLinks] = useState(data.links.haru);

  // Event handler for radio button change
  const handleRadioChange = (event) => {
    setDataDirection(event.target.value);
    if (event.target.value === "haru-user") {
      setLinks(data.links.haru);
      console.log("1")
    } else {
      setLinks(data.links.user);
      console.log("2")
    }
  };

  return (
    <div>
      <h3 style={{float:"left"}}>Sankey Diagram</h3>
      <input
        type="radio"
        className="btn-check"
        name="options-outlined"
        id="haru-user"
        value={"haru-user"}
        checked={dataDirection === "haru-user"}
        onChange={handleRadioChange}
      />
      <label className="btn btn-outline-success" htmlFor="haru-user">
        Haru to Child
      </label>
      <input
        type="radio"
        className="btn-check"
        name="options-outlined"
        id="user-haru"
        value={"user-haru"}
        checked={dataDirection === "user-haru"}
        onChange={handleRadioChange}
      />
      <label className="btn btn-outline-success" htmlFor="user-haru">
        Child to Haru
      </label>
      <SankeyDiagram nodeData={nodes} linkData={links} selected={selected} handle={handleInteraction}/>
    </div>
  );
}

export default SankeySelector;
