"use client";
import React, { useState, useEffect } from "react";
import { scaleLinear, scalePoint, scaleOrdinal, schemeSet3 } from "d3";
import { useSelectedNode } from "@/app/contexts/selectedNodeContext";
import { useSelectedColour } from "@/app/contexts/SelectedColourContext";
import { useDarkMode } from "@/app/contexts/DarkModeContext";

// Define the color scale with D3 schemeSet3
const color = scaleOrdinal(schemeSet3);

// Determine if the node is a "user" type or a different entity
const checkIsUser = (node) => {
  return node.turn.toLowerCase() === "user";
};

/**
 * Represents a node component for an arc diagram.
 * @component
 * @param {object} props - The props object containing the properties of the node.
 * @param {object} props.node - The node object containing information about the node.
 * @param {number} props.xPosition - The x-coordinate position of the node.
 * @param {number} props.arcHeight - The height of the arc where the node is positioned.
 * @param {number} props.size - The size of the node.
 * @param {boolean} props.isSelected - A boolean indicating whether the node is selected.
 * @param {Function} props.handle - The function to handle the node click event.
 * @returns {JSX.Element} - A JSX element representing the node.
 */


const Node = ({ xPosition, node, size, arcHeight, isSelected, handle }) => {
  const [hoveredNode, setHoveredNode] = useState(false);

  const { selectedNode } = useSelectedNode();

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
  // Determine stroke and fill colors based on whether the node is selected
  const strokeColor = "grey";
  const strokeWidth = 1;
  const fillColor = colors[Math.floor(node.id / 2)]  // Use selectedColour from context if not selecte

  // Handle node click event
  const handleClick = () => handle(node.name);

  const {darkMode} = useDarkMode();

  return (
    <g key={`node${node.name}`}>
      {/* Render the line connecting the node */}
      <line
        x1={xPosition}
        y1={arcHeight + size + 5}
        x2={xPosition}
        y2={arcHeight + 30}
        stroke="grey"
        strokeWidth="1"
      />
 
      {/* Conditionally render a rect for "robot" type nodes or a circle for others */}
      {checkIsUser(node) ? (
        <circle
          className="cursor-pointer"
          cx={xPosition}
          cy={arcHeight}
          id={node.name}
          r={hoveredNode ? size * 1.2 : size}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill={fillColor}
          opacity={selectedNode ? (node.name.includes(selectedNode) ? 1 : 0.6): 1 }
          onClick={handleClick}
          onMouseEnter={() => setHoveredNode(true)}
          onMouseLeave={() => setHoveredNode(false)}
        />
      ) : (
        <rect
          className="cursor-pointer"
          height={hoveredNode ? size * 2.2 : size * 1.6}
          width={hoveredNode ? size * 2.2 : size * 1.6}
          x={xPosition - (hoveredNode ? size : size * 0.6) / 1} 
          y={arcHeight - (hoveredNode ? size : size * 0.6) / 1}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill={fillColor}
          opacity={selectedNode ? (node.name.includes(selectedNode) ? 1 : 0.6): 1}
          onClick={handleClick}
          onMouseEnter={() => setHoveredNode(true)}
          onMouseLeave={() => setHoveredNode(false)}
        />
      )}

      {/* Render node label */}
      <text
        className="text-xl font-mono"
        x={xPosition - 35}
        y={arcHeight + 35}
        transform="rotate(-45)"
        fill = {darkMode ? "white" : "black"}
        style={{
          textAnchor: "end",
          transformOrigin: `${xPosition}px ${arcHeight - 15}px`,
        }}
        
      >
        {node.name}
      </text>
    </g>
  );
};

/**
 * Represents a link component for an arc diagram.
 * @component
 * @param {object} props - The props object containing the properties of the link.
 * @param {string} props.name - The name of the link.
 * @param {string} props.source - The source node's name associated with the link.
 * @param {string} props.pathData - The path data for the link (SVG path data).
 * @param {boolean} props.isConnectedNodeSelected - A boolean indicating if the connected node is selected.
 * @returns {JSX.Element} - A JSX element representing the link.
 */
const Link = ({ name, linkID, pathData, isConnectedNodeSelected }) => { // added linkID to get link colour

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
  
  // Determine stroke color based on whether the connected node is selected
  const strokeColor = colors[Math.floor(linkID/ 2)]


  // Set opacity based on selection status
  const opacity = isConnectedNodeSelected ? 1 : 0.6;

  return (
    <path
      d={pathData}
      fill="none"
      stroke={strokeColor}
      strokeWidth={7}
      id={name}
      opacity = {opacity}
    />
  );
};

// A linear scale for node size
const sizeScale = scaleLinear().domain([0, 30]).range([1, 40]).clamp(true);

/**
 * Calculates the SVG path for a link between two nodes in an arc diagram.
 * Computes a quadratic bezier curve based on the positions of the source and target nodes.
 * @function
 * @param {Object} link - The link object containing source and target node identifiers.
 * @param {Array} nodesWithPosition - Array of nodes with precomputed positions.
 * @param {Function} xRobot - D3 scale function for Robot nodes' x positions.
 * @param {Function} xUser - D3 scale function for User nodes' x positions.
 * @param {number} arcHeight - The y-coordinate for all nodes (same for source and target).
 * @returns {string} A string representing the SVG path for the link.
 */
function calculateLinkPath(link, nodesWithPosition, xRobot, xUser, arcHeight) {
  const sourceNode = nodesWithPosition.find((n) => n.id === link.source);
  const targetNode = nodesWithPosition.find((n) => n.id === link.target);
  if (!sourceNode || !targetNode) {
    console.log(
      "Error: source or target node not found in nodesWithPosition array."
    );
    return "";
  }

  const start = checkIsUser(sourceNode)
    ? xUser(sourceNode.name)
    : xRobot(sourceNode.name);
  const end = checkIsUser(targetNode)
    ? xUser(targetNode.name)
    : xRobot(targetNode.name);
  const nodeMidpoint = Math.abs(start - end) / 2;
  return [
    "M",
    start,
    arcHeight,
    "A",
    nodeMidpoint,
    ",",
    nodeMidpoint,
    0,
    0,
    ",",
    start < end ? 1 : 0,
    end,
    ",",
    arcHeight,
  ].join(" ");
}

/**
 * Calculates the engagement score for a node based on its interactions.
 * The score is a weighted average of the sentiment score and the normalized length of responses.
 * @function
 * @param {Object} node - The node object containing interactions.
 * @param {number} maxUtteranceLength - The maximum length of an utterance for normalization.
 * @returns {number} The calculated engagement score for the node.
 */
const calcEngagement = (node, maxUtteranceLength) => {

  const numericScore = (label, score) => {
    switch (label.toLowerCase()) {
      case "positive":
        return score; // Score remains the same for positive sentiment
      case "negative":
        return -score; // Score is negated for negative sentiment
      case "neutral":
        return 0; // Neutral sentiment is represented as 0
      default:
        return 0;
    }
  };

  const sentimentScore = node.interactions.reduce(
    (acc, interaction) =>
      acc +
      numericScore(interaction.sentiment_label, interaction.sentiment_score),
    0
  );

  return node.turn.toLowerCase() === "user"
    ? 0.6 * (sentimentScore * 0.4 + 1)
    : 0.6;
};

/**
 * React component for rendering an arc diagram visualization.
 * The diagram is dynamically generated based on the data received over a WebSocket connection.
 * @component
 * @returns {JSX.Element} The rendered component.
 */
function ArcDiagram({data}) {
  const { selectedNode, setSelectedNode } = useSelectedNode();

  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [scales, setScales] = useState({});
  const [viewBox, setViewBox] = useState([]);

  const handleNodeSelect = (nodeName) => {
    setSelectedNode(nodeName.split(": ")[1]); // take only topic name after ": "
  };

  console.log("selectedNode: " + selectedNode)

  useEffect(() => {
    if (!data) return;
    const robotNodes = [];
    const userNodes = [];
    // Diagram properties
    const arcWidth = 1000;
    const arcHeight = 450;
    const midPoint = arcWidth / 2;

    const filteredNodes = data.nodes;
    filteredNodes.forEach((node) => {
      node.turn.toLowerCase() !== "user"
        ? robotNodes.push(node)
        : userNodes.push(node);
    });

    // A linear scale to position the nodes on the X axis
    const xRobot = scalePoint()
      .domain(robotNodes.map((node) => node.name))
      .range([midPoint - 30, 0]);

    const xUser = scalePoint()
      .domain(userNodes.map((node) => node.name))
      .range([midPoint + 30, arcWidth]);

    setScales({ robotScale: xRobot, userScale: xUser });

    const filteredCombinedLinks = data.links.robot.concat(data.links.user);

    const linkPaths = filteredCombinedLinks.map((link) => ({
      ...link,
      d: calculateLinkPath(link, filteredNodes, xRobot, xUser, arcHeight),
    }));

    setNodes(filteredNodes);
    setLinks(linkPaths);
  }, [data]);

  useEffect(() => {
    // Calculate bounding box of the generated content
    const svgContent = document.getElementById("arc-content");
    if (svgContent) {
      const { x, y, width, height } = svgContent.getBBox();
      const newViewBox = `${x} ${y} ${width + 50} ${height + 20}`;
      setViewBox(newViewBox);
    }
  }, [nodes, links]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <svg width="100%" height="100%" viewBox={viewBox}>
        <g id="arc-content">
          {/* Render Links */}
          {links.map((link) => (
            <Link
              key={link.name}
              name={link.name}
              linkID={link.source} // added linkID to give access to sourceid
              source={link.sourceName}
              pathData={link.d}
              opacity={selectedNode ? (link.sourceName.includes(selectedNode) ? 1 : 0.6) : 1}
              isConnectedNodeSelected={link.name.includes(selectedNode)}
            />
          ))}
          {/* Render the nodes on the diagram */}
          {nodes.map((node) => {
            const engagementScore = calcEngagement(
              node,
              node.turn.toLowerCase() !== "user"
                ? data.attributes.longest_robot_utterance
                : data.attributes.longest_user_utterance
            );

            return (
              <Node
                key={`${node.id} ${node.name}`}
                xPosition={
                  node.turn.toLowerCase() !== "user"
                    ? scales.robotScale(node.name)
                    : scales.userScale(node.name)
                }
                node={node}
                size={sizeScale(30 * engagementScore)}
                arcHeight={450}
                isSelected={node.name === selectedNode}
                handle={handleNodeSelect}
                onMouseEnter = {()=> setHoveredBubble(node.name)}
                onMouseLeave = {()=> setHoveredBubble(null)}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export default ArcDiagram;
