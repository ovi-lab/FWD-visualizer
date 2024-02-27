import { scaleLinear } from "d3";

function sentimentColor(label, score) {
  let colorScale;
  switch (label) {
    case "positive":
      colorScale = scaleLinear().domain([0, 1]).range(["white", "#99e699"]);
      break;
    case "negative":
      colorScale = scaleLinear().domain([0, 1]).range(["white", "#ff787a"]);
      break;

    default:
      colorScale = scaleLinear().domain([0, 1]).range(["white", "white"]);
      break;
  }

  return colorScale(score);
}

function emotionDisplay(label) {
  let emotion = ":|";
  switch (label) {
    case "anger":
      emotion = ">:(";
      break;
    case "disgust":
      emotion = ">:P";
      break;
    case "fear":
      emotion = ":{";
      break;
    case "joy":
      emotion = ":D";
      break;
    case "neutral":
      emotion = ":)";
      break;
    case "sadness":
      emotion = ":(";
      break;
    case "surprise":
      emotion = ":o";
      break;
    default:
      break;
  }
  return emotion;
}

/**
 * Creates a chat bubble for the current exchange
 * @param {*} stmt The dialog statement to display in this bubble
 * @param id The ID of the exchange displayed
 * @returns
 */
const Bubble = ({ stmt, id }) => {
  const speaker = stmt.speaker === "haru" ? "Haru" : "User";
  const color = sentimentColor(stmt.sentiment_label, stmt.sentiment_score);
  console.log('stmt', stmt)
  return (
    <div className="bubbleContainer" id={`response${id}`}>
      {stmt.timestamp ? (
        <div className={`timestamp ${speaker} flex justify-center relative`}>
          {stmt.timestamp}
        </div>
      ) : null}
      <div className={`bubble flex items-start ${speaker}`}>
        {speaker === "Haru" ? (
          <div className="profile h-8 w-8 rounded-full bg-lime-400 mr-2 text-center">
            {emotionDisplay(stmt.emotion_label)}
          </div>
        ) : null}

        <div
          className={`message rounded-lg p-2`}
          style={{ backgroundColor: `${color}` }}
        >
          <div className={`speaker text-sm font-bold ${speaker}`}>
            {speaker}
          </div>
          <div className={`text ${speaker}`}>{stmt.text}</div>
        </div>

        {speaker !== "Haru" ? (
          <div className="profile h-8 w-8 rounded-full bg-cyan-200 ml-2 text-center">
            {emotionDisplay(stmt.emotion_label)}
          </div>
        ) : null}
      </div>
      {stmt.was_data_collected && stmt.text ? (
        <div className={`data-collection flex justify-end`}>
          Response saved
        </div>
      ) : null}
    </div>
  );
};

export default Bubble;
