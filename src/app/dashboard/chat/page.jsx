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

function checkForCollection(current, previous) {
  if (current.Turn === "haru") return false;
  return previous.entity_type_detection;
}

function includeTimestamp(current, previous) {
  if (previous === undefined) return null
  return current.Turn !== previous.Turn ? current.timestamp : null
}

/**
 * Loads the conversation transcript and generates a chatbox component that displays the dialogue as if it were a text messaging conversation
 *
 * @context chatAnchor - Uses the context value created by the infopanel to determine which message to scroll to
 * @context selectedTime - Uses the context value created by the timeline to determine up to what timestamp to filter for
 *
 * @returns A scrollable, updating chat box component for the dialog transcript
 */
export default function Chatbox() {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statements, setStatements] = useState([]);
  const { chatAnchor } = useChatAnchor();
  let AnchorRef = useRef(null);
  const { selectedTime } = useTime();

  useEffect(() => {
    fetch("../../data/raw/log-02-20.json")
      .then((res) => res.json())
      .then((data) => {
        setLines(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const statementList = [];

    lines
      .filter((line) => Date.parse(line.timestamp) <= Date.parse(selectedTime))
      .map((interaction, index) => {
        statementList[interaction.idx] = {
          id: interaction.idx,
          speaker: interaction.Turn,
          text: interaction.Sentence,
          sentiment_label: interaction.sentiment_label,
          sentiment_score: interaction.sentiment_score,
          emotion_label: interaction.emotion_label,
          emotion_score: interaction.emotion_score,
          was_data_collected: checkForCollection(interaction, lines[index + 1]),
          timestamp: includeTimestamp(interaction, lines[index + 1]),
          threadId: interaction.index,
        };
      });
    setStatements(Object.values(statementList));
    anchorMove(`response${statementList.id}`);
  }, [lines, selectedTime]);

  function anchorMove(chatAnchor) {
    if (chatAnchor !== AnchorRef) {
      const targetElement = document.getElementById(chatAnchor);
      const targetContainer = document.getElementById("chatboxContent");
      const currentElement = document.getElementById(AnchorRef.current);

      if (targetElement === null) return;

      if (targetElement && targetContainer) {
        const scrollPosition =
          targetElement.offsetTop -
          (targetContainer.clientHeight - targetElement.clientHeight) / 2;
        targetContainer.scrollTo({ top: scrollPosition, behavior: "smooth" });
        if (AnchorRef.current) {
          currentElement.style.border = "none";
        }
        targetElement.style.border = "5px solid #a5faee";
        AnchorRef.current = chatAnchor;
      }
    }
  }

  useEffect(() => {
    anchorMove(chatAnchor);
  }, [chatAnchor]);

  if (loading) return <p>Loading...</p>;
  return (
    <div className="col-span-2 chatbox-container ">
      <h1>Conversation Transcript</h1>
      <div className="chatbox-body overflow-hidden h-full" >
        <div
          className="chatbox-content h-full"
          id="chatboxContent"
          style={{ overflowY: "scroll" }}
        >
          {statements.map((stmt) => {
            return (
              <div key={stmt.id}>
                {/* <ThreadSeparator stmt={stmt} idx={idx} arr={arr} /> */}
                <Bubble stmt={stmt} id={stmt.id} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
