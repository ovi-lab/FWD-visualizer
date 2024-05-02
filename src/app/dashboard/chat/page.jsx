"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import "./chatBox.css";
import { useChatAnchor } from "../../contexts/chatContext";
import Bubble from "./chatBubble";
import { useTime } from "@/app/contexts/timeContext";
import { useFilter } from "@/app/contexts/filterContext";
import { filterData } from "@/app/dashboard/utils/filters";
import { useWebSocket } from "@/app/contexts/webSocketContext";

function checkForCollection(current, previous) {
  if (previous=== undefined) return false;
  return previous.slots.length < current.slots.length;
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
  const socket = useWebSocket();
  const [data, setData] = useState([]);
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

  const handleResponse = useCallback((newData) => {
    setData(newData);
  }, []);

  useEffect(() => {
    if (!socket) return;
    // Listen for data updates from the Flask server
    socket.emit("transcriptRequest");
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("transcript-response", handleResponse);
  });

  useEffect(() => {
    // Scroll to the last line whenever a new last line is added
    if (statements.length > 0) {
      anchorMove(`response${statements.length - 1}`);
    }
  }, [statements, anchorMove]);

  useEffect(() => {
    const filteredLines = filterData(data, selectedTime, selectedFilters);
    setStatements(filteredLines);
  }, [data, selectedTime, selectedFilters]);

  useEffect(() => {
    anchorMove(chatAnchor);
  }, [chatAnchor]);

  if (!data) return <p>Loading...</p>;
  return (
    <div className="h-[80vh] col-span-2 chatbox-container">
      <div className="chatbox-body h-100% overflow-hidden rounded-lg pb-10">
        <div className="flex rounded-lg items-center justify-center bg-cyan-100">
          <h2 className="text-lg font-semibold">Conversation Transcript</h2>
        </div>
        <div className="chatbox-content overflow-y-scroll" id="chatboxContent">
          {statements.map((stmt, index) => {
            return (
              <div key={stmt.idx}>
                <Bubble
                  id={stmt.idx}
                  turn={stmt.turn}
                  sentiLabel={stmt.sentiment_label}
                  sentiScore={stmt.sentiment_score}
                  timestamp={includeTimestamp(stmt, statements[index - 1])}
                  emoLabel={stmt.emotion_label}
                  text={stmt.sentence}
                  wasCollected={checkForCollection(stmt, statements[index - 1])}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
