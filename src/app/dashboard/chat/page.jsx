"use client";
import React, {useContext, useEffect, useRef, useState } from "react";
import "./chatBox.css";
import { scaleLinear } from "d3";
import { DataContext } from "../page";;
/**
* Separates chat segments by the threads identified in the conversation
* @param stmt The current statement to check for new thread
* @returns Thread ID Separator JSX component
**/
const ThreadSeparator = ({ stmt, idx, arr }) => {
  if (idx === 0 || stmt.threadId !== arr[idx - 1].threadId) {
    return (
      <div>
        <hr
          id={`thread${stmt.threadId}`}
          style={{
            width: "100%",
            border: "1px solid #000", // You can customize the line style
            margin: 0,
          }}
        />
        <p>{`Thread ${stmt.threadId}`}</p>
      </div>
    );
  } else {
    return;
  }
};
/**
 * Creates a chat bubble for the current exchange
 * @param {*} stmt The dialog statement to display in this bubble
 * @param id The ID of the exchange displayed
 * @returns 
 */
const Bubble = ({stmt, id}) => {
  const speaker = stmt.speaker === "haru" ? "Haru" : "User";
  const color = scaleLinear()
    .domain([-1, 0, 1])
    .range(["#dc3723", "white", "#99e699"]);

  return (
    <div className="bubbleContainer" id={`response${id}`}>
      {" "}
      <div className={`timestamp ${speaker}`}>{stmt.timestamp}</div>
      <div className={`bubble ${speaker}`}>
        <div
          className={`message`}
          style={{ backgroundColor: `${color(stmt.sentiment_score)}` }}
        >
          <div className={`speaker ${speaker}`}>{speaker}</div>
          <div className={`text ${speaker}`}>{stmt.text}</div>
        </div>
      </div>
    </div>
  );
};

const Chatbox = (props) => {
  const [threads, setThreads] = useState([]);
  const [statements, setExchanges] = useState([]);
  const [chatAnchor, setChatAnchor] = useState(null);
  let AnchorRef = useRef(null);
  const data = useContext(DataContext);
  console.log(data)

  useEffect(() => {
    //const data = props.data;
    const threads = {};
    const statements = {};
    data.nodes.forEach((entry) => {
      entry.interactions.forEach((interaction) => {
        const threadId = interaction.index;
        const speaker = interaction.turn;
        if (!threads[threadId]) {
          threads[threadId] = [];
        }
        // Change here if data format is modified
        threads[threadId].push(interaction.idx);
        statements[interaction.idx] = {
          id: interaction.idx,
          speaker: speaker,
          text: interaction.sentence,
          sentiment_score: interaction.sentiment_score,
          timestamp: interaction.timestamp,
          threadId: threadId,
        };
      });
    });

    setThreads(threads);
    setExchanges(Object.values(statements));
  }, [props.data]);

  useEffect(() => {
    if (props.chatAnchor !== AnchorRef) {
      
      const targetElement = document.getElementById(props.chatAnchor);
      const targetContainer = document.getElementById("chatboxContent");

      if (targetElement && targetContainer) {
        const scrollPosition =
          targetElement.offsetTop -
          (targetContainer.clientHeight - targetElement.clientHeight) / 2;
        targetContainer.scrollTo({ top: scrollPosition, behavior: "smooth" });
        if (AnchorRef.current) {
          document.getElementById(AnchorRef.current).style.border = "none";
        }
        targetElement.style.border = "5px solid #a5faee";
        AnchorRef.current = props.chatAnchor
      }
    }
  }, [props.chatAnchor, chatAnchor, AnchorRef]);

  return (
    <div className="col-span-2 chatbox-container">
      <h1>Conversation Transcript</h1>
      <div className="chatbox-body" style={{ overflow: "hidden" }}>
        <div
          className="chatbox-content"
          id="chatboxContent"
          style={{ overflowY: "scroll" }}
        >
          {statements.map((stmt, idx, arr) => {
            return (
              <div key={idx}>
                <ThreadSeparator stmt={stmt} idx={idx} arr={arr} />
                <Bubble
                  stmt={stmt}
                  id={stmt.id}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
