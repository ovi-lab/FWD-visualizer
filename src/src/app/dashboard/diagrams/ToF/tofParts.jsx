const Topic = ({
  nodeTopic,
  nodeCollected,
  nodeRequired,
  handleSlotClick,
  handleTopicClick,
}) => {
  function SlotList({ title, nodeList, handleClick, color }) {
    return (
      <div
        className={`flex rounded-lg items-center justify-center ${color} p-1`}
      >
        <p className="text-[0.75em]">{title}</p>
        <ul>
          {nodeList.map((slot, idx) => {
            if (slot.slotData.name)
              return (
                <li
                  className="select-none cursor-pointer rounded-lg border-2 border-gray-700 m-1
   py-1 px-2 text-gray-900 text-[0.75em]"
                  key={`${nodeTopic}-${slot.slotData.name}-${idx}`}
                  onClick={() => handleClick(slot.slotID)}
                >
                  {slot.slotData.name}: {slot.slotData.value}
                </li>
              );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-gray-100 p-1 shadow-md m-3 w-[200px]">
      {/* Title row */}
      <div
        className="select-none cursor-pointer flex rounded-lg items-center justify-center mb-2 bg-cyan-100 p-2"
        onClick={() => handleTopicClick(nodeTopic)}
      >
        <h2 className="text-sm font-semibold">{nodeTopic}</h2>
      </div>

      {/* Required row */}
      {nodeRequired.length > 0 ? (
        <SlotList
          title={"R"}
          nodeList={nodeRequired}
          handleClick={handleSlotClick}
          color={"bg-red-100"}
        />
      ) : null}
      {/* Collection row */}
      <SlotList
        title={"C"}
        nodeList={nodeCollected}
        handleClick={handleSlotClick}
        color={"bg-green-100"}
      />
    </div>
  );
};

function SlotListSVG({
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
              key={`${title}-${index}-${slot.slotData}`}
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

const TopicSVG = ({
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
      ? titleHeight + rectHeight * nodeRequired.length
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
        <SlotListSVG
          title={"Requires"}
          textSize={textSize}
          nodeList={nodeRequired}
          handleClick={handleSlotClick}
          nodeWidth={nodeWidth}
          elementTop={titleHeight}
        />
      )}

      {/* Group for collected items */}
      <SlotListSVG
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
