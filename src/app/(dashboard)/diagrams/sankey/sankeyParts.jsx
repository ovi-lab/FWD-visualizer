import { useSelectedColour } from "@/app/contexts/SelectedColourContext";
import { scaleOrdinal, schemeSet3 } from "d3";

// Create a color scale using D3's categorical color scheme
const color = scaleOrdinal(schemeSet3);

/**
 * Node Component
 * Represents a node in a Sankey diagram.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.nodeData - Data object for the node, containing position and size.
 * @param {number} props.width - Total width of the diagram (used for positioning).
 * @param {boolean} props.isSelected - Indicates if the node is currently selected.
 * @param {Function} props.handle - Function to handle node click events.
 *
 * @returns {JSX.Element} The rendered node element.
 */
const Node = ({
  nodeData,
  width,
  isSelected,
  handle,
}) => {
  // Determine if the node is on the left half of the diagram
  const widthLessThanHalf = nodeData.x0 < width / 2;

  // Position for the label text relative to the node
  const rectPosition = widthLessThanHalf ? nodeData.x1 + 6 : nodeData.x0 - 6;

  // Text alignment based on node position
  const textAnchorPosition = widthLessThanHalf ? "start" : "end";

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
  return (
    <g key={nodeData.id}>
      {/* Node rectangle */}
      <rect
        height={nodeData.y1 - nodeData.y0} // Height of the node
        width={nodeData.x1 - nodeData.x0}  // Width of the node
        x={nodeData.x0}                    // X-coordinate position
        y={nodeData.y0}                    // Y-coordinate position
        stroke={isSelected ? "rgb(14, 165, 233)" : "black"} // Border color changes if selected
        fill={
          isSelected
            ? "rgb(139, 227, 139)" // Fill color if selected
            : colors[Math.floor(nodeData.id / 2)]  // Use selectedColour from context if not selected
        }
        className="hover:fill-[#8be38b] cursor-pointer" // Tailwind CSS classes for hover effect and pointer cursor
        onClick={() => {
          handle(nodeData.name); // Handle node click event
        }}
      />
      {/* Tooltip displaying node name */}
      <title>{nodeData.name}</title>
      {/* Node label */}
      <text
        key={`${nodeData.id}a`}
        className="text-xs font-mono" // Tailwind CSS classes for text styling
        x={rectPosition}             // X-coordinate for the text
        y={(nodeData.y1 + nodeData.y0) / 2} // Y-coordinate centered vertically on the node
        dy={"0.35em"}                // Adjusts the text vertically
        textAnchor={textAnchorPosition} // Aligns text based on node position
      >
        {nodeData.name}
      </text>
    </g>
  );
};

/**
 * Link Component
 * Represents a link between nodes in a Sankey diagram.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string|number} props.linkID - The unique identifier for the link.
 * @param {string} props.dValue - The SVG path data for the link.
 * @param {string} props.linkSourceName - The name of the source node.
 * @param {boolean} props.linkedNodeSelected - Indicates if the link is connected to a selected node.
 * @param {number} props.linkWidth - The width of the link path.
 *
 * @returns {JSX.Element} The rendered link element.
 */

const Link = ({
  linkID,
  dValue,
  linkSourceName,
  linkedNodeSelected,
  linkWidth,
}) => {

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
  return (
    <g>
      {/* Link path */}
      <path
        id={linkID}       // Unique identifier for the link
        d={dValue}        // SVG path data defining the link's shape
        stroke={
          linkedNodeSelected
            ? "rgb(139, 227, 139)" // Stroke color if linked node is selected
            : colors[Math.floor(linkID/ 2)]
        }
        fill="none"        // No fill color
        strokeOpacity={linkedNodeSelected ? "1" : "1"} // Opacity adjustment
        strokeWidth={Math.max(1, linkWidth)} // Ensure stroke width is at least 1
        style={{
          mixBlendMode: "multiply",            // Blends overlapping links
          strokeDasharray: 1000,               // Total length of dashes
          strokeDashoffset: 1000,              // Starting point for the dash animation
          animation: "dash 1s linear forwards", // Animates the drawing of the path
        }}
      />
    </g>
  );
};

export { Node, Link };
    