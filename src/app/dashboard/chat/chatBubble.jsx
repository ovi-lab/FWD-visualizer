import { scaleLinear } from "d3";
import { EmotionDisplay } from "./EmotionDisplay";

function getSentimentColor(label, score) {
  const scales = {
    positive: scaleLinear().domain([0, 1]).range(["white", "#99e699"]),
    negative: scaleLinear().domain([0, 1]).range(["white", "#ff787a"]),
    default: scaleLinear().domain([0, 1]).range(["white", "white"]),
  };

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
      <div className={`speaker text-[1rem] font-bold ${speaker}`}>
        {speaker}
      </div>
      <div className={`text-[1.1rem] ${speaker}`}>{message}</div>
    </div>
  );
}

/**
 * Creates a chat bubble for the current exchange
 * @param {*} stmt The dialog statement to display in this bubble
 * @param id The ID of the exchange displayed
 * @returns
 */
const Bubble = ({
  id,
  turn,
  sentiLabel,
  sentiScore,
  timestamp,
  emoLabel,
  text,
  wasCollected,
}) => {
  const speaker = turn === "haru" ? "Haru" : "User";
  console.log("sentiLabel", sentiLabel);
  const color = getSentimentColor(sentiLabel, sentiScore);
  console.log("color", color);
  return (
    <div className="bubbleContainer">
      {timestamp ? (
        <div
          className={`timestamp ${speaker} flex justify-center relative mb-2`}
        >
          {timestamp}
        </div>
      ) : null}
      {speaker === "Haru" ? (
        <div className={`bubble items-start ${speaker}`}>
          <EmotionDisplay label={emoLabel} speaker={speaker} />
          <MessageDisplay
            id={id}
            speaker={speaker}
            color={color}
            message={text}
          />
        </div>
      ) : (
        <div className={`bubble items-start ${speaker}`}>
          <MessageDisplay
            id={id}
            speaker={speaker}
            color={color}
            message={text}
          />
          <EmotionDisplay label={emoLabel} speaker={speaker} />
        </div>
      )}
      {wasCollected && text ? (
        <div className={`text-right font-bold data-collection`}>
          Response saved
        </div>
      ) : null}
    </div>
  );
};

export default Bubble;
