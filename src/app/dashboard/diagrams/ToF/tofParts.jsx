const Topic = ({ nodeTopic, nodeCollected, nodeRequired }) => {
  
  function ListItem(slot) {
    if (slot.name === "")
      
    return (<li key={`${nodeTopic}-${slot.name}`}>{slot.name}: {slot.value}</li>)
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
          <ul>
          {nodeRequired.map((slot) => {
          if (slot.name)
            return (<li key={`${nodeTopic}-${slot.name}`}>{slot.name}: {slot.value}</li>)
        })}
          </ul>
        </div>
      ) : null}
      <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
      {/* Collection row */}
      <div className="flex rounded-lg items-center justify-center bg-green-100 p-2">
        <p className="text-sm">Collects: </p>
        <ul>
        {nodeCollected.map((slot) => {
          if (slot.name)
            return (<li key={`${nodeTopic}-${slot.name}`}>{slot.name}: {slot.value}</li>)
        })}

        </ul>
      </div>
    </div>
  );
};

export { Topic };
