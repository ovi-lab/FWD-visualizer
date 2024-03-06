
/**
 * Represents a node component for an arc diagram.
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
  <g>
  <line
    x1={xPosition}
    y1={arcHeight + size + 5}
    x2={xPosition}
    y2={arcHeight+30}
    stroke="grey"
    strokeWidth="1"
  />
    <circle
      className="node arcNode"
      cx={xPosition}
      cy={arcHeight}
      id={node.name}
      r={size}
      fill={
        isSelected
          ? "rgb(139, 227, 139)"
          : (node.name.includes("haru:")
          ? "#80b1d3"
          : "#fb8072")
      }
      stroke="grey"
      onClick={() => handle(node.name)}
    />
    
    <text
      x={xPosition - 30}
      y={arcHeight + 30}
      transform={`rotate(-45)`}
      style={{
        textAnchor: "end",
        transformOrigin: `${xPosition}px ${arcHeight - 15}px`,
        fontSize: "0.8rem",
      }}
      key={node.name}
      className="label arcLabel"
    >
      {node.name}
    </text>
    
  </g>
);

/**
 * Represents a link component for an arc diagram.
 * @param {object} props - The props object containing the properties of the link.
 * @param {string} props.name - The name of the link.
 * @param {string} props.pathData - The path data for the link.
 * @returns {JSX.Element} - A JSX element representing the link.
 */
const Link = ({name, pathData, isConnectedNodeSelected }) => (
  <path
    key={name}
    d={pathData}
    fill="none"
    stroke={isConnectedNodeSelected ? "red" : "grey"}
    opacity={isConnectedNodeSelected ? "100%" : "20%"}
    strokeWidth={4}
    className="link arcLink"
    id={name}
  />
);

export { Node, Link };
