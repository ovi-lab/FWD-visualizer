import { scaleOrdinal, schemeSet3 } from "d3";
const color = scaleOrdinal(schemeSet3);

/**
 * Represents a node component for an arc diagram.
 * @component
 * @param {object} props - The props object containing the properties of the node.
 * @param {object} props.node - The node object containing information about the node.
 * @param {number} props.xPosition - The x-coordinate position of the node.
 * @param {number} props.arcHeight - The height of the arc where the node is positioned.
 * @param {number} props.size - The size of the node.
 * @param {boolean} props.isSelected - A boolean indicating whether the node is selected.
 * @param {Function} props.handle - The function to handle the node click event.
 * @returns {JSX.Element} - A JSX element representing the node.
 */
const Node = ({ xPosition, node, size, arcHeight, isSelected, handle }) => {
  // Determine stroke and fill colors based on whether the node is selected
  const strokeColor = isSelected ? "rgb(139, 227, 139)" : "grey";
  const strokeWidth = isSelected ? 2 : 1;
  const fillColor = isSelected
    ? "rgb(139, 227, 139)"
    : color(node.name.match(/:(.*)/)[1].trim());

  // Handle node click event
  const handleClick = () => handle(node.name);

  // Determine if the node is a "robot" type or a different entity
  const isRobot = node.turn.toLowerCase() === "robot";

  return (
    <g key={`node${node.name}`}>
      {/* Render the line connecting the node */}
      <line
        x1={xPosition}
        y1={arcHeight + size + 5}
        x2={xPosition}
        y2={arcHeight + 30}
        stroke="grey"
        strokeWidth="1"
      />

      {/* Conditionally render a rect for "robot" type nodes or a circle for others */}
      {isRobot ? (
        <rect
          className="node arcNode hover:fill-[#8be38b]"
          height={size * 1.5}
          width={size * 1.5}
          x={xPosition - size / 1.5}
          y={arcHeight - size / 2}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill={fillColor}
          onClick={handleClick}
        />
      ) : (
        <circle
          className="node arcNode hover:fill-[#8be38b]"
          cx={xPosition}
          cy={arcHeight}
          id={node.name}
          r={size}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill={fillColor}
          onClick={handleClick}
        />
      )}

      {/* Render node label */}
      <text
        className="label arcLabel text-m font-mono"
        x={xPosition - 35}
        y={arcHeight + 35}
        transform="rotate(-45)"
        style={{
          textAnchor: "end",
          transformOrigin: `${xPosition}px ${arcHeight - 15}px`,
        }}
      >
        {node.name}
      </text>
    </g>
  );
};


/**
 * Represents a link component for an arc diagram.
 * @component
 * @param {object} props - The props object containing the properties of the link.
 * @param {string} props.name - The name of the link.
 * @param {string} props.source - The source node's name associated with the link.
 * @param {string} props.pathData - The path data for the link (SVG path data).
 * @param {boolean} props.isConnectedNodeSelected - A boolean indicating if the connected node is selected.
 * @returns {JSX.Element} - A JSX element representing the link.
 */
const Link = ({ name, source, pathData, isConnectedNodeSelected }) => {
  // Determine stroke color based on whether the connected node is selected
  const strokeColor = isConnectedNodeSelected
    ? "rgb(139, 227, 139)"
    : color(source.match(/:(.*)/)[1].trim());

  // Set opacity based on selection status
  const opacity = isConnectedNodeSelected ? "100%" : "50%";

  return (
    <path
      key={name}
      d={pathData}
      fill="none"
      stroke={strokeColor}
      opacity={opacity}
      strokeWidth={7}
      className="link arcLink"
      id={name}
    />
  );
};


export { Node, Link };
