"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import "./chatBox.css";
import { useChatAnchor } from "../../contexts/chatContext";
import Bubble from "./chatBubble";
import { useTime } from "@/app/contexts/timeContext";
import { useFilter } from "@/app/contexts/filterContext";
import {filterData} from "@/app/dashboard/utils/filters"
// import { useSelectedNode } from "@/app/contexts/selectedNodeContext";

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
  const { selectedFilters } = useFilter();
  // const {setSelectedNode} = useSelectedNode();

  const anchorMoveCallback = useCallback(
    (anchorRef) => {
      return function (anchor) {
        if (anchor !== anchorRef.current) {
          const targetElement = document.getElementById(anchor);
          const targetContainer = document.getElementById("chatboxContent");
          const currentElement = document.getElementById(anchorRef.current);

          if (targetElement === null) return;

          if (targetElement && targetContainer) {
            const scrollPosition =
              targetElement.offsetTop -
              (targetContainer.clientHeight - targetElement.clientHeight) / 2;
            targetContainer.scrollTo({
              top: scrollPosition,
              behavior: "smooth",
            });
            if (currentElement !== null) {
              currentElement.style.border = "none";
            }
            targetElement.style.border = "5px solid #a5faee";
            anchorRef.current = anchor;
            setChatAnchor(anchor);
          }
        }
      };
    },
    [setChatAnchor]
  );

  const anchorMove = anchorMoveCallback(AnchorRef);

  useEffect(() => {
    fetch("http://127.0.0.1:6400/api/chatjson", {method:'GET', next: {revalidate:1}})
      .then((res) => res.json())
      .then((data) => {
        setLines(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Scroll to the last line whenever a new last line is added
    if (statements.length > 0) {
      anchorMove(`response${statements.length - 1}`);
    }
  }, [statements, anchorMove]);

  useEffect(() => {
    const statementList = [];
    const filteredLines = filterData(lines, selectedTime, selectedFilters);
    filteredLines.map((interaction, index) => {
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
  }, [lines, selectedTime, selectedFilters]);

  useEffect(() => {
    anchorMove(chatAnchor);
  }, [chatAnchor]);

  if (loading) return <p>Loading...</p>;
  return (
    <div className="flex w-full col-span-2 chatbox-container">
      <div className="chatbox-body overflow-hidden rounded-lg pb-10">
        <div className="flex rounded-lg items-center justify-center bg-cyan-100">
          <h2 className="text-lg font-semibold">Conversation Transcript</h2>
        </div>
        <div
          className="chatbox-content"
          id="chatboxContent"
          style={{ overflowY: "scroll" }}
        >
          {statements.map((stmt) => {
            return (
              <div key={stmt.id}>
                <Bubble stmt={stmt} id={stmt.id} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
