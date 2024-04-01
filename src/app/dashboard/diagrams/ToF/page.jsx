"use client";
import { useEffect, useState, useCallback } from "react";
import { Topic } from "./tofParts";
import { useTime } from "@/app/contexts/timeContext";
import { useFilter } from "@/app/contexts/filterContext";
import { filterData } from "../../utils/filters";
import { useChatAnchor } from "@/app/contexts/chatContext";
import { useSelectedNode } from "@/app/contexts/selectedNodeContext";
import "./tof-styles.css"
import { useWebSocket } from "@/app/contexts/webSocketContext";


export default function TiersOfFriendship() {
  const socket = useWebSocket()
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const { selectedTime } = useTime();
  const { selectedFilters } = useFilter();
  const { chatAnchor, setChatAnchor } = useChatAnchor();
  const { selectedNode, setSelectedNode } = useSelectedNode();

  const handleResponse = useCallback((newData) => {
    setData(newData);
  }, []);

  useEffect(() => {
    if (!socket) return;
    // Listen for data updates from the Flask server
    socket.emit("transcript-request");
  }, [socket]);
  
  useEffect(() => {
    if (!socket) return;
    socket.on("transcript-response", handleResponse
    );
  });

  const handleSlotClick = (clickedID) => {
    setChatAnchor(`response${clickedID}`);
  };

  const handleTopicClick = (nodeName) => {
    setSelectedNode(nodeName);
  };

  useEffect(() => {
    if (!data) return;
    const filteredLines = filterData(data, selectedTime, selectedFilters);
    const rows = [[], [], [], []];
    filteredLines.map((line) => {
      const lineSlots = line.slots
        .filter(
          (slot) =>
            !(
              slot.name.includes("any") ||
              slot.name.includes("topic_name") ||
              slot.name.includes("agreement_patterns")
            )
        )
        .map((filteredSlot) => ({ slotData: filteredSlot, slotID: line.idx }));
      console.log('line', line)
      const topic_category = line.topic.match(/[A-Za-z]+/)[0];
      if (topic_category === "command" || topic_category === "system") return;

      const tierObject = { topic: line.topic, required: [], collected: [] };
      let placementIndex = 0;
      let alreadyExists = false;
      for (let i = 0; i < 4; i++) {
        for (const existing of rows[i]) {
          if (line.topic === "topic-intro" && lineSlots != undefined) {
            existing.collected = lineSlots;
            // TODO: still fix the index location
          }
          if (existing.topic === tierObject.topic) {
            if (
              existing.collected.length < tierObject.collected.length ||
              existing.collected.length === 0
            ) {
              tierObject.collected.map((slot) => {
                if (!existing.collected.includes(slot))
                  existing.collected.push(slot);
              });
            }
            alreadyExists = true;
            break;
          }

          for (const slot of lineSlots) {
            if (
              existing.collected.find((collected) =>
                collected.slotData.name.includes(slot.slotData.name)
              )
            ) {
              tierObject.required.push(slot);
              placementIndex = i + 1;
            }
          }
        }

        if (alreadyExists) break;

        tierObject.collected = lineSlots.filter(
          (lineSlot) => !tierObject.required.includes(lineSlot)
        );
      }

      if (!alreadyExists) {
        rows[placementIndex < 4 ? placementIndex : 3].push(tierObject);
      }
    });
    setRows(rows);
  }, [data, selectedTime, selectedFilters, setRows]);

  if (!data || !rows) return <div className="flex flex-col h-full">Loading...</div>;

  return (
    <div className="flex flex-col h-full">
      {rows.map(
        (rowNodes, index) =>
          // Only render the row if it has nodes
          rowNodes[index] !== undefined && (
            <div
              key={`${rowNodes[index].topic}`}
              className="flex justify-center topic-wrapper"
            >
              {rowNodes.map((node) => (
                <Topic
                  key={`${rowNodes[index]}-${node.topic}`}
                  nodeTopic={node.topic}
                  nodeCollected={node.collected}
                  nodeRequired={node.required}
                  handleTopicClick={handleTopicClick}
                  handleSlotClick={handleSlotClick}
                />
              ))}
            </div>
          )
      )}
    </div>
  );
}
