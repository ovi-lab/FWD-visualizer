"use client";
import { useEffect, useRef, useState } from "react";
import { Topic } from "./tofParts";
import { useTime } from "@/app/contexts/timeContext";
import { useFilter } from "@/app/contexts/filterContext";
import { filterData } from "../../utils/filters";
import { io } from "socket.io-client";

function checkExistence(selected, tierRow) {
  let alreadyExists = false
  const newSlots = [] 
  for (const tierNode in tierRow) {
    if (tierNode.topic === selected.topic) {
      if (tierNode.slots.length === selected.slots.length)
          break
      for (const nodeSlot in tierNode.slots) {
        
      }

    }
  }
  return newSlots
}

function addToTiers(line, tierRows) {
  
    const topic_category = line.topic.match(/[A-Za-z]+/)[0]
    if (line.topic === "topic-intro") {
      const existingTopic = checkExistence(line, tierRows[0])
      if (!existingTopic) {
        tierRows[0].push()
      }
    } else if (topic_category !== 'command' && topic_category !== 'system') {
      tierRows[1].push(line);
    }
  
  return tierRows
}

export default function TiersOfFriendship() {
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([])
  const { selectedTime } = useTime();
  const { selectedFilters } = useFilter();

  useEffect(() => {
    const socket = io(":6400", {
      cors: { origin: "http://127.0.0.1:6400", methods: ["GET", "POST"] },
    });
    // Listen for data updates from the Flask server
    
      socket.emit('static-linear-request');

    socket.on('static-linear-response', (newData) => {
      setData(newData);
    })
    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);



  useEffect(() => {
    const filteredLines = filterData(data, selectedTime, selectedFilters)
    let newRows = [[], [], []]; // Initialize an array to hold nodes for each row
    filteredLines.map((line) => {
      if (line.turn !== 'user') 
        newRows = addToTiers(line, newRows)
    });
    setRows(newRows)
  }, [data, selectedTime, selectedFilters, setRows])


  if (!data || !rows) return <div>Loading...</div>
  
  return (
    <div className="flex flex-col h-full">
      {rows.map(
        (rowNodes, index) =>
          // Only render the row if it has nodes
          rowNodes[index] !== undefined && (
            <div key={rowNodes[index].name} className="flex justify-center">
              {rowNodes.map((node) => (
                <Topic key={node.topic} nodeTopic={node.topic} nodeSlots={node.slots}/>
              ))}
            </div>
          )
      )}
    </div>
  );
}
