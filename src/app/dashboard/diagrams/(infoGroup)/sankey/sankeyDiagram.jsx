import React, { useState, useEffect, useCallback, useLayoutEffect} from "react";
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
import { filterData } from "@/app/dashboard/utils/filters";
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
}

const SankeyDiagram = (props) => {
  const socket = useWebSocket();
  const [data, setData] = useState(null);
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

  const handleResponse = useCallback((newData) => {
    setData(newData);
  }, []);

  useEffect(() => {
    if (!socket) return;
    // Listen for data updates from the Flask server
    socket.emit("diagram-request");
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("diagram-response", handleResponse);
  });

  useEffect(() => {
    if (!data) return;
    let rawLinks = [];
    const filteredNodes = filterData(data.nodes, selectedTime, selectedFilters);

    if (props.dataDirection === "haru-user") {
      rawLinks = data.links.haru;
    } else {
      rawLinks = data.links.user;
    }
    const filteredLinks = filterData(rawLinks, selectedTime, selectedFilters);
    console.log('viewBox', viewBox)
    const sankeyGenerator = createSankeyGenerator(viewBox.width, viewBox.height)
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
  }, [data, selectedTime, selectedFilters, props.dataDirection]);

  const handleSankeyInteraction = (nodeName) => {
    setSelectedNode(nodeName);
  };

  useLayoutEffect(() => {
    // Calculate bounding box of the generated content
    if (!data) return;
    const svgContent = document.getElementById("svg-content");
    if (svgContent) {
      console.log('svgContent', svgContent)
      const { newX, newY, newWidth, newHeight } = svgContent.getBBox();
      console.log(svgContent.getBBox());
      const newViewBox = {
        x: (newX + 1),
        y: (newY + 1),
        width: (newWidth - 2),
        height: (newHeight - 2),
      };
      setViewBox(newViewBox);
    }
  }, [data]);

  if (!data) return <div>Loading...</div>;
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
            linkSourceName={link.source.name.match(/:(.*)/)[1].trim()}
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
