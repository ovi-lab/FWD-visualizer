import { useState } from "react";
import "./infoStyles.css";

function InfoButton({ interact, handleClick }) {
  // Set a maximum length for the response
  const maxLength = 50;
  const response = interact.response;
  const id = interact.id;
  const threadId = interact.thread_id

  // Truncate the response if it exceeds the maximum length
  const truncatedResponse =
    response.length > maxLength
      ? response.substring(0, maxLength) + "..."
      : response;


  return (
    <button className="info-button" onClick={() => handleClick(`response${id}`)}>
      <p style={{fontSize: "0.75em"}}> <b> Response {id}, Thread {threadId} - </b> </p>
      <p>{truncatedResponse}</p>
    </button>
  );
}

function ThreadList({ data, selected, anchorClick }) {
  // Find the selected node in the data array
  const selectedNode = data.nodes.find((node) => node.name === selected);

  if (!selectedNode) {
    return <p>Selected node not found in the data</p>;
  }

  // Convert the properties of the selected node into an array of key-value pairs
  const itemsArray = [];
  selectedNode.interactions.map((interact) => itemsArray.push(interact));

  const handleClick = (anchorId) => {
    anchorClick(anchorId);
  };

  return (
    <div className="flex flex-col h-screen listContainer">
      {itemsArray.length < 1 ? (
        <p>The dialog currently does not contain a response that links to this node</p>
      ) : (
        <div className="flex flex-col threadList">
          <ul id="listItems">
            {itemsArray.map((interact) => (
              <li key={interact.id}>
                <InfoButton interact={interact} handleClick={handleClick}/>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ThreadList;
