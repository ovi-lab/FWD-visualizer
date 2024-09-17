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
const Node = ({ xPosition, node, size, arcHeight, isSelected, handle }) => (
  <g key={`node${node.name}`}>
    <line
      x1={xPosition}
      y1={arcHeight + size + 5}
      x2={xPosition}
      y2={arcHeight + 30}
      stroke="grey"
      strokeWidth="1"
    />
    {node.turn.toLowerCase() === "robot" ? <rect
    className="node arcNode"
    height={size*1.5}
    width={size*1.5}
    x={xPosition - size /1.5}
    y={arcHeight - size/2}
    stroke={!isSelected? "grey" : "rgb(139, 227, 139)"}
    strokeWidth={!isSelected? 1: 2}
    fill={!isSelected
      ? color(node.name.match(/:(.*)/)[1].trim())
      : "rgb(139, 227, 139)"
      // : color(node.name.match(/:(.*)/)[1].trim())
      // : "#80b1d3"
    }
    onClick={() => handle(node.name)}
    />
      : <circle
      className="node arcNode"
      cx={xPosition}
      cy={arcHeight}
      id={node.name}
      r={size}
      stroke={!isSelected? "grey" : "rgb(139, 227, 139)"}
    strokeWidth={!isSelected? 1: 2}
    fill={!isSelected
      ? color(node.name.match(/:(.*)/)[1].trim())
      : "rgb(139, 227, 139)"
      // : color(node.name.match(/:(.*)/)[1].trim())
      // : "#80b1d3"
    }
      onClick={() => handle(node.name)}
    />}
    
    <text
      className={"label arcLabel text-m font-mono"}
      x={xPosition - 35}
      y={arcHeight + 35}
      transform={`rotate(-45)`}
      style={{
        textAnchor: "end",
        transformOrigin: `${xPosition}px ${arcHeight - 15}px`,
      }}
    >
      {node.name}
    </text>
  </g>
);

/**
 * Represents a link component for an arc diagram.
 * @component
 * @param {object} props - The props object containing the properties of the link.
 * @param {string} props.name - The name of the link.
 * @param {string} props.pathData - The path data for the link.
 * @returns {JSX.Element} - A JSX element representing the link.
 */
const Link = ({ name, source, pathData, isConnectedNodeSelected }) => (
  <path
    key={name}
    d={pathData}
    fill="none"
    stroke={isConnectedNodeSelected ? "rgb(139, 227, 139)" : color(source.match(/:(.*)/)[1].trim())}
    opacity={isConnectedNodeSelected ? "100%" : "50%"}
    strokeWidth={7}
    className="link arcLink"
    id={name}
  />
);

export { Node, Link };
