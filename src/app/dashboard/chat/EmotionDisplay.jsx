
import { UserAvatar, HaruAvatar } from './avatars';

const emotions = {
  anger: { char: ">:(", color: "#ff7866" },
  disgust: { char: ">:P", color: "#8B4513" },
  fear: { char: ":{", color: "#cdabff" },
  joy: { char: ":D", color: "#57cd57" },
  neutral: { char: ":)", color: "#a3e635" },
  sadness: { char: ":(", color: "#63b8ff" },
  surprise: { char: ":o", color: "#FFD700" },
};

export const EmotionDisplay = ({ label, speaker }) => {
  const { char, color } = emotions[label] || { char: ":|", color: "#a3e635" };
  return (
    <div>
      <div className="profile h-8 w-8 rounded-full mx-2 text-center" style={{ backgroundColor: color }}>
        {char}
      </div>
      <div className="mt-2 ml-2">
        {speaker === "Haru" ? <HaruAvatar size={30} /> : <UserAvatar size={30} />}
      </div>
    </div>
  );
};
