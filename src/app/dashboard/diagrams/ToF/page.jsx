"use client";
import { useEffect, useRef, useState } from "react";
import { Topic } from "./tofParts";
import { useTime } from "@/app/contexts/timeContext";
import { useFilter } from "@/app/contexts/filterContext";
import { filterData } from "../../utils/filters";

function filter(input, time) {
  return input
    .filter((item) => Date.parse(item.timestamp) <= Date.parse(time) && item.turn === 'user')
    .map((d) => ({ ...d }));
}

export default function TiersOfFriendship() {
  const [nodes, setNodes] = useState([]);
  const [rows, setRows] = useState([])
  const { selectedTime } = useTime();
  const { selectedFilters } = useFilter();

useEffect(() => { 
  fetch("http://127.0.0.1:6400/api/diagramjson?" +
  new URLSearchParams({ selection: 'nodes' }),
  { method: "GET" }, {next: {revalidate: 2}})
  .then((res) => res.json())
  .then((nodes) => {
    const userNodes = nodes.filter((node) => node.turn === 'user' ? true : false) 
    setNodes(userNodes); 
  });
}, [])


  useEffect(() => {
    const filteredNodes = filterData(nodes, selectedTime, selectedFilters)
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
  }, [nodes, selectedTime, selectedFilters, setRows])


  if (!nodes || !rows) return <div>Loading...</div>
  
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
