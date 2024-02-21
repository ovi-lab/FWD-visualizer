"use client";
import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import "../graphStyles.css";
import { useSelected } from "../../../contexts/selectedContext";
import { useTime } from "@/app/contexts/timeContext";

// Create subcomponents for nodes, links, and labels
const Node = ({ xPosition, node, size, arcHeight, isSelected, handle }) => (
  <g>
    <circle
      className="node arcNode"
      cx={xPosition}
      cy={arcHeight - 30}
      id={node.name}
      r={size}
      fill={
        isSelected
          ? "green"
          : node.name.includes("haru:")
          ? "#80b1d3"
          : "#fb8072"
      }
      stroke="grey"
      onClick={() => handle(node.name)}
    />
    <text
      x={xPosition}
      y={arcHeight - 15}
      transform={`rotate(-45)`}
      style={{
        textAnchor: "end",
        transformOrigin: `${xPosition}px ${arcHeight - 5}px`,
        fontSize: "0.75rem",
      }}
      key={node.name}
      className="label arcLabel"
    >
      {node.name}
    </text>
  </g>
);

const Link = ({ link }) => (
  <path
    key={link.name}
    d={link.d}
    fill="none"
    stroke="grey"
    strokeWidth={4}
    className="link arcLink"
    id={link.name}
  />
);

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
        const allNodes = data.nodes.map((d) => d.name);
        const arcWidth = 750;
        const arcHeight = 450;

        // A linear scale to position the nodes on the X axis
        const x = d3.scalePoint().range([arcWidth, 0]).domain(allNodes);

        setScales({ scalePoint: x });

        const idToNode = {};
        data.nodes.forEach((n) => {
          idToNode[n.id] = n;
        });

        const calculatedLinks = data.links.haru
          .concat(data.links.user)
          .map((link) => {
            let start = x(idToNode[link.source].name);
            let end = x(idToNode[link.target].name);
            let d = [
              "M",
              start,
              arcHeight - 30,
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
              arcHeight - 30,
            ].join(" ");
            return { ...link, d };
          });

        setNodes(data.nodes);
        setLinks(calculatedLinks);
        setLoading(false);
      });
  }, []);

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
  const size = d3.scaleLinear().domain([1, 10]).range([2, 10]);

  if (isLoading) return <p>loading...</p>;

  return (
    <div className="p-6 arcWrapper">
      <h3 style={{ textAlign: "left" }}>Arc Diagram</h3>
      <svg width={"100%"} height={"100%"} viewBox={viewBox}>
        <g id="arc-content">
          {/* Render links on the diagram */}
          {links
            .filter(
              (item) => Date.parse(item.timestamp) < Date.parse(selectedTime)
            )

            .map((link) => (
              <Link link={link} key={link.id} />
            ))}
          {/* Render the nodes on the diagram */}
          {nodes
            .filter(
              (item) => Date.parse(item.timestamp) < Date.parse(selectedTime)
            )
            .map((node) => (
              <Node
                key={node.id}
                xPosition={scales.scalePoint(node.name)}
                node={node}
                size={size(Math.pow(1.22, node.n))}
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
