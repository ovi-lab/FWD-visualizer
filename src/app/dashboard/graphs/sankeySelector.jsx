import React, { useState } from "react";
import SankeyDiagram from "./sankeyDiagram";

function SankeySelector({ data, selected, handleInteraction}) {
  const [dataDirection, setDataDirection] = useState("haru-child");
  const [nodes, setNodes] = useState(data.nodes);
  const [links, setLinks] = useState(data.links.haru);

  // Event handler for radio button change
  const handleRadioChange = (event) => {
    setDataDirection(event.target.value);
    if (event.target.value === "haru-child") {
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
        className=""
        name="options-outlined"
        id="haru-child"
        value={"haru-child"}
        checked={dataDirection === "haru-child"}
        onChange={handleRadioChange}
      />
      <label className="" htmlFor="haru-child">
        Haru to Child
      </label>
      <input
        type="radio"
        className="btn-check"
        name="options-outlined"
        id="child-haru"
        value={"child-haru"}
        checked={dataDirection === "child-haru"}
        onChange={handleRadioChange}
      />
      <label className="" htmlFor="child-haru">
        Child to Haru
      </label>
      <SankeyDiagram nodeData={nodes} linkData={links} selected={selected} handle={handleInteraction}/>
    </div>
  );
}

export default SankeySelector;
