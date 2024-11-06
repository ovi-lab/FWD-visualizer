"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import "./chatBox.css";
import { useChatAnchor } from "@/app/contexts/chatContext";
import Bubble from "./chatBubble";
import { useFilter } from "@/app/contexts/filterContext";
import { useVisibleDivs } from '../../contexts/VisibleTranscriptContext';
import { useSelectedNode } from "@/app/contexts/selectedNodeContext";



function checkForCollection(current, previous) {
  if (previous === undefined) return false;
  return previous.slots.length < current.slots.length;
}

function includeTimestamp(current, previous) {
  if (previous === undefined || current.turn === "robot") return null;
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

  const {selectedNode} = useSelectedNode();
  console.log("selectedNode: " + selectedNode);

  /* TODO: I'd like to pass visibleDivs from page.jsx to Bubbles.tsx using useContext. can you create context file? */
  // Keep track of visible divs
  const {setVisibleDivs } = useVisibleDivs();

  const { filteredTranscript } = useFilter();  
  
  const { chatAnchor, setChatAnchor } = useChatAnchor();
  let AnchorRef = useRef(null);
  
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
            // targetElement.style.border = "5px solid #a5faee";
            anchorRef.current = anchor;
            setChatAnchor(anchor);
            
          }
        }
      };
    },
    [setChatAnchor]
  );
  
  const anchorMove = anchorMoveCallback(AnchorRef);

  // Effect to scroll to the last line whenever a new last line is added
  useEffect(() => {
    if (filteredTranscript.length > 0) {
      anchorMove(`response${filteredTranscript.length - 1}`);
    }
  }, [filteredTranscript, anchorMove]);
  useEffect(() => {
    anchorMove(chatAnchor);
  }, [selectedNode, filteredTranscript, anchorMove, chatAnchor]);

  // Effect to scroll to the matching topic when clickedBubble changes
  useEffect(() => {
    if (selectedNode) {
      // Find the statements that match the clickedBubble
      const matchingStatements = filteredTranscript.filter(
        (stmt) => stmt.topic === selectedNode
      );
      // Find the statement with the minimum index
      const minIndexStmt = matchingStatements.reduce((minStmt, currentStmt) => {
        return currentStmt.idx < minStmt.idx ? currentStmt : minStmt;
      }, matchingStatements[0]);

      if (minIndexStmt) {
        const anchorId = `${minIndexStmt.topic}-${minIndexStmt.idx}-${filteredTranscript.indexOf(minIndexStmt)}`;
        anchorMove(anchorId);
        console.log("scroll to: "+anchorId);
      }
    }
  }, [selectedNode, filteredTranscript, anchorMove, chatAnchor]);

  // Effect to keep track of visible chatboxes wtihin chatcontainer 
  useEffect(() => {
    const chatboxElement = document.getElementById("chatboxContent");
    /* 
      Create Observer
      const observer = new IntersectionObserver((entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting).map(entry => entry.id)
      }, {
        root: document.getElementById("container"),
        threshold: 1.0(for the entire entry) or 0.5(for the partial entry)
      }); 
    */
    const observer = new IntersectionObserver((entries) => {
      const visibleIds = entries // All observed elements
        .filter(entry => entry.isIntersecting) // Only keep entries that are visible
        .map(entry => entry.target.id); // Extract the IDs of visible divs
  
      setVisibleDivs(visibleIds); // Update the state with the visible div IDs
    }, {
      root: chatboxElement, // The scrollable area to observe
      threshold: 1.0 // Trigger when the entire element is visible (1: entire, 0.5: half)
    });
  
    // Observe - Find visible divIds and their elements and observe them
    filteredTranscript.forEach((stmt, index) => {
      const divId = `${stmt.topic}-${stmt.idx}-${index}`;
      const divElement = document.getElementById(divId);
      if (divElement) {
        observer.observe(divElement); // Start observing the div
      }
    });

    // Unobserve - Find visible divIds and their elements and unobserve them
    return () => {
      filteredTranscript.forEach((stmt, index) => {
        const divId = `${stmt.topic}-${stmt.idx}-${index}`;
        const divElement = document.getElementById(divId);
        if (divElement) {
          observer.unobserve(divElement); // Stop observing the div
        }
      });
    };
  }, [anchorMove]); 

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
              <div id={`${stmt.topic}-${stmt.idx}-${index}`} key={`${stmt.topic}-${stmt.idx}-${index}`}>
                <Bubble 
                  id = {stmt.id} 
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
