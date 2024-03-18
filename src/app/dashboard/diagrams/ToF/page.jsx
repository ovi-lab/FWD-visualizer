"use client";
import { useEffect, useRef, useState } from "react";
import { Topic } from "./tofParts";
import { useTime } from "@/app/contexts/timeContext";
import { useFilter } from "@/app/contexts/filterContext";
import { filterData } from "../../utils/filters";
import { io } from "socket.io-client";

function filter(input, time) {
  return input
    .filter((item) => Date.parse(item.timestamp) <= Date.parse(time) && item.turn === 'user')
    .map((d) => ({ ...d }));
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
    socket.on('connect', () => {
      socket.emit('static-diagram-request', 'nodes');
    })
    socket.on('static-diagram-response-nodes', (newData) => {
      setData(newData);
    })

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);



  useEffect(() => {
    const filteredNodes = filterData(data, selectedTime, selectedFilters)
    const newRows = [[], [], []]; // Initialize an array to hold nodes for each row
    filteredNodes.map((node) => {
      const topic_category = node.topic.match(/[A-Za-z]+/)[0]
      if (node.topic === "topic-intro") {
        newRows[0].push(node);
      } else if (topic_category !== 'command' && topic_category !== 'system') {
        newRows[1].push(node);
      }
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
