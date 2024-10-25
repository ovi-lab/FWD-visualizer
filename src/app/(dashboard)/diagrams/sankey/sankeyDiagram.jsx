import React, { useState, useEffect } from "react";
import {
  sankey as d3sankey,
  sankeyCenter,
  sankeyLinkHorizontal,
} from "d3-sankey";
import { useSelectedNode } from "@/app/contexts/selectedNodeContext";
import { useFilter } from "@/app/contexts/filterContext";
import { Node, Link } from "./sankeyParts";

// Function to create a D3 Sankey generator with specified dimensions
const createSankeyGenerator = (width, height) => {
  return d3sankey()
    .nodeWidth(15) // Width of each node
    .nodePadding(10) // Vertical space between nodes
    .nodeId((node) => node.id) // Unique identifier for nodes
    .nodeAlign(sankeyCenter) // Alignment of nodes
    .extent([
      [1, 1],
      [width, height - 5],
    ]); // SVG area where the Sankey diagram will be rendered
};

/**
 * Combines two sets of links and ensures bidirectional links are handled correctly.
 * @param {Array} links1 - First set of links (e.g., robot links).
 * @param {Array} links2 - Second set of links (e.g., user links).
 * @returns {Array} - Combined array of links with bidirectional links separated.
 */
const separateBidirectionalLinks = (links1, links2) => {
  const combinedLinks = [];

  // Add all links from the first set, marking them as forward direction
  links1.forEach((link) => {
    combinedLinks.push({ ...link, direction: "forward" });
  });

  // Process the second set of links
  links2.forEach((link) => {
    // Check if a reverse link already exists in combinedLinks
    const existingLink = combinedLinks.find(
      (l) => l.source === link.target && l.target === link.source
    );

    // If no reverse link exists, add the link to combinedLinks
    if (!existingLink) {
      combinedLinks.push({ ...link, direction: "forward" });
    }
  });

  return combinedLinks;
};

// Default dimensions for the SVG viewBox
const defaultViewBox = {
  x: 0,
  y: 0,
  width: 600,
  height: 400,
};

/**
 * SankeyDiagram Component
 * Renders a Sankey diagram based on filtered data and user interactions.
 *
 * @param {string} dataDirection - Direction of data flow ("robot-user" or "user-robot").
 * @param {boolean} isBidirectional - Flag to determine if both directions should be displayed.
 * @returns {JSX.Element} - The rendered Sankey diagram.
 */
const SankeyDiagram = ({ dataDirection, isBidirectional = false }) => {
  // State to store processed nodes and links for the diagram
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  // ViewBox dimensions for the SVG element
  const viewBox = defaultViewBox;

  // Context hooks for selected node and filtered data
  const { selectedNode, setSelectedNode } = useSelectedNode();
  const { filteredDiagramData } = useFilter();

  // Effect hook to process data whenever filtered data or data direction changes
  useEffect(() => {
    // If there's no data, do nothing
    if (!filteredDiagramData) return;

    // Get nodes and clone links to avoid mutating the original data
    const filteredNodes = filteredDiagramData.nodes;
    const linkClone = structuredClone(filteredDiagramData.links);

    let filteredLinks;

    if (isBidirectional) {
      // Combine robot and user links for bidirectional display
      filteredLinks = separateBidirectionalLinks(
        linkClone.robot,
        linkClone.user
      );
    } else {
      // Select links based on data direction
      filteredLinks =
        dataDirection === "robot-user" ? linkClone.robot : linkClone.user;
    }

    // Create a Sankey generator with the specified dimensions
    const sankeyGenerator = createSankeyGenerator(
      viewBox.width,
      viewBox.height
    );

    try {
      // Generate the Sankey diagram data (nodes and links)
      const { nodes, links } = sankeyGenerator({
        nodes: filteredNodes,
        links: filteredLinks,
      });

      // Update state with the processed nodes and links
      setNodes(nodes);
      setLinks(links);
    } catch (error) {
      console.error("Error generating Sankey diagram:", error);
    }
  }, [filteredDiagramData, dataDirection]);

  /**
   * Handles user interaction with the Sankey diagram nodes.
   * Updates the selected node in the global context.
   *
   * @param {string} nodeName - The name of the node that was interacted with.
   */
  const handleSankeyInteraction = (nodeName) => {
    setSelectedNode(nodeName);
  };

  // If data is still loading, display a loading message
  if (!filteredDiagramData) return <div>Loading...</div>;

  // Render the SVG element containing the Sankey diagram
  return (
    <svg
      className="p-1"
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width + 20} ${
        viewBox.height + 50
      }`}
    >
      {/* Group element to contain all diagram elements */}
      <g style={{ mixBlendMode: "multiply" }} id="svg-content">
        {/* Render links */}
        {links.map((link) => (
          <Link
            key={link.name}
            linkID={link.id}
            dValue={sankeyLinkHorizontal()(link)} // Path data for the link
            linkSourceName={link.sourceName.match(/:(.*)/)[1].trim()} // Extract source name
            linkedNodeSelected={link.name.includes(selectedNode)} // Check if linked to selected node
            linkWidth={link.width}
          />
        ))}
        {/* Render nodes */}
        {nodes.map(
          (node, i) =>
            node.show && // Check if node should be displayed
            !(i === 1 && dataDirection === "robot-user") && ( // Exclude specific node conditionally
              <Node
                key={node.name}
                nodeData={node} // Spread node properties
                width={viewBox.width} // Width of the SVG viewBox
                isSelected={node.name === selectedNode} // Highlight if selected
                handle={handleSankeyInteraction} // Interaction handler
              />
            )
        )}
      </g>
    </svg>
  );
};

export default SankeyDiagram;
