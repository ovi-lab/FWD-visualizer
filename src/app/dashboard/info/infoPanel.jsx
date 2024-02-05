import React, { Component } from "react";
import ThreadList from "./threadList";
import "./infoStyles.css";


class InfoPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      selected: "",
    };
  }

  componentDidMount() {
    this.setState({
      data: this.props.data,
      selected: this.props.selected
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({ selected: this.props.selected });
    }
  }

anchorButtonClick = (anchorId) => {
  this.props.anchorSelect(anchorId)
}

  render() {
    const { data, selected } = this.state;
    return (
      <div className="flex flex-col h-screen col-span-2 infoPanel">
        <h3>Information Panel</h3>
        {!selected ? (
          <p>Select an item on either diagram to get started</p>
        ) : (
          <div>
            <h4>{selected}</h4>
            <p>Here are the items attached to the selected node:</p>
            <ThreadList data={data} selected={selected} anchorClick={this.anchorButtonClick}/>
          </div>
        )}
      </div>
    );
  }
}

export default InfoPanel;
