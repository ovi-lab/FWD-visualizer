"use client";
import { useEffect, useState } from "react";
import { Topic } from "./tofParts";
import { useTime } from "@/app/contexts/timeContext";
import { useFilter } from "@/app/contexts/filterContext";
import { filterData } from "../../utils/filters";
import { io } from "socket.io-client";
import { index } from "d3";

function checkExistence(selected, tierRow) {
  let newSlots = [];
  let existsIdx = false;

  for (const tierNode of tierRow) {
    if (tierNode.topic === selected.topic) {
      existsIdx = tierNode.index;
      if (tierNode.slots.length === selected.slots.length) break;
      for (const selectedSlot of selected.slots) {
        let slotExists = tierNode.slots.some(
          (tierSlot) => tierSlot.value === selectedSlot.value
        );
        if (!slotExists) newSlots.push(selectedSlot);
      }
      break;
    }
  }

  return { exists, newSlots };
}

function addToTiers(line, tierRows) {
  const topic_category = line.topic.match(/[A-Za-z]+/)[0];
  if (line.topic === "topic-intro") {
    const { exists, newSlots } = checkExistence(line, tierRows[0]);
    if (!exists) {
      tierRows[0].push();
    } else if (newSlots) {
      tierRows[0][index].slots.push(newSlots);
    }
  } else if (topic_category !== "command" && topic_category !== "system") {
    for (const row of tierRows) tierRows[1].push(line);
  }

  return tierRows;
}

export default function TiersOfFriendship() {
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const { selectedTime } = useTime();
  const { selectedFilters } = useFilter();

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

  useEffect(() => {
    const filteredLines = filterData(data, selectedTime, selectedFilters);
    const rows = [[], [], [], []];
    let pastTierObject = { topic: "", slots: { required: [], collected: [] } };

    filteredLines.map((line) => {
      line.slots = line.slots.filter(
        (slot) =>
          !(
            slot.name.includes("any") ||
            slot.name.includes("topic_name") ||
            slot.name.includes("agreement_patterns")
          )
      );

      const topic_category = line.topic.match(/[A-Za-z]+/)[0];
      if (topic_category === "command" || topic_category === "system") return;

      const tierObject = { topic: line.topic, required: [], collected: [] };
      if (tierObject.topic.includes("topic-intro")) {
        tierObject.collected = line.slots;
        rows[0][0] = tierObject;
        return;
      }

      let placementIndex = 1;
      let alreadyExists = false;
      for (let i = 0; i < 4; i++) {
        if (rows[i].length === 0) continue;
        for (const existing of rows[i]) {
          if (existing.topic.includes(tierObject.topic)) {
            if (existing.collected.length < tierObject.collected.length) {
              existing.collected = tierObject.collected;
            }
            alreadyExists = true;
            break;
          }

          for (const slot of line.slots) {
            if (
              existing.collected.find((collected) =>
                collected.name.includes(slot.name)
              )
            ) {
              tierObject.required.push(slot);
              placementIndex = i + 1;
            }
          }
        }

        if (alreadyExists) break;

        tierObject.collected = line.slots.filter(
          (slot) => !tierObject.required.includes(slot)
        );
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
                />
              ))}
            </div>
          )
      )}
    </div>
  );
}
