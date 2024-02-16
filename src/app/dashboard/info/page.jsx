import React, { useState, useEffect } from "react";
import ThreadList from "./threadList";
import "./infoStyles.css";

const InfoPanel = (props) => {
  const [nodes, setNodes] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    fetch("../../data/new_robot_data_2_15.json")
      .then((res) => res.json())
      .then((data) => {
        setNodes(data.nodes);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);

  const anchorButtonClick = (anchorId) => {
    props.anchorSelect(anchorId);
  };

  if (isLoading) return <p>loading...</p>;

  return (
    <div className="col-span-1 infoPanel">
      <h3>Information Panel</h3>
      {!selected ? (
        <p>Select an item on either diagram to get started</p>
      ) : (
        <div>
          <h4>{selected}</h4>
          <p>Here are the items attached to the selected node:</p>
          <ThreadList
            data={nodes}
            selected={selected}
            anchorClick={anchorButtonClick}
          />
        </div>
      )}
    </div>
  );
};

export default InfoPanel;
