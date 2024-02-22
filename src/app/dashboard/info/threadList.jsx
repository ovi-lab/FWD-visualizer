import { useState } from "react";
import "./infoStyles.css";
import { useTime } from "@/app/contexts/timeContext";

function InfoButton({ interact, conversationNum, handleClick, isClicked }) {
  // Set a maximum length for the response
  const maxLength = 50;
  const response = interact.sentence;
  const id = interact.idx;
  const threadId = interact.index;
  const color = isClicked ? 'rgb(204 251 241)' : 'rgb(245 245 244)'

  // Truncate the response if it exceeds the maximum length
  const truncatedResponse =
    response.length > maxLength
      ? response.substring(0, maxLength) + "..."
      : response;

  return (
    <button
      className={"info-button"}
      onClick={() => handleClick(id)}
      style={{backgroundColor: color}}
    >
      <p style={{ fontSize: "0.75em" }}>
        {" "}
        <b>
          Conversation {conversationNum}
          {" "}
          Response {id}, Thread {threadId} - {" "}
        </b>{" "}
      </p>
      <p>{truncatedResponse}</p>
    </button>
  );
}

export default function ThreadList({ data, selected, anchorClick }) {
  // Find the selected node in the data array
  const selectedNode = data.find((node) => node.name === selected);
  const [clickedButton, setClickedButton] = useState(""); 
  const {selectedTime} = useTime()

  if (!selectedNode) {
    return <p>Selected node not found in the data</p>;
  }

  // Convert the properties of the selected node into an array of key-value pairs
  const itemsArray = [];
  let numConversations = 1;
  selectedNode.interactions.filter(item => Date.parse(item.timestamp) <= Date.parse(selectedTime)).map((interact) => {
    if (interact.lastInteraction === true) {
      numConversations++;
    }

    return itemsArray.unshift([numConversations, interact])
    // return itemsArray.push([numConversations, interact])
  });

  /**
   * handles clicking a response in the threadlist. 
   * This not only sends the anchor to context for scrolling the chatbox component to the selected dialog, 
   * but also ads the id of the selected button to state for changing its color
   * @param {*} responseClicked The response that is clicked in the list
   */
  const handleListClick = (clickedID) => {
    setClickedButton(clickedID)
    anchorClick(`response${clickedID}`);
  };

  return (
    <div className="listContainer">
      {itemsArray.length < 1 ? (
        <p>
          The dialog currently does not contain a response that links to this
          node
        </p>
      ) : (
        <div className="threadList">
          <ul id="listItems">
            {itemsArray.map((interact) => (
              <li key={interact[1].id}>
                <InfoButton interact={interact[1]} conversationNum={interact[0]} handleClick={handleListClick} isClicked={clickedButton === interact[1].idx}/>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
