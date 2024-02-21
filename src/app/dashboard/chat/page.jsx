"use client";
import React, { useEffect, useRef, useState } from "react";
import "./chatBox.css";
import { useChatAnchor } from "../../contexts/chatContext";
import Bubble from "./chatBubble";
import { useTime } from "@/app/contexts/timeContext";

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
 * Loads the conversation transcript and generates a chatbox component that displays the dialogue as if it were a text messaging conversation
 * 
 * @context chatAnchor - Uses the context value created by the infopanel to determine which message to scroll to
 * @context selectedTime - Uses the context value created by the timeline to determine up to what timestamp to filter for
 * 
 * @returns A scrollable, updating chat box component for the dialog transcript
 */
export default function Chatbox() {
  const [nodes, setNodes] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [statements, setStatements] = useState([]);
  const { chatAnchor } = useChatAnchor();
  let AnchorRef = useRef(null);
  const { selectedTime } = useTime();

  useEffect(() => {
    fetch("../../data/raw/log-02-20.json")
      .then((res) => res.json())
      .then((data) => {
        setNodes(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const statementList = [];

    nodes
      .filter((node) => Date.parse(node.timestamp) <= Date.parse(selectedTime))
      .map((interaction) => {
        const threadId = interaction.index;
        const speaker = interaction.Turn;
        statementList[interaction.idx] = {
          id: interaction.idx,
          speaker: speaker,
          text: interaction.Sentence,
          sentiment_label: interaction.sentiment_label,
          sentiment_score: interaction.sentiment_score,
          emotion_label: interaction.emotion_label,
          emotion_score: interaction.emotion_score,
          timestamp: interaction.timestamp,
          threadId: threadId,
        };
      });
    setStatements(Object.values(statementList));
    anchorMove(`response${statementList.id}`);
  }, [nodes, selectedTime]);

  function anchorMove(chatAnchor) {
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
        AnchorRef.current = chatAnchor;
      }
    }
  }

  useEffect(() => {
    anchorMove(chatAnchor);
  }, [chatAnchor]);

  if (isLoading) return <p>Loading...</p>;
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
                <Bubble stmt={stmt} id={stmt.id} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
