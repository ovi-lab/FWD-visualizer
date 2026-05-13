"use client";
import React, { useState, useEffect } from "react";
import { useSelectedNode } from "@/app/contexts/selectedNodeContext";
import { useChatAnchor } from "@/app/contexts/chatContext";
import { useSocketData } from "@/app/contexts/socketDataContext";
import { useFilter } from "@/app/contexts/filterContext";
import { filterData } from "@/app/utils/filters";

const InfoPanel = () => {
  const { diagramData } = useSocketData();
  const { selectedNode } = useSelectedNode();
  const { setChatAnchor } = useChatAnchor();
  const [selectedLine, setSelectedLine] = useState("");

  const anchorButtonClick = (clickedID) => {
    setChatAnchor(`response${clickedID}`);
    setSelectedLine(clickedID);
  };

  if (!diagramData) return <p>Loading...</p>;

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex items-center justify-center bg-cyan-100 rounded-lg">
        <h3 className="text-lg font-semibold">Information Panel</h3>
      </div>
      {!selectedNode ? (
        <p className="p-4">Select an item on the diagram to get started.</p>
      ) : (
        <div>
          <div className="items-center justify-center p-4">
            <h4 className="font-bold">{selectedNode}</h4>
            <p>Items in node:</p>
          </div>
          <ThreadList
            data={diagramData.nodes}
            selected={selectedNode}
            anchorClick={anchorButtonClick}
            selectedLine={selectedLine}
          />
        </div>
      )}
    </div>
  );
};

// InfoButton Component
function InfoButton({ interact, conversationNum, handleClick, isClicked }) {
  const maxLength = 50;
  const response = interact.sentence;
  const id = interact.idx;
  const threadId = interact.index;
  const color = isClicked ? "rgb(204 251 241)" : "rgb(245 245 244)";

  const truncatedResponse =
    response.length > maxLength
      ? response.substring(0, maxLength) + "..."
      : response;

  return (
    <button
      className="hover:shadow-lg text-[#1A1A1A] py-2.5 px-5 text-center inline-block text-base m-0.5 cursor-pointer rounded-[12px]"
      onClick={() => handleClick(id)}
      style={{ backgroundColor: color }}
    >
      <p className="text-xs font-bold">
        Conversation {conversationNum} Response {id}, Thread {threadId} -
      </p>
      <p>{truncatedResponse}</p>
    </button>
  );
}

// ThreadList Component
function ThreadList({ data, selected, anchorClick, selectedLine }) {
  const selectedNode = data.find((node) => node.name.includes(selected));
  const { filters } = useFilter();

  if (!selectedNode) {
    return <p className="p-4">Selected node not found in the data.</p>;
  }

  const itemsArray = [];
  let numConversations = 1;
  filterData(selectedNode.interactions, filters).forEach((interact) => {
    if (interact.lastInteraction === true) {
      numConversations++;
    }
    itemsArray.push([numConversations, interact]);
  });

  const handleListClick = (clickedID) => {
    anchorClick(clickedID);
  };

  return (
    <div className="w-full h-[70vh] border border-gray-300 overflow-scroll p-4 m-auto rounded-lg">
      {itemsArray.length < 1 ? (
        <p>
          The dialog currently does not contain a response that links to this
          node.
        </p>
      ) : (
        <ul>
          {itemsArray.map((interact) => (
            <li key={interact[1].idx}>
              <InfoButton
                interact={interact[1]}
                conversationNum={interact[0]}
                handleClick={handleListClick}
                isClicked={selectedLine === interact[1].idx}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InfoPanel;
