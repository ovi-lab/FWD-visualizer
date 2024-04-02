"use client";

import { useState } from "react";

function SlotList({
  title,
  textSize,
  nodeList,
  handleClick,
  transformVal,
  nodeWidth,
  elementTop,
}) {
  return (
    <g transform={`translate(0, ${elementTop})`}>
      <text x={nodeWidth/2} y={elementTop} fontSize={textSize}>
        {title}
      </text>
      {nodeList.map((slot, index) => {
        if (slot.slotData.name) {
          const slotText = `${slot.slotData.name}: ${slot.slotData.value}`;
          const rectWidth = nodeWidth;
          return (
            <g
              className="select-none cursor-pointer"
              key={`${slot.topic}-${slot.slotData.name}`}
              transform={`translate(0, ${elementTop+textSize})`}
              onClick={() => handleClick(slot.slotID)}
            >
              <rect
                width={rectWidth}
                height={textSize * 2}
                x={0}
                fill="#ffffff"
                stroke="#000000"
                strokeWidth="1"
              />
              <text
                x={rectWidth * 0.5}
                y={textSize}
                className="font-bold text-gray-700"
                fontSize={textSize}
              >
                {slotText}
              </text>
            </g>
          );
        } else {
          return null;
        }
      })}
    </g>
  );
}

const Topic = ({
  nodeTopic,
  nodeCollected,
  nodeRequired,
  handleSlotClick,
  handleTopicClick,
  nodeWidth,
  xPosition,
  rowHeight,
  yPosition,
}) => {
  const elementWidth = nodeWidth;
  const titleHeight = rowHeight / 6;
  const textSize = Math.min(nodeWidth / 10, rowHeight / 10);
  const [collectedY, setCollectedY] = useState(0);

  const collectedGrows = () => {};

  return (
    <g
      className="fill-gray-900"
      transform={`translate(${xPosition}, ${yPosition})`}
    >
      <rect
        className="select-none cursor-pointer fill-gray-100 "
        onClick={() => handleTopicClick(nodeTopic)}
        width={elementWidth}
        height={rowHeight}
      />
      {/* Title row */}
      <g
        className="select-none cursor-pointer"
        onClick={() => handleTopicClick(nodeTopic)}
        width={elementWidth}
        height={titleHeight}
      >
        <rect
          className="fill-cyan-100"
          width={elementWidth}
          height={titleHeight}
        />
        <text className="font-semibold" x={elementWidth*0.5} y={titleHeight*0.5} fontSize={textSize}>
          {nodeTopic}
        </text>
      </g>

      {/* Group for required items */}
      {nodeRequired.length > 0 && (
        <SlotList
          title={"Requires"}
          textSize={textSize}
          nodeList={nodeRequired}
          handleClick={handleSlotClick}
          nodeWidth={nodeWidth}
          elementTop={rowHeight/8}
        />
      )}

      {/* Group for collected items */}

      <SlotList
        title={"Collects"}
        textSize={textSize}
        nodeList={nodeCollected}
        handleClick={handleSlotClick}
        transformVal={"translate(0, 180)"}
        nodeWidth={nodeWidth}
        elementTop={rowHeight/4}
      />
    </g>
  );
};

export { Topic };
