import React, { useState, useEffect } from "react";
import {
  sankey as d3sankey,
  sankeyCenter,
  sankeyLinkHorizontal,
} from "d3-sankey";
import "../graphStyles.css";
import { useSelectedNode } from "@/app/contexts/selectedNodeContext";
import { useFilter } from "@/app/contexts/filterContext";
import { Node, Link } from "./sankeyParts";

// This const is a D3 sankey generator used to generate the data needed for the nodes and links to display properly in an SVG
const createSankeyGenerator = (width, height) => {
  return d3sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .nodeId((node) => node.id)
    .nodeAlign(sankeyCenter)
    .extent([
      [1, 1],
      [width, height - 5],
    ])
};

const separateBidirectionalLinks = (links1, links2) => {
  const combinedLinks = [];

  links1.forEach((link) => {
    combinedLinks.push({ ...link, direction: "forward" });
  });

  links2.forEach((link) => {
    const existingLink = combinedLinks.find(
      (l) => l.source === link.target && l.target === link.source
    );
    if (existingLink) {
      console.log("existingLink", existingLink);
      
    } else {
      combinedLinks.push({ ...link, direction: "forward" });
    }
  });

  return combinedLinks;
};

const SankeyDiagram = ({ dataDirection, isBidirectional = false }) => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [viewBox, setViewBox] = useState({
    x: 0,
    y: 0,
    width: 600,
    height: 400,
  });
  const sankeyRef = React.useRef();
  const { selectedNode, setSelectedNode } = useSelectedNode();
  const { filteredDiagram } = useFilter();

  useEffect(() => {
    if (!filteredDiagram) return;

    const filteredNodes = filteredDiagram.nodes;

    let filteredLinks;
    if (isBidirectional)
      filteredLinks = separateBidirectionalLinks(
        filteredDiagram.links.robot,
        filteredDiagram.links.user
      );
    else {
      filteredLinks =   dataDirection === "robot-user"
        ? filteredDiagram.links.robot
        : filteredDiagram.links.user;
    }

    const sankeyGenerator = createSankeyGenerator(
      viewBox.width,
      viewBox.height
    );

    try {
      const { nodes, links } = sankeyGenerator({
        nodes: filteredNodes,
        links: filteredLinks,
      });
      setNodes(nodes);
      setLinks(links);
    } catch (error) {
      console.log("error", error);
    }
  }, [filteredDiagram, dataDirection, viewBox]);

  const handleSankeyInteraction = (nodeName) => {
    setSelectedNode(nodeName);
  };

  if (!filteredDiagram) return <div>Loading...</div>;

  return (
    <svg
      className="sankeyDiagram p-1"
      ref={sankeyRef}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width + 20} ${
        viewBox.height + 50
      }`}
    >
      <g style={{ mixBlendMode: "multiply" }} id={"svg-content"}>
        {links.map((link) => (
          <Link
            key={link.name}
            linkID={link.id}
            dValue={sankeyLinkHorizontal()(link)}
            linkSourceName={link.sourceName.match(/:(.*)/)[1].trim()}
            linkedNodeSelected={link.name.includes(selectedNode)}
            linkWidth={link.width}
            linkDirection={link.direction !== undefined ? link.direction : "forward"}
          />
        ))}
        {nodes.map(
          (node) =>
          node.show &&     (
              <Node
                key={node.name}
                node      
                {...node}
                width={viewBox.width}
                height={viewBox.height}
                isSelected={node.name === selectedNode}
                handle={handleSankeyInteraction}
                show={true}
              />
            )
        )}
      </g>
    </svg>
  );
};

export default SankeyDiagram;
