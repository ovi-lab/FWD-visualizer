import React, { Component } from "react";
import {
  sankey as d3sankey,
  sankeyCenter,
  sankeyLinkHorizontal,
} from "d3-sankey";
import "./graphStyles.css";
import * as d3 from "d3";

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

const color = d3.scaleOrdinal(d3.schemeSet3);

const Nodes = ({ name, id, y1, y0, x1, x0, width, isSelected, handle}) => {
  return (
    <g key={id}>
      <rect
      className="node sankeyNode"
        height={y1 - y0}
        width={x1 - x0}
        x={x0}
        y={y0}
        stroke={"black"}
        fill={isSelected ? "green" : color(name.match(/:(.*)/)[1].trim())}
        onClick={() => {
          handle("node", name, id)
        }}
      />
      <title>`${name}`</title>
      <text
        key={id}
        x={x0 < width / 2 ? x1 + 6 : x0 - 6}
        y={(y1 + y0) / 2}
        dy={"0.35em"}
        textAnchor={x0 < width / 2 ? "start" : "end"}
      >
        {name}
      </text>
    </g>
  );
};

const Links = (link) => {
  return (
    <g>
      <path
        key={link.id}
        className="link sankeyLink"
        id={link.id}
        d={sankeyLinkHorizontal()(link)}
        stroke={color(link.source.name.match(/:(.*)/)[1].trim())}
        fill="none"
        strokeOpacity={0.2}
        strokeWidth={Math.max(1, link.width)}
        style={{ mixBlendMode: "multiply" }}
      />
    </g>
  );
};

class SankeyDiagram extends Component {
  sankeyRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      links: [],
      width: 0,
      height: 0,
      chatAnchor: null
    };
  }
  componentDidMount() {
    this.loadGraphData();
  }
  
  componentDidUpdate(prevProps) {
    // if the selected node is changed in props, update state
    if (this.props.selected !== prevProps.selected) {
      this.setState({selected: this.props.selected})
      
    }
    // If the selected visualization direction is changed, regenerate the viz
    if (this.props.linkData !== prevProps.linkData) {
      this.loadGraphData();
    }
  }

  loadGraphData() {
    const { nodeData, linkData } = this.props;

    const { nodes, links } = sankeyGenerator({
      nodes: nodeData.map((d) => Object.assign({}, d)),
      links: linkData.map((d) => Object.assign({}, d)),
    });

    const { width, height } = this.sankeyRef.current.getBoundingClientRect();

    this.setState({
      nodes: nodes,
      links: links,
      width: width,
      height: height,
    });
  }

  handleSankeyInteraction = (type, nodeName, id) => {
    // this.setState({selected: nodeName});
    this.props.handle(type, nodeName, id)
  }

  render() {
    let { nodes, links, width, height, selected} = this.state;
    return (
      <div className="sankeyWrapper">
        <svg
          className="sankeyDiagram"
          ref={this.sankeyRef}
          width={"100%"}
          height={"100%"}
          viewBox={`0 0 600 400`}
        >
          <g style={{ mixBlendMode: "multiply" }}>
            {nodes.map((node) => {
              //add nodes
              if (node.show === "true") {
                return <Nodes node {...node} width={width} height={height} isSelected={node.name === selected} handle={this.handleSankeyInteraction}/>;
              }
            })}
            {links.map((link) => (
              <Links link {...link} />
            ))}
          </g>
        </svg>
      </div>
    );
  }
}

export default SankeyDiagram;
