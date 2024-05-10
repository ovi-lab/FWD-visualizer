import { scaleLinear } from "d3";
import { EmotionDisplay } from "./EmotionDisplay";

const scales = {
  positive: scaleLinear().domain([0, 1]).range(["white", "#99e699"]),
  negative: scaleLinear().domain([0, 1]).range(["white", "#ff787a"]),
  default: scaleLinear().domain([0, 1]).range(["white", "white"]),
};

function getSentimentColor(label, score) {
  const colorScale = scales[label] || scales.default;
  return colorScale(score);
}

function MessageDisplay({ id, speaker, color, message }) {
  return (
    <div
      id={`response${id}`}
      className={`message rounded-lg p-2`}
      style={{ backgroundColor: `${color}` }}
    >
      <div className={`speaker text-base font-bold ${speaker}`}>
        {speaker}
      </div>
      <div className={`text-base ${speaker}`}>{message}</div>
    </div>
  );
}


// Helper to display the timestamp if available
const TimestampDisplay = ({ timestamp, speaker }) => (
  timestamp && (
    <div className={`timestamp ${speaker} flex justify-center relative mb-2`}>
      {timestamp}
    </div>
  )
);

// Conditional data collection notice
const DataCollectionNotice = ({ wasCollected, text }) => (
  wasCollected && text && (
    <div className={`text-right font-bold data-collection`}>
      Response saved
    </div>
  )
);


/**
 * Renders the bubble content in the order needed depending on speaker
 *
 * @param {speaker} param0.speaker
 * @param {id} param0.id
 * @param {color} param0.color
 * @param {text} param0.text
 * @param {emoLabel} param0.emoLabel
 */
const BubbleContent = ({ speaker, id, color, text, emoLabel }) => (
  <div className={`bubble items-start ${speaker}`}>
    {speaker === "Haru" ? (
      <>
        <EmotionDisplay label={emoLabel} speaker={speaker} />
        <MessageDisplay id={id} speaker={speaker} color={color} message={text} />
      </>
    ) : (
      <>
        <MessageDisplay id={id} speaker={speaker} color={color} message={text} />
        <EmotionDisplay label={emoLabel} speaker={speaker} />
      </>
    )}
  </div>
);

/**
 * Creates a chat bubble for the current exchange
 * @param {*} stmt The dialog statement to display in this bubble
 * @param id The ID of the exchange displayed
 * @returns
 */
const Bubble = ({ id, turn, sentiLabel, sentiScore, timestamp, emoLabel, utterance, wasCollected }) => {
  const speaker = turn === "haru" ? "Haru" : "User";
  const color = getSentimentColor(sentiLabel, sentiScore);
  return (
    <div className="bubbleContainer">
      <TimestampDisplay timestamp={timestamp} speaker={speaker} />
      <BubbleContent
        speaker={speaker}
        id={id}
        color={color}
        text={utterance}
        emoLabel={emoLabel}
      />
      <DataCollectionNotice wasCollected={wasCollected} text={utterance} />
    </div>
  );
};

export default Bubble;
