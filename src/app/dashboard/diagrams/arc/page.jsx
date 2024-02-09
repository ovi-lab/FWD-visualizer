'use client'
import React, { Component } from "react";
import * as d3 from "d3";
import "../graphStyles.css";

const arcWidth = 600;
const arcHeight = 400;

// Create subcomponents for nodes, links, and labels
const Node = ({ key, x, node, size, arcHeight, isSelected, handle }) => (
  <circle
    className="node arcNode"
    cx={x(node.name)}
    cy={arcHeight - 30}
    id={node.name}
    r={size(Math.pow(1.1, node.n))}
    key={key}
    fill={isSelected
        ? "green"
        : node.name.includes("haru:")
        ? "#80b1d3"
        : "#fb8072"}
    stroke="grey"
    onClick={() => handle("node", node.name, node.id)}
  />
);

const Link = ({ link, key }) => (
  <path
    key={key}
    d={link.d}
    fill="none"
    stroke="grey"
    strokeWidth={4}
    className="link arcLink"
    id={link.name}
  />
);

const Label = ({ x, node, arcHeight }) => (
  <text
    x={x(node.name)}
    y={arcHeight - 15}
    transform={`rotate(-45)`}
    style={{
      textAnchor: "end",
      transformOrigin: `${x(node.name)}px ${arcHeight - 5}px`,
      fontSize: "0.75rem",
    }}
    key={node.name}
    className="label arcLabel"
  >
    {node.name}
  </text>
);

// Begin ArcDiagram Component
class ArcDiagram extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: [],
      links: [],
      selected: null,
    };
  }
  componentDidMount() {
    this.loadGraphData();
  }

  loadGraphData() {
    const data = this.props.data;
    let allNodes = data.nodes.map((d) => d.name);

    // A linear scale to position the nodes on the X axis
    let x = d3.scalePoint().range([0, arcWidth]).domain(allNodes);

    // A linear scale for node size
    let size = d3.scaleLinear().domain([1, 10]).range([2, 10]);

    let idToNode = {};
    data.nodes.forEach((n) => {
      idToNode[n.id] = n;
    });

    // Calculate path 'd' attribute for each link
    let calculatedLinks = data.links.haru
      .concat(data.links.user)
      .map((link) => {
        let start = x(idToNode[link.source].name);
        let end = x(idToNode[link.target].name);
        let d = [
          "M",
          start,
          arcHeight - 30,
          "A",
          (start - end) / 2,
          ",",
          (start - end) / 2,
          0,
          0,
          ",",
          start < end ? 1 : 0,
          end,
          ",",
          arcHeight - 30,
        ].join(" ");

        return { ...link, d };
      });

    this.setState({
      nodes: data.nodes,
      links: calculatedLinks,
      x: x,
      size: size,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.selected !== prevProps.selected ) {
      this.setState({selected: this.props.selected})
    }
  }

  handleNodeSelect = (type, nodeName, id) => {
    this.setState({ selected: nodeName });
    this.props.handleInteraction(type, nodeName, id);
  };

  render() {
    const { nodes, links, x, size, selected } = this.state;
    return (
      <div className="arcWrapper">
      <h3 style={{textAlign:"left"}}>Arc Diagram</h3>
        <svg width={"100%"} height={"100%"} viewBox={`0 0 750 450`}>
          <g transform={`translate(${100},${-100})`}>
            {
              // Render links on the diagram
              links.map((link) => (
                <Link link={link} key={link.id} />
              ))
            }
            {
              // Render the nodes on the diagram
              /* .sort((a, b) => +b.n - +a.n) */
              nodes.map((node) => (
                <Node
                  key={node.id}
                  x={x}
                  node={node}
                  size={size}
                  arcHeight={arcHeight}
                  isSelected={node.name === selected}
                  handle={this.handleNodeSelect}
                />
              ))
            }

            {
              // Render Labels on the diagram
              nodes.map((node) => (
                <Label x={x} node={node} arcHeight={arcHeight} />
              ))
            }
          </g>
        </svg>
      </div>
    );
  }
}

export default ArcDiagram;
