import React, { useState, useEffect } from "react";
import {
  sankey as d3sankey,
  sankeyCenter,
  sankeyLinkHorizontal,
} from "d3-sankey";
import "../graphStyles.css";
import { useSelectedNode } from "../../../../contexts/selectedNodeContext";
import { useTime } from "@/app/contexts/timeContext";
import { Node, Link } from "./sankeyParts";

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

function filterTimestamp(input, time) {
  return input
    .filter((item) => Date.parse(item.timestamp) <= Date.parse(time))
    .map((d) => ({ ...d }));
}

const SankeyDiagram = (props) => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [viewBox, setViewBox] = useState(`0 0 600 400`);
  const sankeyRef = React.useRef();
  const { selectedNode, setSelectedNode } = useSelectedNode();
  const { selectedTime } = useTime();

  useEffect(() => {
    let filteredLinks = "";
    fetch("../../../data/new_robot_data_2_20.json")
      .then((res) => res.json())
      .then((data) => {
        const filteredNodes = filterTimestamp(data.nodes, selectedTime);

        if (props.dataDirection === "haru-user") {
          filteredLinks = filterTimestamp(data.links.haru, selectedTime);
        } else {
          filteredLinks = filterTimestamp(data.links.user, selectedTime);
        }
        try {
          const { nodes, links } = sankeyGenerator({
            nodes: filteredNodes,
            links: filteredLinks,
          });
          setNodes(nodes);
          setLinks(links);
        } catch (error) {
          // D3 Sankey seems to throw a RangeError but functionality is not affected.
          // console.log("error", error);
        }
      });
  }, [props.dataDirection, selectedTime]);

  const handleSankeyInteraction = (nodeName) => {
    console.log("nodeName", nodeName);
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

  return (
    <div className="sankeyWrapper">
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
                key={node.id}
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
