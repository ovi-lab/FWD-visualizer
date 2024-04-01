const Topic = ({
  nodeTopic,
  nodeCollected,
  nodeRequired,
  handleSlotClick,
  handleTopicClick,
}) => {
  function SlotList({ nodeList, handleClick }) {
    return (
      <g>
        {nodeList.map((slot) => {
          if (slot.slotData.name) {
            return (
              <g
                className="select-none cursor-pointer rounded-lg border-2 border-gray-700 m-1"
                key={`${nodeTopic}-${slot.slotData.name}`}
                onClick={() => handleClick(slot.slotID)}
              >
                <rect
                  width="100"
                  height="30"
                  fill="#ffffff"
                  stroke="#000000"
                  strokeWidth="1"
                />
                <text x="5" y="20" className="font-bold text-gray-700 text-sm">
                  {slot.slotData.name}: {slot.slotData.value}
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

  return (
    <g
      className="rounded-lg bg-gray-100 p-2 shadow-md m-5"
    >
      {/* Title row */}
      <rect
        className="select-none cursor-pointer flex rounded-lg items-center justify-center mb-2 bg-cyan-100 p-2"
        onClick={() => handleTopicClick(nodeTopic)}
        width="100%"
        height="50"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="text-lg font-semibold"
      >
        {nodeTopic}
      </text>

      {/* Required row */}
      {nodeRequired.length > 0 && (
        <g className="flex rounded-lg items-center justify-center bg-red-100 p-2">
          <text className="text-sm">Required: </text>
          <SlotList nodeList={nodeRequired} handleClick={handleSlotClick} />
        </g>
      )}

      <line
        x1="0"
        y1="0"
        x2="100%"
        y2="0"
        className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"
      />

      {/* Collection row */}
      <g className="flex rounded-lg items-center justify-center bg-green-100 p-2">
        <text className="text-sm">Collects: </text>
        <SlotList nodeList={nodeCollected} handleClick={handleSlotClick} />
      </g>
    </g>
  );
};

export { Topic };
