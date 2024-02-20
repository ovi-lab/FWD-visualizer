import React, { useState, useEffect } from "react";
import {
  sankey as d3sankey,
  sankeyCenter,
  sankeyLinkHorizontal,
} from "d3-sankey";
import "../graphStyles.css";
import { scaleOrdinal, schemeSet3 } from "d3";
import { useSelected } from "../../../contexts/selectedContext";

const width = 600;
const height = 400;

const sankeyGenerator = d3sankey()
  .nodeWidth(15)
  .nodePadding(10)
  .nodeId((node) => node.id)
  .nodeAlign(sankeyCenter)
  .extent([
    [1, 1],
    [width, height - 5],
  ]);

const color = scaleOrdinal(schemeSet3);

const Nodes = ({ name, id, y1, y0, x1, x0, width, isSelected, handle }) => {
  return (
    <g key={id}>
      <rect
        className="node sankeyNode"
        height={y1 - y0}
        width={x1 - x0}
        x={x0}
        y={y0}
        stroke={"black"}
        fill={isSelected ? "green" : color(name.match(/:(.*)/)[1].trim())}
        onClick={() => {
          handle("node", name, id);
        }}
      />
      <title>`${name}`</title>
      <text
        key={id}
        fontSize={"0.75em"}
        x={x0 < width / 2 ? x1 + 6 : x0 - 6}
        y={(y1 + y0) / 2}
        dy={"0.35em"}
        textAnchor={x0 < width / 2 ? "start" : "end"}
      >
        {name}
      </text>
    </g>
  );
};

const Links = (link) => {
  return (
    <g>
      <path
        key={link.id}
        className="link sankeyLink"
        id={link.id}
        d={sankeyLinkHorizontal()(link)}
        stroke={color(link.source.name.match(/:(.*)/)[1].trim())}
        fill="none"
        strokeOpacity={0.2}
        strokeWidth={Math.max(1, link.width)}
        style={{ mixBlendMode: "multiply" }}
      />
    </g>
  );
};


const SankeyDiagram = (props) => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [viewBox, setViewBox] = useState(`0 0 600 400`)
  const sankeyRef = React.useRef();
  const {selected, setSelected} = useSelected();

  useEffect(() => {
    let selectedLinks = ""
    fetch("../../../data/new_robot_data_2_20.json")
      .then((res) => res.json())
      .then((data) => {
        if (props.dataDirection === "haru-user") {
            selectedLinks = data.links.haru
        } else {
          selectedLinks = data.links.user
          }
        const { nodes, links } = sankeyGenerator({
          nodes: data.nodes.map((d) => ({ ...d})),
          links: selectedLinks.map((d) => ({ ...d})),
        });

        const { width: newWidth, height: newHeight } =
          sankeyRef.current.getBoundingClientRect();

        setNodes(nodes);
        setLinks(links);
        setWidth(newWidth);
        setHeight(newHeight);
      });
  }, [props.dataDirection]);

  const handleSankeyInteraction = (type, nodeName, id) => {
    setSelected(nodeName)
  };

  useEffect(() => {
    // Calculate bounding box of the generated content
    const svgContent = document.getElementById("sankey-content");
    if (svgContent) {
      const { x, y, width, height } = svgContent.getBBox();
      const newViewBox = `${x} ${y} ${width} ${height}`;
      setViewBox(newViewBox);
    }
  }, [nodes, links]);

  return (
    <div className="sankeyWrapper w-100% h-100%">
      <svg
        className="sankeyDiagram"
        ref={sankeyRef}
        width={"100%"}
        height={"100%"}
        viewBox={viewBox}
      >
        <g style={{ mixBlendMode: "multiply" }} id={'sankey-content'}>
          {nodes.map((node) => (
            <Nodes
              key={node.idx}
              node
              {...node}
              width={width}
              height={height}
              isSelected={node.name === selected}
              handle={handleSankeyInteraction}
            />
          ))}
          {links.map((link, index) => (
            <Links key={index} link {...link} />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default SankeyDiagram;
