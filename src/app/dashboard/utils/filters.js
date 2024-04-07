
function filterData(data, time, filters, isLink=false) {
  if (isLink) {
    const turnAndTopic = (sourceName) => String(sourceName).split(": ")
    const filteredData = data
      .filter((line) => {
        const turn = turnAndTopic(line.sourceName)[0]
        return (
          filters.turn !== "" ? turn === filters.turn : true
        )
      }
      )
      .filter((line) => {

        const topic = turnAndTopic(line.sourceName)[1]
        
        return (
          filters.topic !== "" ? topic === filters.topic : true
        )
      })
      .filter((line) => Date.parse(line.timestamp) <= Date.parse(time));
  
    return filteredData;
  }
    // Apply filters to the data
    const filteredData = data
      .filter((line) =>
        filters.turn !== "" ? line.turn === filters.turn : true
      )
      .filter((line) =>
        filters.emotion !== ""
          ? line.emotion_label === filters.emotion
          : true
      )
      .filter((line) => 
        filters.sentiment !== ""
          ? line.sentiment_label === filters.sentiment
          : true
      )
      .filter((line) =>
        filters.topic !== ""
          ? line.topic === filters.topic
          : true
      )
      .filter((line) => Date.parse(line.timestamp) <= Date.parse(time));
  
    return filteredData;
}

export { filterData };
