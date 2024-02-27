"use client";
import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import "../graphStyles.css";
import { useSelected } from "../../../../contexts/selectedContext";
import { useTime } from "@/app/contexts/timeContext";
import { Node, Link } from "./diagramParts";

export default function ArcDiagram() {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [scales, setScales] = useState({});
  const [viewBox, setViewBox] = useState([]);
  const { selected, setSelected } = useSelected();
  const { selectedTime } = useTime();

  const handleNodeSelect = (nodeName) => {
    setSelected(nodeName);
  };

  useEffect(() => {
    fetch("../../../data/new_robot_data_2_20.json")
      .then((res) => res.json())
      .then((data) => {
        const arcWidth = 1000;
        const arcHeight = 450;
        const midPoint = arcWidth / 2;
        const haruNodes = [];
        const userNodes = [];
        const allNodes = [];
        const idToNode = {};

        data.nodes.map((node) => {
          allNodes.push(node.name);
          idToNode[node.id] = node;
          node.name.includes("haru:")
            ? haruNodes.push(node)
            : userNodes.push(node);
        });

        // A linear scale to position the nodes on the X axis
        const xHaru = d3
          .scalePoint()
          .domain(haruNodes.map((node) => node.name))
          .range([midPoint - 15, 0]);

        const xUser = d3
          .scalePoint()
          .domain(userNodes.map((node) => node.name))
          .range([midPoint + 15, arcWidth]);

        setScales({ haruScale: xHaru, userScale: xUser });

        const calculatedLinks = data.links.haru
          .concat(data.links.user)
          .filter(
            (item) => Date.parse(item.timestamp) <= Date.parse(selectedTime)
          )
          .map((link) => {
            let start = idToNode[link.source].name.includes("haru:")
              ? xHaru(idToNode[link.source].name)
              : xUser(idToNode[link.source].name);
            let end = idToNode[link.target].name.includes("haru:")
              ? xHaru(idToNode[link.target].name)
              : xUser(idToNode[link.target].name);
            let d = [
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
            return { ...link, d };
          });

        const nodes = [];
        data.nodes
          .filter(
            (item) => Date.parse(item.timestamp) <= Date.parse(selectedTime)
          )
          .map((d) => nodes.push(d));
        console.log("nodes", nodes);
        setNodes(nodes);
        setLinks(calculatedLinks);
        setLoading(false);
      });
  }, [selectedTime]);

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
  const size = d3.scaleLinear().domain([1, 10]).range([1, 20]).clamp(true);

  if (isLoading) return <p>loading...</p>;

  return (
    <div className="p-6 arcWrapper">
      <h3 style={{ textAlign: "left" }}>Arc Diagram</h3>
      <svg width={"100%"} height={"100%"} viewBox={viewBox}>
        <g id="arc-content">
          {/* Render links on the diagram */}
          {links.map((link) => (
            <Link
              name={link.name}
              pathData={link.d}
              isConnectedNodeSelected={link.name.includes(selected)}
              key={link.id}
            />
          ))}
          {/* Render the nodes on the diagram */}
          {nodes.map((node) => (
            <Node
              key={node.id}
              xPosition={
                node.name.includes("haru:")
                  ? scales.haruScale(node.name)
                  : scales.userScale(node.name)
              }
              node={node}
              size={size(Math.pow(1.2, node.n))}
              arcHeight={450}
              isSelected={node.name === selected}
              handle={handleNodeSelect}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
