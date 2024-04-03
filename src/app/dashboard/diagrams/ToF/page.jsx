"use client";
import { useEffect, useState, useCallback } from "react";
import { Topic } from "./tofParts";
import { useTime } from "@/app/contexts/timeContext";
import { useFilter } from "@/app/contexts/filterContext";
import { filterData } from "../../utils/filters";
import { useChatAnchor } from "@/app/contexts/chatContext";
import { useSelectedNode } from "@/app/contexts/selectedNodeContext";
import "./tof-styles.css";
import { useWebSocket } from "@/app/contexts/webSocketContext";

export default function TiersOfFriendship() {
  const socket = useWebSocket();
  const [data, setData] = useState([]);
  const [rows, setRows] = useState([]);
  const [longestRowLength, setLongestRowLength] = useState(0);
  const [viewBox, setViewBox] = useState({
    x: 0,
    y: 0,
    width: 800,
    height: 600,
  });
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
    socket.on("transcript-response", handleResponse);
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
    const rows = [[]];
    let rowLength = 0;
    filteredLines.map((line) => {
      const lineSlots = line.slots
        .filter(
          (slot) =>
            !(
              slot.name.includes("error")
              ||
              // slot.name.includes("any") ||
              // slot.name.includes("topic_name") ||
              slot.name.includes("agreement_patterns")
            )
        )
        .map((filteredSlot) => ({ slotData: filteredSlot, slotID: line.idx }));
      const topic_category = line.topic.match(/[A-Za-z]+/)[0];
      if (
        topic_category === "command" ||
        topic_category === "system" ||
        topic_category === "error"
      )
        return;

      const tierObject = { topic: line.topic, required: [], collected: [] };
      let placementIndex = 0;
      let alreadyExists = false;
      for (let i = 0; i < rows.length; i++) {
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
            // rows[placementIndex] > rowLength ? rowLength = rows[placementIndex].length : null
            break;
          }

          for (const slot of lineSlots) {
            if (
              existing.collected.find(
                (collected) =>
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
        placementIndex > rows.length - 1
          ? rows.push([tierObject])
          : rows[placementIndex].push(tierObject);
      }
      rows[placementIndex].length > rowLength
        ? (rowLength = rows[placementIndex].length)
        : null;
    });
    setRows(rows);
    console.log("rowLength", rowLength);
    setLongestRowLength(rowLength);
  }, [data, selectedTime, selectedFilters, setRows]);

  useEffect(() => {
    // Calculate bounding box of the generated content
    if (!data) return;
    const svgContent = document.getElementById("tof-content");
    if (svgContent) {
      const { newX, newY, newWidth, newHeight } = svgContent.getBBox();
      const newViewBox = {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      };
      console.log(newViewBox);
      setViewBox(newViewBox);
    }
  }, [data]);

  if (!data || !rows)
    return <div className="flex flex-col h-full">Loading...</div>;
  const width = viewBox.width*0.8;
  const height = viewBox.height*0.8;
  const smallestSegments = width / longestRowLength;
  const maxNodeWidth = smallestSegments - smallestSegments * 0.125;
  return (
    <svg
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width}  ${viewBox.height}`}
      width={width}
      height={height}
    >
      <g id="" dominantBaseline="middle" textAnchor="middle">
        {rows.map((rowNodes, rowIndex) => {
          if (rowNodes.length === 0) return;
          const rowSegments = height / rows.length;
          const rowHeight = rowSegments * 0.75;
          const yPosition = rowSegments * rowIndex + rowSegments * 0.25;
          return (
            <g key={`row${rowIndex}`}>
              {rowNodes !== undefined &&
                rowNodes.map((node, nodeIndex) => {
                  const nodeSegments = width / rowNodes.length;
                  const xPosition =
                    nodeSegments * nodeIndex +
                    nodeSegments * 0.5 -
                    maxNodeWidth * 0.5;
                  return (
                    <Topic
                      key={`node-${rowIndex}-${nodeIndex}`}
                      nodeTopic={node.topic}
                      nodeCollected={node.collected}
                      nodeRequired={node.required}
                      handleTopicClick={handleTopicClick}
                      handleSlotClick={handleSlotClick}
                      nodeWidth={maxNodeWidth}
                      xPosition={xPosition}
                      rowHeight={rowHeight}
                      yPosition={yPosition}
                    />
                  );
                })}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
