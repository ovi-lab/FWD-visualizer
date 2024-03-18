import React, { useState, useEffect } from "react";
import {
  sankey as d3sankey,
  sankeyCenter,
  sankeyLinkHorizontal,
} from "d3-sankey";
import "../graphStyles.css";
import { useSelectedNode } from "../../../../contexts/selectedNodeContext";
import { useTime } from "@/app/contexts/timeContext";
import { useFilter } from "@/app/contexts/filterContext";
import { Node, Link } from "./sankeyParts";
import { filterData } from "@/app/dashboard/utils/filters";
import { io } from "socket.io-client";

const width = 600;
const height = 400;

// This const is a D3 sankey generator used to generate the data needed for the nodes and links to display properly in an SVG
const sankeyGenerator = d3sankey()
  .nodeWidth(15)
  .nodePadding(10)
  .nodeId((node) => node.id)
  .nodeAlign(sankeyCenter)
  .extent([
    [1, 1],
    [width, height - 5],
  ]);

const SankeyDiagram = (props) => {
  const [data, setData] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [viewBox, setViewBox] = useState(`0 0 600 400`);
  const sankeyRef = React.useRef();
  const { selectedNode, setSelectedNode } = useSelectedNode();
  const { selectedTime } = useTime();
  const { selectedFilters } = useFilter();

  useEffect(() => {
    const socket = io(":6400", {
      cors: { origin: "http://127.0.0.1:6400", methods: ["GET", "POST"] },
    });
    // Listen for data updates from the Flask server
    socket.emit("static-diagram-request", 'all');
    
    socket.on("static-diagram-response-all", (newData) => {
      setData(newData);
    });

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

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

    try {
      const { nodes, links } = sankeyGenerator({
        nodes: filteredNodes,
        links: filteredLinks,
      });
      setNodes(nodes);
      setLinks(links);
    } catch (error) {
      // D3 Sankey seems to throw a RangeError but functionality is not affected.
    }
  }, [data, selectedTime, selectedFilters, props.dataDirection]);

  const handleSankeyInteraction = (nodeName) => {
    setSelectedNode(nodeName);
  };

  useEffect(() => {
    // Calculate bounding box of the generated content
    const svgContent = document.getElementById("sankey-content");
    if (svgContent) {
      const { x, y, width, height } = svgContent.getBBox();
      const newViewBox = `${x - 1} ${y - 1} ${width + 2} ${height + 2}`;
      setViewBox(newViewBox);
    }
  }, [nodes, links]);

  if (!data) return <div>Loading...</div>;
  return (
    <div className="sankeyContainer" id="sankey-container">
      <svg className="sankeyDiagram p-1" ref={sankeyRef} viewBox={viewBox}>
        <g style={{ mixBlendMode: "multiply" }} id={"sankey-content"}>
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
            node.show === true ? (
              <Node
                key={node.name}
                node
                {...node}
                width={width}
                height={height}
                isSelected={node.name === selectedNode}
                handle={handleSankeyInteraction}
                show={node.show}
              />
            ) : null
          )}
        </g>
      </svg>
    </div>
  );
};

export default SankeyDiagram;
