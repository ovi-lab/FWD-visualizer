import React, { useState, useEffect } from "react";
import {
  sankey as d3sankey,
  sankeyCenter,
  sankeyLinkHorizontal,
} from "d3-sankey";
import "../graphStyles.css";
import { useSelected } from "../../../../contexts/selectedContext";
import { useTime } from "@/app/contexts/timeContext";
import { Node, Link } from "./diagramParts";

const width = 600;
const height = 400;

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
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [viewBox, setViewBox] = useState(`0 0 600 400`);
  const sankeyRef = React.useRef();
  const { selected, setSelected } = useSelected();
  const { selectedTime } = useTime();

  useEffect(() => {
    let selectedLinks = "";
    fetch("../../../data/new_robot_data_2_20.json")
      .then((res) => res.json())
      .then((data) => {
        if (props.dataDirection === "haru-user") {
          selectedLinks = data.links.haru;
        } else {
          selectedLinks = data.links.user;
        }
        const { nodes, links } = sankeyGenerator({
          nodes: data.nodes.map((d) => ({ ...d })),
          links: selectedLinks.map((d) => ({ ...d })),
        });

        const { width: newWidth, height: newHeight } =
          sankeyRef.current.getBoundingClientRect();
        setNodes(nodes);
        setLinks(links);
        setWidth(newWidth);
        setHeight(newHeight);
      });
  }, [props.dataDirection, selectedTime]);

  const handleSankeyInteraction = (nodeName) => {
    console.log("nodeName", nodeName);
    setSelected(nodeName);
  };

  useEffect(() => {
    // Calculate bounding box of the generated content
    const svgContent = document.getElementById("sankey-content");
    if (svgContent) {
      const { x, y, width, height } = svgContent.getBBox();
      const newViewBox = `${x} ${y} ${width} ${height}`;
      setViewBox(newViewBox);
    }
  }, [nodes, links]);

  return (
    <div className="sankeyWrapper w-100% h-100%">
      <svg
        className="sankeyDiagram p-1"
        ref={sankeyRef}
        width={"100%"}
        height={"100%"}
        viewBox={viewBox}
      >
        <g style={{ mixBlendMode: "multiply" }} id={"sankey-content"}>
          {nodes
            .filter(
              (node) => Date.parse(node.timestamp) <= Date.parse(selectedTime)
            )
            .map((node) =>
              node.show === "true" ? (
                <Node
                  key={node.id}
                  node
                  {...node}
                  width={width}
                  height={height}
                  isSelected={node.name === selected}
                  handle={handleSankeyInteraction}
                  show={node.show}
                />
              ) : null
            )}
          {links
            .filter(
              (link) => Date.parse(link.timestamp) <= Date.parse(selectedTime)
            )
            .map((link) => (
              <Link
                key={link.name}
                linkID={link.id}
                dValue={sankeyLinkHorizontal()(link)}
                linkSourceName={link.source.name.match(/:(.*)/)[1].trim()}
                linkedNodeSelected={link.name.includes(selected)}
                linkWidth={link.width}
              />
            ))}
        </g>
      </svg>
    </div>
  );
};

export default SankeyDiagram;
