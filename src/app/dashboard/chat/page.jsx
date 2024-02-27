"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import "./chatBox.css";
import { useChatAnchor } from "../../contexts/chatContext";
import Bubble from "./chatBubble";
import { useTime } from "@/app/contexts/timeContext";
// import { useSelectedNode } from "@/app/contexts/selectedNodeContext";

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
  if (current.turn === "haru" || previous === undefined) return false;
  return previous.entity_type_detection;
}

function includeTimestamp(current, previous) {
  if (previous === undefined || current.turn === "haru") return null;
  return current.turn !== previous.turn ? current.timestamp : null;
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
  const { chatAnchor, setChatAnchor } = useChatAnchor();
  let AnchorRef = useRef(null);
  const { selectedTime } = useTime();
  // const {setSelectedNode} = useSelectedNode();

  const anchorMoveCallback = useCallback((anchorRef) => {
    return function(anchor) {
      if (anchor !== anchorRef.current) {
        const targetElement = document.getElementById(anchor);
        const targetContainer = document.getElementById("chatboxContent");
        const currentElement = document.getElementById(anchorRef.current);
  
        if (targetElement === null) return;
  
        if (targetElement && targetContainer) {
          const scrollPosition =
            targetElement.offsetTop -
            (targetContainer.clientHeight - targetElement.clientHeight) / 2;
          targetContainer.scrollTo({ top: scrollPosition, behavior: "smooth" });
          if (currentElement !== null) {
            currentElement.style.border = "none";
          }
          targetElement.style.border = "5px solid #a5faee";
          anchorRef.current = anchor;
          setChatAnchor(anchor);
        }
      }
    }
  }, [setChatAnchor]);

  const anchorMove = anchorMoveCallback(AnchorRef);

useEffect(() => {
    fetch("../../data/raw/log-02-20.json")
    .then((res) => res.json())
    .then((data) => {
      const filteredLines = [];
      data
      .filter(
        (line) => Date.parse(line.timestamp) <= Date.parse(selectedTime)
        )
        .map((interaction, index) => {
          filteredLines[index] = interaction;
          });
        setLines(filteredLines);
        setLoading(false);
      });
    }, [selectedTime]);

    useEffect(() => {
      // Scroll to the last line whenever lines change
      if (lines.length > 0) {
        anchorMove(`response${lines.length-1}`);
      }
    }, [lines, anchorMove]);
    

  useEffect(() => {
    const statementList = [];
    let latestIndex = 0;
    lines.map((interaction, index) => {
      if (index === 0) latestIndex = interaction.idx;
      statementList[interaction.idx] = {
        id: interaction.idx,
        speaker: interaction.turn,
        text: interaction.sentence,
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
  }, [lines]);

  useEffect(() => {
    anchorMove(chatAnchor);
  }, [chatAnchor]);

  if (loading) return <p>Loading...</p>;
  return (
    <div className="col-span-2 chatbox-container ">
      <h1>Conversation Transcript</h1>
      <div className="chatbox-body overflow-hidden h-full">
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
