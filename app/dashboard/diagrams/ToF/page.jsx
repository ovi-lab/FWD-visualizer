"use client";
import { useEffect, useState } from "react";
import { Topic } from "./tofParts";
import { useTime } from "@/app/contexts/timeContext";

function filter(input, time) {
  return input
    .filter((item) => Date.parse(item.timestamp) <= Date.parse(time) && item.turn === 'user')
    .map((d) => ({ ...d }));
}

export default function TiersOfFriendship() {
  const [nodes, setNodes] = useState([]);
  const { selectedTime } = useTime();

  useEffect(() => {
    fetch("../../../data/new_robot_data_2_20.json")
      .then((res) => res.json())
      .then((data) => {
        const filteredNodes = filter(data.nodes, selectedTime);

        setNodes(filteredNodes);
      });
  }, [selectedTime]);

  const rows = [[], [], []]; // Initialize an array to hold nodes for each row

  nodes.forEach((node) => {
    if (node.topic === "topic-intro") {
      rows[0].push(node);
    } else if (node.topic.match(/[A-Za-z]+/)[0] !== 'command') {
      rows[1].push(node);
    }
  });

  return (
    <div className="flex flex-col h-full">
      {rows.map(
        (rowNodes, index) =>
          // Only render the row if it has nodes
          rowNodes[index] !== undefined && (
            <div key={rowNodes[index].name} className="flex justify-center">
              {rowNodes.map((node) => (
                <Topic key={node.topic} nodeTopic={node.topic} />
              ))}
            </div>
          )
      )}
    </div>
  );
}
