"use client";
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "../graphStyles.css";

// Create subcomponents for nodes, links, and labels
const Node = ({ cx, node, size, arcHeight, isSelected, handle }) => (
  <circle
    className="node arcNode"
    cx={cx}
    cy={arcHeight - 30}
    id={node.name}
    r={size(Math.pow(1.1, node.n))}
    fill={
      isSelected ? "green" : node.name.includes("haru:") ? "#80b1d3" : "#fb8072"
    }
    stroke="grey"
    onClick={() => handle("node", node.name, node.id)}
  />
);

const Link = ({ link, key }) => (
  <path
    key={key}
    d={link.d}
    fill="none"
    stroke="grey"
    strokeWidth={4}
    className="link arcLink"
    id={link.name}
  />
);

const Label = ({ cx, node, arcHeight }) => (
  <text
    x={cx}
    y={arcHeight - 15}
    transform={`rotate(-45)`}
    style={{
      textAnchor: "end",
      transformOrigin: `${x(node.name)}px ${arcHeight - 5}px`,
      fontSize: "0.75rem",
    }}
    key={node.name}
    className="label arcLabel"
  >
    {node.name}
  </text>
);

// Begin ArcDiagram Component
export default function ArcDiagram(props) {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const previousSelected = useRef(null);
  const [xScale, setXScale] = useState(null);
  const [size, setSize] = useState(null);

  useEffect(() => {
    if (props.selected !== previousSelected.current) {
      setSelected(props.selected);
      previousSelected.current = props.selected;
    }
  }, [props.selected, previousSelected]);

  useEffect(() => {
    fetch("../../../data/new_robot_data.json")
      .then((res) => res.json())
      .then((data) => {
        const allNodes = data.nodes.map((d) => d.name);
        const arcWidth = 750;
        const arcHeight = 450;

        // A linear scale to position the nodes on the X axis
        const x = d3.scalePoint().range([0, arcWidth]).domain(allNodes);
        console.log("XSCALE CHECK: " + x);

        // A linear scale for node size
        setSize(d3.scaleLinear().domain([1, 10]).range([2, 10]));

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
        setXScale(x);
        setLoading(false);
      });
  }, []);

  const handleNodeSelect = (type, nodeName, id) => {
    setState((prevState) => ({
      ...prevState,
      selected: nodeName,
    }));
    props.handleInteraction(type, nodeName, id);
  };

  if (isLoading) return <p>loading...</p>;
  console.log(size);
  return (
    <div className="arcWrapper">
      <h3 style={{ textAlign: "left" }}>Arc Diagram</h3>
      <svg width={"100%"} height={"100%"} viewBox={`0 0 750 450`}>
        <g transform={`translate(${100},${-100})`}>
          {/* Render links on the diagram */}
          {links.map((link) => (
            <Link link={link} key={link.id} />
          ))}
          {/* Render the nodes on the diagram */}
          {nodes.map((node) => (
            <Node
              key={node.id}
              cx={xScale(node.name)}
              node={node}
              size={size}
              arcHeight={450}
              isSelected={node.name === selected}
              handle={handleNodeSelect}
            />
          ))}
          {/* Render Labels on the diagram */}
          {nodes.map((node) => (
            <Label
              key={node.id}
              cx={xScale(node.name)}
              node={node}
              arcHeight={450}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
