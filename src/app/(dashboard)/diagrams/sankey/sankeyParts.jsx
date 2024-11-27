import React, { useState, useRef } from "react";
import { useSelectedColour } from "@/app/contexts/SelectedColourContext";
// import { scaleOrdinal, schemeSet3 } from "d3";
import { useSelectedNode } from "@/app/contexts/selectedNodeContext";

// Create a color scale using D3's categorical color scheme
// const color = scaleOrdinal(schemeSet3);

/**
 * Node Component
 * Represents a node in a Sankey diagram.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.nodeData - Data object for the node, containing position and size.
 * @param {number} props.width - Total width of the diagram (used for positioning).
 * @param {boolean} props.isSelected - Indicates if the node is currently selected.
 * @param {Function} props.handle - Function to handle node click events.
 *
 * @returns {JSX.Element} The rendered node element.
 */
const Node = ({
  nodeData,
  width,
}) => {

  const {selectedColour} = useSelectedColour();
  const {selectedNode, setSelectedNode} = useSelectedNode();
  const [hoveredNode, setHoveredNode] = useState(false);
  const [prevSelectedNode, setPrevSelectedNode] = useState(false);

  const handleNodeClick = (nodeName) => {
    // console.log("prevSelectedNode.current: " + prevSelectedNode.current)
    // console.log("nodeName: " + nodeName)
    if (prevSelectedNode === nodeName) {
      // console.log("Node was previously selected:", nodeName);
      setSelectedNode(null); // Deselect if the same node is clicked again
      // console.log("unselect selectedNode: " + selectedNode)
      setPrevSelectedNode(null); // Reset the reference to the previously clicked node
    } else {
      // console.log("New node was selected:", nodeName);
      setSelectedNode(nodeName); // Select the newly selected node
      // ("select selectedNode: " + selectedNode)
      setPrevSelectedNode(nodeName); // Update the reference to the previously clicked node
    }
  };

  // Determine if the node is on the left half of the diagram
  const widthLessThanHalf = nodeData.x0 < width / 2;
  // Position for the label text relative to the node
  const rectPosition = widthLessThanHalf ? nodeData.x1 + 6 : nodeData.x0 - 6;
  // Text alignment based on node position
  const textAnchorPosition = widthLessThanHalf ? "start" : "end";
  const rectHeight = nodeData.y1 - nodeData.y0
  const rectWidth = nodeData.x1 - nodeData.x0
  
  const colors =
    Array.isArray(selectedColour) && selectedColour.length > 0
      ? selectedColour
      : [
          "#8CD0C7",
          "#F4EC90",
          "#BDBBD9",
          "#FE7F70",
          "#81B1D1",
          "#FEB363",
          "#B2DD6A",
          "#FDCDE4",
          "#D7D8D9",
          "#C181BD",
          "#CBEAC7",
        ];

  return (
    <g key={nodeData.id}>
      {/* Node rectangle */}
      <rect
        height={hoveredNode ? rectHeight * 1.2: rectHeight} // Height of the node
        width={hoveredNode ? rectWidth * 1.2 : rectWidth}  // Width of the node
        x={nodeData.x0 - (hoveredNode ? rectWidth * 0.1 : 0)} 
        y={nodeData.y0 - (hoveredNode ? rectHeight * 0.1 : 0)}                   
        stroke={"black"} // Border color changes if selected
        fill={colors[Math.floor(nodeData.id / 2)]}
        className="cursor-pointer" // Tailwind CSS classes for hover effect and pointer cursor
        opacity = {selectedNode ? (nodeData.name.includes(selectedNode) ? 1 : 0.4): 1}
        onClick={() => handleNodeClick(nodeData.name)}         
        onMouseEnter={()=>{setHoveredNode(true)}}
        onMouseLeave={()=>{setHoveredNode(false)}}
      />
      {/* Tooltip displaying node name */}
      <title>{nodeData.name}</title>
      {/* Node label */}
      <text
        key={`${nodeData.id}`}
        className="text-sm font-mono" // Tailwind CSS classes for text styling
        x={rectPosition}             // X-coordinate for the text
        y={(nodeData.y1 + nodeData.y0) / 2} // Y-coordinate centered vertically on the node
        dy={"0.35em"}                // Adjusts the text vertically
        textAnchor={textAnchorPosition} // Aligns text based on node position
        fill = {"black"}
      >
        {nodeData.name}
      </text>
    </g>
  );
};

/**
 * Link Component
 * Represents a link between nodes in a Sankey diagram.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string|number} props.linkID - The unique identifier for the link.
 * @param {string} props.dValue - The SVG path data for the link.
 * @param {string} props.linkSourceName - The name of the source node.
 * @param {boolean} props.linkedNodeSelected - Indicates if the link is connected to a selected node.
 * @param {number} props.linkWidth - The width of the link path.
 *
 * @returns {JSX.Element} The rendered link element.
 */

// How can I set the dynamic opacity for Link component as well using selectedNode
const Link = ({
  linkID,
  dValue,
  linkSourceName,
  linkWidth,
}) => {

  const {selectedNode} = useSelectedNode();
  const {selectedColour} = useSelectedColour();

  const colors =
    Array.isArray(selectedColour) && selectedColour.length > 0
      ? selectedColour
      : [
          "#8CD0C7",
          "#F4EC90",
          "#BDBBD9",
          "#FE7F70",
          "#81B1D1",
          "#FEB363",
          "#B2DD6A",
          "#FDCDE4",
          "#D7D8D9",
          "#C181BD",
          "#CBEAC7",
        ];


  const trimmedSelectedNode = selectedNode ? selectedNode.split(": ")[1] : null;
  console.log("selectedNode: " +  trimmedSelectedNode + "=== linkSourceName: " + linkSourceName + ": " + (trimmedSelectedNode === linkSourceName))
  
  const opacity = selectedNode ? (trimmedSelectedNode === linkSourceName ? 1 : 0.4) : 1;

  return (
    <g>
      {/* Link path */}
      <path
        id={linkID}       // Unique identifier for the link
        d={dValue}        // SVG path data defining the link's shape
        stroke={colors[Math.floor(linkID/ 2)]}
        fill="none"   
        strokeWidth={Math.max(1, linkWidth)} // Ensure stroke width is at least 1
        style={{
          opacity: opacity,
          strokeDasharray: 1000,               // Total length of dashes
          strokeDashoffset: 1000,              // Starting point for the dash animation
          animation: "dash 1s linear forwards", // Animates the drawing of the path
        }}
      />
    </g>
  );
};

export { Node, Link };
    