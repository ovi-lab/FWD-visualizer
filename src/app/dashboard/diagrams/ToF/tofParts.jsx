function SlotList({
  title,
  textSize,
  nodeList,
  handleClick,
  nodeWidth,
  elementTop,
}) {
  const rectHeight = textSize * 2;
  let elementPosition = elementTop;
  return (
    <g transform={`translate(0, ${elementTop})`}>
      <text
        className={"font-bold"}
        x={nodeWidth / 2}
        y={elementTop}
        fontSize={textSize}
      >
        {title}
      </text>
      {nodeList.map((slot, index) => {
        if (slot.slotData.name) {
          elementPosition = textSize + elementTop + rectHeight * index;
          const slotText = `${slot.slotData.name}: ${slot.slotData.value}`;
          return (
            <g
              className="select-none cursor-pointer"
              key={`${title}-${index}-${slot.slotData.name}`}
              transform={`translate(${0}, ${elementPosition})`}
              onClick={() => handleClick(slot.slotID)}
            >
              <rect
                width={nodeWidth}
                height={rectHeight}
                x={0}
                fill="#ffffff"
                stroke="#000000"
                strokeWidth="1"
              />
              <text
                x={nodeWidth * 0.5}
                y={textSize}
                className="font-semibold text-gray-700"
                fontSize={textSize}
              >
                {slotText}
              </text>
            </g>
          );
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
  const titleHeight = rowHeight / 6;
  const textSize = Math.min(nodeWidth / 15, rowHeight / 15);
  const rectHeight = textSize * 2;
  const requiredBottom =
    nodeRequired.length > 0
      ? titleHeight + rectHeight * (nodeRequired.length)
      : titleHeight;
  const collectedBottom = requiredBottom + rectHeight * nodeCollected.length;

  const lastElementBottom = (bottom, element) => {
    if (element === "Requires") {
      setBottomPosition(bottom);
    } else {
      setBottomPosition(bottomPosition + bottom);
    }
  };

  return (
    <g
      className="fill-gray-900"
      transform={`translate(${xPosition}, ${yPosition})`}
    >
      <rect
        className="fill-gray-100 "
        width={nodeWidth}
        height={yPosition + collectedBottom}
      />
      {/* Title row */}
      <g
        className="select-none cursor-pointer"
        onClick={() => handleTopicClick(nodeTopic)}
        width={nodeWidth}
        height={titleHeight}
      >
        <rect
          className="fill-cyan-100"
          width={nodeWidth}
          height={titleHeight}
        />
        <text
          className="font-semibold"
          x={nodeWidth * 0.5}
          y={titleHeight * 0.5}
          fontSize={textSize}
        >
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
          elementTop={titleHeight}
        />
      )}

      {/* Group for collected items */}
      <SlotList
        title={"Collects"}
        textSize={textSize}
        nodeList={nodeCollected}
        handleClick={handleSlotClick}
        nodeWidth={nodeWidth}
        elementTop={requiredBottom}
      />
    </g>
  );
};

export { Topic };
