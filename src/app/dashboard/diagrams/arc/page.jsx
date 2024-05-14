"use client";
import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import "../graphStyles.css";
import { useSelectedNode } from "@/app/contexts/selectedNodeContext";
import { useFilter } from "@/app/contexts/filterContext";
import { Node, Link } from "./arcParts";

// A linear scale for node size
const size = d3.scaleLinear().domain([0, 30]).range([1, 40]).clamp(true);

/**
 * Calculates the SVG path for a link between two nodes in an arc diagram.
 * Computes a quadratic bezier curve based on the positions of the source and target nodes.
 * @function
 * @param {Object} link - The link object containing source and target node identifiers.
 * @param {Array} nodesWithPosition - Array of nodes with precomputed positions.
 * @param {Function} xHaru - D3 scale function for Haru nodes' x positions.
 * @param {Function} xUser - D3 scale function for User nodes' x positions.
 * @param {number} arcHeight - The y-coordinate for all nodes (same for source and target).
 * @returns {string} A string representing the SVG path for the link.
 */
function calculateLinkPath(link, nodesWithPosition, xHaru, xUser, arcHeight) {
  const sourceNode = nodesWithPosition.find((n) => n.id === link.source);
  const targetNode = nodesWithPosition.find((n) => n.id === link.target);
  if (!sourceNode || !targetNode) return "";

  const start =
    sourceNode.turn === "haru"
      ? xHaru(sourceNode.name)
      : xUser(sourceNode.name);
  const end =
    targetNode.turn === "haru"
      ? xHaru(targetNode.name)
      : xUser(targetNode.name);
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
  const lengthScore = node.interactions.reduce(
    (acc, interaction) =>
      acc + interaction.response.length / maxUtteranceLength,
    0
  );
  const sentimentScore = node.interactions.reduce(
    (acc, interaction) => acc + interaction.sentiment_score,
    0
  );
  const avgLength = lengthScore / node.interactions.length;
  const avgSentiment = sentimentScore / node.interactions.length;
  return 0.5 * (avgSentiment + avgLength);
};

/**
 * React component for rendering an arc diagram visualization.
 * The diagram is dynamically generated based on the data received over a WebSocket connection.
 * @component
 * @returns {JSX.Element} The rendered component.
 */
export default function ArcDiagram() {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [scales, setScales] = useState({});
  const [viewBox, setViewBox] = useState([]);
  // Context for storing the node the user selects
  const { selectedNode, setSelectedNode } = useSelectedNode();
  // Contexts used for filtering
  const { filteredDiagram } = useFilter();

  const handleNodeSelect = (nodeName) => {
    setSelectedNode(nodeName);
  };

  useEffect(() => {
    if (!filteredDiagram) return;
    const haruNodes = [];
    const userNodes = [];
    const allNodes = [];
    const idToNode = {};
    // Diagram properties
    const arcWidth = 1000;
    const arcHeight = 450;
    const midPoint = arcWidth / 2;

    const filteredNodes = filteredDiagram.nodes;
    filteredNodes.map((node) => {
      allNodes.push(node.name);
      idToNode[node.id] = node;
      node.turn === "haru" ? haruNodes.push(node) : userNodes.push(node);
    });

    // A linear scale to position the nodes on the X axis
    const xHaru = d3
      .scalePoint()
      .domain(haruNodes.map((node) => node.name))
      .range([midPoint - 30, 0]);

    const xUser = d3
      .scalePoint()
      .domain(userNodes.map((node) => node.name))
      .range([midPoint + 30, arcWidth]);

    setScales({ haruScale: xHaru, userScale: xUser });

    const filteredCombinedLinks = filteredDiagram.links.haru.concat(
      filteredDiagram.links.user
    );

    const linkPaths = filteredCombinedLinks.map((link) => ({
      ...link,
      d: calculateLinkPath(link, filteredNodes, xHaru, xUser, arcHeight),
    }));

    setNodes(filteredNodes);
    setLinks(linkPaths);
  }, [filteredDiagram]);

  useEffect(() => {
    // Calculate bounding box of the generated content
    const svgContent = document.getElementById("arc-content");
    if (svgContent) {
      const { x, y, width, height } = svgContent.getBBox();
      const newViewBox = `${x} ${y} ${width} ${height}`;
      setViewBox(newViewBox);
    }
  }, [nodes, links]);

  if (!filteredDiagram) return <p>loading...</p>;

  return (
    <div className="p-6 arcWrapper">
      <h3 className="float-left text-md font-bold mr-4">Arc Diagram</h3>
      <svg width={"100%"} height={"100%"} viewBox={viewBox}>
        <g id="arc-content">
          {/* Render links on the diagram */}
          {links.map((link) => (
            <Link
              key={link.name}
              name={link.name}
              pathData={link.d}
              isConnectedNodeSelected={link.name.includes(selectedNode)}
            />
          ))}
          {/* Render the nodes on the diagram */}
          {nodes.map((node) => {
            const engagementScore = calcEngagement(
              node,
              node.turn === "haru"
                ? filteredDiagram.attributes.longest_haru_utterance
                : filteredDiagram.attributes.longest_user_utterance
            );

            return (
              <Node
                key={node.id}
                xPosition={
                  node.turn === "haru"
                    ? scales.haruScale(node.name)
                    : scales.userScale(node.name)
                }
                node={node}
                size={size(30 * engagementScore)}
                arcHeight={450}
                isSelected={node.name === selectedNode}
                handle={handleNodeSelect}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
