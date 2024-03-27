"use client";
import { useEffect, useState } from "react";
import { Topic } from "./tofParts";
import { useTime } from "@/app/contexts/timeContext";
import { useFilter } from "@/app/contexts/filterContext";
import { filterData } from "../../utils/filters";
import { io } from "socket.io-client";
import { useChatAnchor } from "@/app/contexts/chatContext";
import { useSelectedNode } from "@/app/contexts/selectedNodeContext";

export default function TiersOfFriendship() {
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const { selectedTime } = useTime();
  const { selectedFilters } = useFilter();
  const { chatAnchor, setChatAnchor } = useChatAnchor();
  const { selectedNode, setSelectedNode } = useSelectedNode();


  useEffect(() => {
    const socket = io(":6400", {
      cors: { origin: "http://127.0.0.1:6400", methods: ["GET", "POST"] },
    });
    // Listen for data updates from the Flask server

    socket.emit("transcript-request");

    socket.on("transcript-response", (newData) => {
      setData(newData);
    });
    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  const anchorButtonClick = (clickedID) => {
    setChatAnchor(`response${clickedID}`);
  };

  useEffect(() => {
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

      const topic_category = line.topic.match(/[A-Za-z]+/)[0];
      if (topic_category === "command" || topic_category === "system") return;
      
      const tierObject = { topic: line.topic, required: [], collected: [] };
      let placementIndex = 0;
      let alreadyExists = false;
      for (let i = 0; i < 4; i++) {
        for (const existing of rows[i]) {
          if (line.topic === "topic-intro" && lineSlots != undefined) {
            console.log('line.topic', line.topic)
            existing.collected = lineSlots
            // TODO: still fix the index location
          }
          if (existing.topic === tierObject.topic) {
            console.log('existing.topic', existing.topic)
            console.log('existing.collected.length', existing.collected.length)
            console.log('tierOtierObject.topic',tierObject.topic)
            console.log('tierOtierObject.collected.length',tierObject.collected.length)
            if (existing.collected.length < tierObject.collected.length || existing.collected.length === 0) {
              console.log('existing.collected.length', existing.collected.length)
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
              console.log('existing', existing)
              tierObject.required.push(slot);
              placementIndex = i + 1;
            }
          }
        }

        if (alreadyExists) break;

        tierObject.collected = lineSlots.filter(
          (lineSlot) => !tierObject.required.includes(lineSlot)
        );
        console.log('tierObject', tierObject)
      }

      if (!alreadyExists) {
        rows[placementIndex < 4 ? placementIndex : 3].push(tierObject);
      }
    });
    setRows(rows);
  }, [data, selectedTime, selectedFilters, setRows]);

  if (!data || !rows) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-full">
      {rows.map(
        (rowNodes, index) =>
          // Only render the row if it has nodes
          rowNodes[index] !== undefined && (
            <div
              key={`${rowNodes[index].topic}`}
              className="flex justify-center"
            >
              {rowNodes.map((node) => (
                <Topic
                  key={`${rowNodes[index]}-${node.topic}`}
                  nodeTopic={node.topic}
                  nodeCollected={node.collected}
                  nodeRequired={node.required}
                  handleClick={anchorButtonClick}
                />
              ))}
            </div>
          )
      )}
    </div>
  );
}
