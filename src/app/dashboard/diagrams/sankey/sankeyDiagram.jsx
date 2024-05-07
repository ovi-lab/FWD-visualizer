import React, { useState, useEffect} from "react";
import {
  sankey as d3sankey,
  sankeyCenter,
  sankeyLinkHorizontal,
} from "d3-sankey";
import "../graphStyles.css";
import { useSelectedNode } from "@/app/contexts/selectedNodeContext";
import { useTime } from "@/app/contexts/timeContext";
import { useFilter } from "@/app/contexts/filterContext";
import { Node, Link } from "./sankeyParts";
import { filterData } from "@/app/utils/filters";
import { useWebSocket } from "@/app/contexts/webSocketContext";

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
    ]);
};

const SankeyDiagram = (props) => {
  const {diagramData} = useWebSocket();
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
  const { selectedTime } = useTime();
  const { selectedFilters } = useFilter();

  useEffect(() => {
    if (!diagramData) return;
    const filteredNodes = filterData(diagramData.nodes, selectedTime, selectedFilters);

    const rawLinks =
      props.dataDirection === "haru-user" ? diagramData.links.haru : diagramData.links.user;

    const filteredLinks = filterData(rawLinks, selectedTime, selectedFilters);
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
  }, [diagramData, selectedTime, selectedFilters, props.dataDirection, viewBox]);

  const handleSankeyInteraction = (nodeName) => {
    setSelectedNode(nodeName);
  };

  if (!diagramData) return <div>Loading...</div>;

  return (
    <svg
      className="sankeyDiagram p-1"
      ref={sankeyRef}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
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
          />
        ))}
        {nodes.map((node) =>
          node.show ? (
            <Node
              key={node.name}
              node
              {...node}
              width={viewBox.width}
              height={viewBox.height}
              isSelected={node.name === selectedNode}
              handle={handleSankeyInteraction}
              show={node.show}
            />
          ) : null
        )}
      </g>
    </svg>
  );
};

export default SankeyDiagram;
