import { scaleLinear } from "d3";
import { UserAvatar, HaruAvatar } from "./avatars";


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

function EmotionDisplay({ label, speaker }) {
  let emotion = ":|";
  let color = "#a3e635";
  switch (label) {
    case "anger":
      emotion = ">:(";
      color = "#ff7866"; // Red
      break;
    case "disgust":
      emotion = ">:P";
      color = "#8B4513"; // Brown
      break;
    case "fear":
      emotion = ":{";
      color = "#cdabff"; // Purple
      break;
    case "joy":
      emotion = ":D";
      color = "#57cd57"; // Green
      break;
    case "neutral":
      emotion = ":)";
      color = "#a3e635"; // Lime
      break;
    case "sadness":
      emotion = ":(";
      color = "#63b8ff"; // Blue
      break;
    case "surprise":
      emotion = ":o";
      color = "#FFD700"; // Gold/Yellow
      break;
    default:
      break;
  }
  return (
    <div className="">
   

      <div
        className="profile h-8 w-8 rounded-full  mx-2 text-center"
        style={{ backgroundColor: color }}
      >
        {emotion}
      </div>
    
      
      <div className="mt-2 ml-2">
        {speaker === "Haru" ? (
          <HaruAvatar size={30} />
        ) : (
          <UserAvatar size={30} />
        )}
      </div>
    </div>
  );
}

function MessageDisplay({ speaker, color, message }) {
  return (
    <div
      className={`message rounded-lg p-2`}
      style={{ backgroundColor: `${color}` }}
    >
      <div className={`speaker text-sm font-bold ${speaker}`}>{speaker}</div>
      <div className={`text ${speaker}`}>{message}</div>
    </div>
  );
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
  return (
    <div className="bubbleContainer" id={`response${id}`}>
      {stmt.timestamp ? (
        <div
          className={`timestamp ${speaker} flex justify-center relative mb-2`}
        >
          {stmt.timestamp}
        </div>
      ) : null}
      {speaker === "Haru" ? (
        <div className={`bubble items-start ${speaker}`}>
          <EmotionDisplay label={stmt.emotion_label} speaker={speaker} />
          <MessageDisplay speaker={speaker} color={color} message={stmt.text} />
        </div>
      ) : (
        <div className={`bubble items-start ${speaker}`}>
          <MessageDisplay speaker={speaker} color={color} message={stmt.text} />
          <EmotionDisplay label={stmt.emotion_label} speaker={speaker} />
          {stmt.was_data_collected && stmt.text ? (
            <div className={`flex data-collection`}>
              Response saved
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Bubble;
