function SlotList({ title, nodeList, handleClick, color }) {
  return (
    <div className={`flex rounded-lg items-center justify-center ${color} p-1`}>
      <p className="text-[0.75em]">{title}</p>
      <ul>
        {nodeList.map((slot, idx) => {
          if (slot.slotData.name)
            return (
              <button
                className="select-none cursor-pointer rounded-lg border-2 border-gray-700 m-1
 py-1 px-2 text-gray-900 text-sm w-full"
                key={`${title}-${slot.slotData.name}-${idx}`}
                onClick={() => handleClick(slot.slotID)}
              >
                {slot.slotData.name}: {slot.slotData.value}
              </button>
            );
        })}
      </ul>
    </div>
  );
}

const Topic = ({
  nodeTopic,
  nodeCollected,
  nodeRequired,
  handleSlotClick,
  handleTopicClick,
}) => {
  return (
    <div className="rounded-lg bg-gray-100 p-1 shadow-md m-3 w-48">
    
      {/* Title row */}
      <button
        className="select-none cursor-pointer flex rounded-lg items-center w-full justify-center mb-2 bg-cyan-100 p-2"
        onClick={() => handleTopicClick(nodeTopic)}
      >
        <h2 className="text-sm font-semibold">{nodeTopic}</h2>
      </button>
      {/* Slot lists */}
      {nodeRequired.length > 0 && (
        <SlotList
          title="R"
          nodeList={nodeRequired}
          handleClick={handleSlotClick}
          color="bg-red-100"
        />
      )}
      {nodeCollected.length > 0 && (
        <SlotList
          title="C"
          nodeList={nodeCollected}
          handleClick={handleSlotClick}
          color="bg-green-100"
        />
      )}
    </div>
  );
};

export { Topic };
