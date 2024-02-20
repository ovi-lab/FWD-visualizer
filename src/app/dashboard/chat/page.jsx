"use client";
import React, {useEffect, useRef, useState } from "react";
import "./chatBox.css";
import { scaleLinear } from "d3";
import { useChatAnchor } from "../../contexts/chatContext";

/**
* Separates chat segments by the threadList identified in the conversation
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

export default function Chatbox(props) {
  const [nodes, setNodes] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [threads, setThreads] = useState([]);
  const [statements, setStatements] = useState([]);
  const {chatAnchor} = useChatAnchor();
  let AnchorRef = useRef(null);
  
  useEffect(() => {
    fetch('../../data/new_robot_data_2_20.json')
      .then((res) => res.json())
      .then((data) => {
        setNodes(data.nodes)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const nodeList = nodes
    const threadList = {};
    const statementList = {};
    nodeList.map((entry) => {
      entry.interactions.map((interaction) => {
        const threadId = interaction.index;
        const speaker = interaction.turn;
        if (!threadList[threadId]) {
          threadList[threadId] = [];
        }
        // Change here if data format is modified
        threadList[threadId].push(interaction.idx);
        statementList[interaction.idx] = {
          id: interaction.idx,
          speaker: speaker,
          text: interaction.sentence,
          sentiment_score: interaction.sentiment_score,
          timestamp: interaction.timestamp,
          threadId: threadId,
        };
      });
      
    });
    setThreads(threadList);
    setStatements(Object.values(statementList));
  }, [nodes])
  
  useEffect(() => {
    if (chatAnchor !== AnchorRef) {
      
      const targetElement = document.getElementById(chatAnchor);
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
        AnchorRef.current = chatAnchor
      }
    }
  }, [chatAnchor]);

  if (isLoading) return <p>Loading...</p>
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
              <div key={stmt.id}>
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

