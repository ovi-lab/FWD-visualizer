const Topic = ({ nodeTopic, nodeCollected, nodeRequired, handleClick }) => {
  function SlotList({ nodeList, handleClick }) {
    return (
      <ul>
        {nodeList.map((slot) => {
          if (slot.slotData.name)
            return (
              <li
                className="select-none cursor-pointer rounded-lg border-2 border-gray-700 m-1
   py-1 px-2 font-bold text-gray-700 text-sm"
                key={`${nodeTopic}-${slot.slotData.name}`}
                onClick={() => handleClick(slot.slotID)}
              >
                {slot.slotData.name}: {slot.slotData.value}
              </li>
            );
        })}
      </ul>
    );
  }

  return (
    <div className="rounded-lg bg-gray-100 p-2 shadow-md m-5">
      {/* Title row */}
      <div className="flex rounded-lg items-center justify-center mb-2 bg-cyan-100 p-2">
        <h2 className="text-lg font-semibold">{nodeTopic}</h2>
      </div>

      {/* Required row */}
      {nodeRequired.length > 0 ? (
        <div className="flex rounded-lg items-center justify-center bg-red-100 p-2">
          <p className="text-sm">Required: </p>
          <SlotList nodeList={nodeRequired} handleClick={handleClick} />
        </div>
      ) : null}
      <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
      {/* Collection row */}
      <div className="flex rounded-lg items-center justify-center bg-green-100 p-2">
        <p className="text-sm">Collects: </p>
        <SlotList nodeList={nodeCollected} handleClick={handleClick} />
      </div>
    </div>
  );
};

export { Topic };
