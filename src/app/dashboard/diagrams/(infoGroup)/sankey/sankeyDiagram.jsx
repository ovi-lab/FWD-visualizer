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
  const [data, setData] = useState({nodes: [], links: []});
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [viewBox, setViewBox] = useState(`0 0 600 400`);
  const sankeyRef = React.useRef();
  const { selectedNode, setSelectedNode } = useSelectedNode();
  const { selectedTime } = useTime();
  const { selectedFilters } = useFilter();

  useEffect(() => {
    fetch(
      "http://127.0.0.1:6400/api/diagramjson?" +
        new URLSearchParams({ selection: "both" }),
      { method: "GET" }
    )
      .then((res) => res.json())
      .then((data) => {
        setData({nodes: data.nodes, links: data.links});
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading) {
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
      // console.log("error", error);
    }
  }
  }, [data, selectedTime, selectedFilters, props.dataDirection, loading]);

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
  if (loading) return <p>Loading...</p>;
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
