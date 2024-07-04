
interface DataLine {
  timestamp: string;
  turn: string;
  emotion_label: string;
  sentiment_label: string;
  topic: string;
  sourceName: string;
}

interface Filters {
  turn: string;
  emotion: string;
  sentiment: string;
  topic: string;
  timestamp: string;
}

function filterData(data: DataLine[], filters: Filters, isLink: boolean =false) {
  if (!data) return [];
  return data.filter((line: DataLine) => {

    if (Date.parse(line.timestamp) > Date.parse(filters.timestamp)) return false

    if (isLink && line.sourceName) {
      const [turn, topic] = line.sourceName.split(": ").map(item => item.trim());

      return (
        (filters.turn === "" || turn === filters.turn) &&
        (filters.topic === "" || topic === filters.topic)
      );
    }

    return (
      (filters.turn === "" || line.turn === filters.turn) &&
      (filters.emotion === "" || line.emotion_label === filters.emotion) &&
      (filters.sentiment === "" || line.sentiment_label === filters.sentiment) &&
      (filters.topic === "" || line.topic === filters.topic)
    );
  })
}

export { filterData };
