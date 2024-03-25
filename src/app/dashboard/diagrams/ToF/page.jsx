"use client";
import { useEffect, useRef, useState } from "react";
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

    socket.emit("static-linear-request");

    socket.on("static-linear-response", (newData) => {
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
    let pastRowNode = {topic: '', slots: {required: [], collected: []}}

    filteredLines.map((line) => {
      let rowIndex = 0; // Default row index is 0

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
      if (line.topic === "topic-intro") {
        const introObject = rows[0].find(
          (rowObject) => rowObject && rowObject.topic === line.topic
        );
        if (introObject) {
          line.slots.map((slot) => {
            if (
              !introObject.slots.collected.find(
                (existingSlot) => slot.name === existingSlot.name
              )
            )
              introObject.slots.collected.push(slot);
          });
        } else {
          const newRowNode = {topic: line.topic, slots: {required: [], collected: [line.slots]}}
          rows[0].push(newRowNode);
          pastRowNode = newRowNode
        }
      } else {
        // Find the appropriate row index based on slot existence
        for (let i = 1; i < rows.length; i++) {
          const existingObject = rows[i].find(
            (rowObject) => rowObject && rowObject.topic === line.topic
          );
          if (existingObject) {
            line.slots.map((slot) => {
              if (
                !existingObject.slots.collected.find(
                  (existingSlot) => slot.name === existingSlot.name
                )
              )
                existingObject.slots.collected.push(slot);
            });
            rowIndex = i;
            break;
          } else {
            rowIndex++;
            const requiredSlots = []
            const collectedSlots = []
            line.slots.map((slot) => {
              let inPast = false
              pastRowNode.slots.collected.map(pastSlot => {
                console.log(`${slot.name} +++++++++ ${pastSlot.name}`);
                if (slot.name === pastSlot.name) {
                  inPast = true
                requiredSlots.push(slot)
                }
            })
            if (!inPast) {
              console.log('slot', slot)
                collectedSlots.push(slot)

            }
            })
            const newRowNode = {topic: line.topic, slots: {required: requiredSlots, collected: collectedSlots}}
            rows[i].push(newRowNode);
            pastRowNode = newRowNode
          }
        }
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
            <div key={`${rowNodes[index].topic}`} className="flex justify-center">
              {rowNodes.map((node) => (
                <Topic
                  key={`${rowNodes[index]}-${node.topic}`}
                  nodeTopic={node.topic}
                  nodeCollected={node.slots.collected}
                  nodeRequired={node.slots.required}
                />
              ))}
            </div>
          )
      )}
    </div>
  );
}
