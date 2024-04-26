"use client";
import React, { useState, useEffect, useCallback } from "react";
import * as d3 from "d3";
import "../graphStyles.css";
import { useSelectedNode } from "@/app/contexts/selectedNodeContext";
import { useTime } from "@/app/contexts/timeContext";
import { useFilter } from "@/app/contexts/filterContext";
import { Node, Link } from "./arcParts";
import { filterData } from "@/app/dashboard/utils/filters";
import { useWebSocket } from "@/app/contexts/webSocketContext";


export default function ArcDiagram() {
  const socket = useWebSocket()
  const [data, setData] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scales, setScales] = useState({});
  const [viewBox, setViewBox] = useState([]);
  // Context for storing the node the user selects
  const { selectedNode, setSelectedNode } = useSelectedNode();
  // Contexts used for filtering
  const { selectedTime } = useTime();
  const { selectedFilters } = useFilter();

  const handleNodeSelect = (nodeName) => {
    setSelectedNode(nodeName);
  };

  const handleResponse = useCallback((newData) => {
    setData(newData);
  }, []);

  useEffect(() => {
    if (!socket) return;
    // Listen for data updates from the Flask server
    socket.emit("diagramRequest");
  }, [socket]);
  
  useEffect(() => {
    if (!socket) return;
    socket.on("diagram-response", handleResponse
    );
  });


  useEffect(() => {
    if (!data) return;
    const haruNodes = [];
    const userNodes = [];
    const allNodes = [];
    const idToNode = {};
    // Diagram properties
    const arcWidth = 1000;
    const arcHeight = 450;
    const midPoint = arcWidth / 2;

    const filteredNodes = filterData(data.nodes, selectedTime, selectedFilters);
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

    const filteredLinks = filterData(
      data.links.haru.concat(data.links.user),
      selectedTime,
      selectedFilters,
      true
    );
    const calculatedLinks = filteredLinks.map((link) => {
      let d;
      if (idToNode[link.source] !== undefined && idToNode[link.target] !== undefined) {
        const start = idToNode[link.source].turn === "haru"
        ? xHaru(idToNode[link.source].name)
        : xUser(idToNode[link.source].name);
      const end = idToNode[link.target].turn === "haru"
        ? xHaru(idToNode[link.target].name)
        : xUser(idToNode[link.target].name);
      d = [
        "M",
        start,
        arcHeight,
        "A",
        (start - end) / 2,
        ",",
        (start - end) / 2,
        0,
        0,
        ",",
        start < end ? 1 : 0,
        end,
        ",",
        arcHeight,
      ].join(" ");
      }
      
      return { ...link, d };
    });
    setNodes(filteredNodes);
    setLinks(calculatedLinks);
    setLoading(false);
  }, [selectedTime, data, selectedFilters, loading]);

  useEffect(() => {
    // Calculate bounding box of the generated content
    const svgContent = document.getElementById("arc-content");
    if (svgContent) {
      const { x, y, width, height } = svgContent.getBBox();
      const newViewBox = `${x} ${y} ${width} ${height}`;
      setViewBox(newViewBox);
    }
  }, [nodes, links]);

  // A linear scale for node size
  const size = d3.scaleLinear().domain([0, 30]).range([1, 40]).clamp(true);
  
  /**
   * Description placeholder
   *
   * @param {*} node
   * @param {number} maxUtteranceLength
   * @returns {number}
   */
  const calcEngagement = (node, maxUtteranceLength) => {
    let lengthScore = 0
      let sentimentScore = 0
    node.interactions.map((interaction) => {
      lengthScore = lengthScore + interaction.response.length / maxUtteranceLength
      sentimentScore = sentimentScore + interaction.sentiment_score
  })
    const avgLength = lengthScore / node.interactions.length
    const avgSentiment = sentimentScore / node.interactions.length 
    
    return (0.5 * avgSentiment) + (0.5 * avgLength) 
  }

  if (loading) return <p>loading...</p>;

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
            let engagementScore = 0
            console.log(data.attributes)
            node.turn === 'haru' ? 
            engagementScore = calcEngagement(node, data.attributes.longest_haru_utterance) 
            : engagementScore = calcEngagement(node, data.attributes.longest_user_utterance)
            console.log(engagementScore)
            return(
            <Node
              key={node.id}
              xPosition={
                node.turn === 'haru'
                  ? scales.haruScale(node.name)
                  : scales.userScale(node.name)
              }
              node={node}
              size={size(30*engagementScore)}
              arcHeight={450}
              isSelected={node.name === selectedNode}
              handle={handleNodeSelect}
            />)
          }
          )}
        </g>
      </svg>
    </div>
  );
}
