import { scaleOrdinal, schemeSet3 } from "d3";
const color = scaleOrdinal(schemeSet3);

const Node = ({
  name,
  id,
  y1,
  y0,
  x1,
  x0,
  width,
  height,
  isSelected,
  handle,
}) => {
  return (
    <g key={id}>
      <rect
        className="node sankeyNode "
        height={y1 - y0}
        width={x1 - x0}
        x={x0}
        y={y0}
        stroke={isSelected ? "rgb(14, 165, 233)" : "black"}
        fill={
          isSelected
            ? "rgb(139, 227, 139)"
            : color(name.match(/:(.*)/)[1].trim())
        }
        onClick={() => {
          handle(name);
        }}
      />
      <title>{name}</title>
      <text
        key={id}
        fontSize={"0.50em"}
        x={x0 < width / 2 ? x1 + 6 : x0 - 6}
        y={(y1 + y0) / 2}
        dy={"0.35em"}
        textAnchor={x0 < width / 2 ? "start" : "end"}
      >
        {name.split(": ")[0]}:
      </text>
      <text
        key={id}
        fontSize={"0.50em"}
        x={x0 < width / 2 ? x1 + 6 : x0 - 6}
        y={((y1 + y0) / 2) + 10}
        dy={"0.35em"}
        textAnchor={x0 < width / 2 ? "start" : "end"}
      >
        {name.split(": ")[1]}
      </text>
      
    </g>
  );
};

const Link = ({
  linkID,
  dValue,
  linkSourceName,
  linkedNodeSelected,
  linkWidth,
}) => {
  // console.log('linkedNodeSelected', linkedNodeSelected)
  return (
    <g>
      <path
        className="link sankeyLink"
        id={linkID}
        d={dValue}
        stroke={color(linkSourceName)}
        fill="none"
        strokeOpacity={linkedNodeSelected ? "100%" : "20%"}
        strokeWidth={Math.max(1, linkWidth)}
        style={{ mixBlendMode: "multiply" }}
      />
    </g>
  );
};

export { Node, Link };
