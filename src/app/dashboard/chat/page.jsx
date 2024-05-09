"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import "./chatBox.css";
import { useChatAnchor } from "@/app/contexts/chatContext";
import Bubble from "./chatBubble";
import { useFilter } from "@/app/contexts/filterContext";


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
  const { chatAnchor, setChatAnchor } = useChatAnchor();
  let AnchorRef = useRef(null);
  const { filteredTranscript} = useFilter();

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
    // Scroll to the last line whenever a new last line is added
    if (filteredTranscript.length > 0) {
      anchorMove(`response${filteredTranscript.length - 1}`);
    }
  }, [filteredTranscript, anchorMove]);

  // useEffect(() => {
  //   if (!transcriptData) return
  //   const filteredLines = filterData(transcriptData, selectedFilters);
  //   setStatements(filteredLines);
  // }, [transcriptData, selectedTime, selectedFilters]);

  useEffect(() => {
    anchorMove(chatAnchor);
  }, [chatAnchor]);

  if (!filteredTranscript) return <p>Loading...</p>;
  return (
    <div className="h-[80vh] col-span-2 chatbox-container">
      <div className="chatbox-body h-100% overflow-hidden rounded-lg pb-10">
        <div className="flex rounded-lg items-center justify-center bg-cyan-100">
          <h2 className="text-lg font-semibold">Conversation Transcript</h2>
        </div>
        <div className="chatbox-content overflow-y-scroll" id="chatboxContent">
          {filteredTranscript.map((stmt, index) => {
            return (
              <div key={stmt.idx}>
                <Bubble
                  id={stmt.idx}
                  turn={stmt.turn}
                  sentiLabel={stmt.sentiment_label}
                  sentiScore={stmt.sentiment_score}
                  timestamp={includeTimestamp(stmt, filteredTranscript[index - 1])}
                  emoLabel={stmt.emotion_label}
                  utterance={stmt.sentence}
                  wasCollected={checkForCollection(stmt, filteredTranscript[index - 1])}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
