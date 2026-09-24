"use client";
import React, { useState } from "react";

import {
  Anger,
  Disgust,
  Fear,
  Joy,
  Neutral,
  Sadness,
  Surprise,
  Anger_User,
  Disgust_User,
  Fear_User,
  Joy_User,
  Neutral_User,
  Sadness_User,
  Surprise_User,
  Flag,
} from "@/app/components/svgs";
import { useVisibleDivs } from "../../../contexts/VisibleTranscriptContext";
import { useSelectedColour } from "../../../contexts/SelectedColourContext";
import { useDarkMode } from "../../../contexts/DarkModeContext";
import { useSelectedNode } from "@/app/contexts/selectedNodeContext";
import { useSelectedBackgroundColour } from "@/app/contexts/SelectedBackgroundColourContext";

interface TopicMap {
  frequency: number;
  analysis: Interaction[];
  ids: number[];
}

interface Interaction {
  turn: string;
  emotion_label: string;
  emotion_score: number;
  sentiment_score: number;
}

interface LinksMap {
  robot: Map<number, number[]>;
  user: Map<number, number[]>;
}

interface BubbleProps {
  topicMap: Map<string, TopicMap>;
  linksMap: LinksMap;
}

const Bubbles: React.FC<BubbleProps> = ({ topicMap, linksMap }) => {
  const { selectedColour } = useSelectedColour();
  const colors =
    Array.isArray(selectedColour) && selectedColour.length > 0
      ? selectedColour
      : [
          "#8CD0C7",
          "#F4EC90",
          "#BDBBD9",
          "#FE7F70",
          "#81B1D1",
          "#FEB363",
          "#B2DD6A",
          "#FDCDE4",
          "#D7D8D9",
          "#C181BD",
          "#CBEAC7",
        ];
  const { darkMode } = useDarkMode();
  const { setSelectedNode } = useSelectedNode();
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);
  const { visibleDivs } = useVisibleDivs();

  const visibleTopics = Array.from(
    new Set(visibleDivs.map((divId) => divId.split("-")[0]))
  );

  const topicArray = Array.from(topicMap.entries());
  const totalTopicNum = topicArray.length;

  const linkRobotArray = Array.from(linksMap.robot.entries());
  const linkUserArray = Array.from(linksMap.user.entries());

  const userRadius = 275;
  const topicRadius = 175;
  const robotRadius = 85;
  const userScaleFactor = 16;

  const angleSlice = (2 * Math.PI) / totalTopicNum;
  const startingAngle = -Math.PI / 2;
  const startingPosition = 300;

  const maxFrequency = Math.max(...topicArray.map(([, data]) => data.frequency));

  const getEmotionSVG = (bubble: string, emotion: string, size: number) => {
    const svgProps = {
      width: bubble === "user" ? 25 : size,
      height: bubble === "user" ? 25 : size,
      filter: "url(#drop-shadow)",
    };
    switch (emotion) {
      case "joy":
        return bubble === "robot" ? <Joy {...svgProps} /> : <Joy_User {...svgProps} />;
      case "sadness":
        return bubble === "robot" ? <Sadness {...svgProps} /> : <Sadness_User {...svgProps} />;
      case "anger":
        return bubble === "robot" ? <Anger {...svgProps} /> : <Anger_User {...svgProps} />;
      case "fear":
        return bubble === "robot" ? <Fear {...svgProps} /> : <Fear_User {...svgProps} />;
      case "disgust":
        return bubble === "robot" ? <Disgust {...svgProps} /> : <Disgust_User {...svgProps} />;
      case "neutral":
        return bubble === "robot" ? <Neutral {...svgProps} /> : <Neutral_User {...svgProps} />;
      case "surprise":
        return bubble === "robot" ? <Surprise {...svgProps} /> : <Surprise_User {...svgProps} />;
      default:
        return null;
    }
  };

  const topicIdToNameMap = topicArray.reduce((idToNameMap, [name, { ids }]) => {
    ids.forEach((id) => {
      idToNameMap.set(id, name);
    });
    return idToNameMap;
  }, new Map<number, string>());

  const robotLinks = linkRobotArray.flatMap(([sourceId, targetIds]) =>
    targetIds.map((targetId) => ({ sourceId, targetId }))
  );
  const userLinks = linkUserArray.flatMap(([sourceId, targetIds]) =>
    targetIds.map((targetId) => ({ sourceId, targetId }))
  );

  const getTopicName = (link: { sourceId: number; targetId: number }) => {
    let sourceTopicName: string | number | undefined = undefined;
    let targetTopicName: string | number | undefined = undefined;
    topicIdToNameMap.forEach((key, value) => {
      if (value == link.sourceId) {
        sourceTopicName = key;
      } else if (value == link.targetId) {
        targetTopicName = key;
      }
    });
    return { sourceTopicName, targetTopicName };
  };

  const uniqueTopicNameArray = Array.from(topicMap.keys());

  const getReIndex = (sourceTopicName: string, targetTopicName: string) => {
    const sourceIndex = uniqueTopicNameArray.indexOf(String(sourceTopicName));
    const targetIndex = uniqueTopicNameArray.indexOf(String(targetTopicName));
    return { sourceIndex, targetIndex };
  };

  const prepareConfiguration = (
    radius: number,
    sourceIndex: number,
    targetIndex: number
  ) => {
    let sourceAngle = startingAngle + sourceIndex * angleSlice;
    let targetAngle = startingAngle + targetIndex * angleSlice;

    /* For Pilot Study With Sport Conversation */
    if (sourceIndex === 1 && targetIndex == 3) {
      targetAngle -= 0.15;
    } else if (sourceIndex === 1 && targetIndex == 2) {
      targetAngle -= 0.15;
    } else if (sourceIndex === 5 && targetIndex == 6) {
      targetAngle -= 0.15;
    } else if (sourceIndex === 5 && targetIndex == 7) {
      targetAngle -= 0.15;
    } else if (sourceIndex === 3 && targetIndex == 1) {
      targetAngle += 0.05;
    } else if (sourceIndex === 1 && targetIndex == 5) {
      targetAngle += 0.08;
    }
    /* For Pilot Study With Sport Conversation */

    const sourceX = startingPosition + radius * Math.cos(sourceAngle);
    const sourceY = startingPosition + radius * Math.sin(sourceAngle);
    const targetX = startingPosition + topicRadius * Math.cos(targetAngle);
    const targetY = startingPosition + topicRadius * Math.sin(targetAngle);

    return { sourceX, sourceY, targetX, targetY };
  };

  const renderLinkLines = (
    links: { sourceId: any; targetId: any }[],
    transRadius: number,
    addRaidus: number,
    normalRaidus: number
  ) => {
    return (
      <>
        {links.map((link: { sourceId: any; targetId: any }) => {
          const topicNames = getTopicName(link);
          const sourceTopicName = String(topicNames.sourceTopicName);
          const targetTopicName = String(topicNames.targetTopicName);

          const reIndexes = getReIndex(sourceTopicName, targetTopicName);
          const sourceIndex = reIndexes.sourceIndex;
          const targetIndex = reIndexes.targetIndex;

          let configuration_add = null;
          let configuration_trans = null;

          if (sourceTopicName !== targetTopicName) {
            configuration_trans = prepareConfiguration(transRadius, sourceIndex, targetIndex);
            configuration_add = prepareConfiguration(addRaidus, sourceIndex, sourceIndex);
          } else {
            configuration_trans = prepareConfiguration(normalRaidus, sourceIndex, targetIndex);
          }

          return (
            <React.Fragment key={`${link.sourceId}-${link.targetId}`}>
              <line
                x1={configuration_trans.sourceX}
                y1={configuration_trans.sourceY}
                x2={configuration_trans.targetX}
                y2={configuration_trans.targetY}
                stroke={colors[sourceIndex % colors.length]}
                strokeWidth={6}
                opacity={hoveredBubble ? (sourceTopicName === hoveredBubble ? 1 : 0.2) : 1}
                style={{
                  transition: "opacity 0.4s ease-out",
                  strokeDasharray: link.targetId - link.sourceId < -1 ? "5, 5" : "none",
                }}
              />
              {configuration_add && (
                <line
                  x1={configuration_add.sourceX}
                  y1={configuration_add.sourceY}
                  x2={configuration_add.targetX}
                  y2={configuration_add.targetY}
                  stroke={colors[sourceIndex % colors.length]}
                  strokeWidth={6}
                  opacity={hoveredBubble ? (sourceTopicName === hoveredBubble ? 1 : 0.2) : 1}
                  style={{
                    transition: "opacity 0.4s ease-out",
                    strokeDasharray: link.targetId - link.sourceId < -1 ? "5, 5" : "none",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </>
    );
  };

  const renderCircles = (
    cx: number,
    cy: number,
    r: number,
    color: string,
    opacity: number,
    topic: string
  ) => {
    function lightenColor(hexColor: string, percent: number) {
      let r = parseInt(hexColor.slice(1, 3), 16);
      let g = parseInt(hexColor.slice(3, 5), 16);
      let b = parseInt(hexColor.slice(5, 7), 16);
      r = Math.min(255, Math.floor(r + (255 - r) * percent));
      g = Math.min(255, Math.floor(g + (255 - g) * percent));
      b = Math.min(255, Math.floor(b + (255 - b) * percent));
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }

    function darkenColor(hexColor: string, percent: number) {
      let r = parseInt(hexColor.slice(1, 3), 16);
      let g = parseInt(hexColor.slice(3, 5), 16);
      let b = parseInt(hexColor.slice(5, 7), 16);
      r = Math.max(0, Math.floor(r - r * percent));
      g = Math.max(0, Math.floor(g - g * percent));
      b = Math.max(0, Math.floor(b - b * percent));
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }

    return (
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        opacity={opacity}
        stroke={
          visibleTopics.includes(topic)
            ? darkMode
              ? lightenColor(color, 0.4)
              : darkenColor(color, 0.05)
            : "none"
        }
        strokeWidth={visibleTopics.includes(topic) ? 4 : 0}
        filter={visibleTopics.includes(topic) ? "url(#glow)" : "url(#drop-shadow)"}
        style={{ transition: "opacity 0.4s ease-out", cursor: "pointer" }}
        onMouseEnter={() => setHoveredBubble(topic)}
        onMouseLeave={() => setHoveredBubble(null)}
        onClick={() => setSelectedNode(topic)}
      />
    );
  };

  const getTextWidth = (text: string, fontSize: number) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
      context.font = `${fontSize}px Arial`;
      return context.measureText(text).width;
    }
    return 0;
  };

  const wrapText = (text: string, fontSize: number, availableWidth: number) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (getTextWidth(testLine, fontSize) <= availableWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  const calculateFontSize = (circleRadius: number, text: string, padding = 8) => {
    const availableWidth = circleRadius * 2 - padding * 2;
    const availableHeight = circleRadius * 2 - padding * 2;
    let fontSize = Math.min(18, circleRadius * 0.60);
    while (fontSize > 7) {
      const lines = wrapText(text, fontSize, availableWidth);
      const lineHeight = fontSize * 1.15;
      const tooWide = lines.some((line) => getTextWidth(line, fontSize) > availableWidth);
      const tooTall = lines.length * lineHeight > availableHeight;
      if (!tooWide && !tooTall) return fontSize;
      fontSize -= 1;
    }
    return 7;
  };

  const renderText = (
    text: string,
    cx: number,
    cy: number,
    circleSize: number,
    opactiy: number
  ) => {
    const fontSize = calculateFontSize(circleSize, text);
    const availableWidth = circleSize * 2 - 16;
    const lines = wrapText(text, fontSize, availableWidth);
    const lineHeight = fontSize * 1.15;
    return (
      <text
        className="font-sans"
        x={cx}
        y={cy - ((lines.length - 1) * lineHeight) / 2}
        textAnchor="middle"
        fontSize={fontSize}
        fill="#333"
        // filter="url(#drop-shadow)"
        opacity={opactiy}
        stroke="#333"
        strokeWidth="0.9px"
        style={{ transition: "opacity 0.4s ease-out", cursor: "pointer" }}
        onMouseEnter={() => setHoveredBubble(text)}
        onMouseLeave={() => setHoveredBubble(null)}
        onClick={() => setSelectedNode(text)}
      >
        {lines.map((line, index) => (
          <tspan x={cx} dy={index === 0 ? 0 : lineHeight} key={index}>
            {line}
          </tspan>
        ))}
      </text>
    );
  };

  const { selectedBackgroundColour } = useSelectedBackgroundColour();

  return (
    <div
      style={{
        display: "flex",
        width: "100wh",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: darkMode
          ? "#0f0f13"
          : selectedBackgroundColour
          ? selectedBackgroundColour
          : "white",
      }}
    >
      <svg width="600" height="600">
        <defs>
          <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
            <feFlood floodColor="rgba(85, 85, 85, 0.7)" result="color" />
            <feComposite in2="offsetBlur" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {renderLinkLines(robotLinks, userRadius, robotRadius, robotRadius)}
        {renderLinkLines(userLinks, robotRadius, robotRadius, userRadius)}
        {topicArray.map(([topic, { frequency, analysis }], index) => {
          const color = colors[index % colors.length];
          const angle = startingAngle + index * angleSlice;

          const topicX = startingPosition + topicRadius * Math.cos(angle);
          const topicY = startingPosition + topicRadius * Math.sin(angle);
          const userX = startingPosition + userRadius * Math.cos(angle);
          const userY = startingPosition + userRadius * Math.sin(angle);
          const robotX = startingPosition + robotRadius * Math.cos(angle);
          const robotY = startingPosition + robotRadius * Math.sin(angle);

          const robotSize = 22;
          const minTopicSize = 30;
          const topicSize = minTopicSize + (frequency / maxFrequency) * 25;

          const totalSentimentScore = analysis.reduce(
            (sum, current) => sum + current.sentiment_score,
            0
          );
          const averageSentimentScore = totalSentimentScore / analysis.length;
          const minUserSize = 16;
          const userSize = minUserSize + averageSentimentScore * userScaleFactor;

          const emotionLabel = analysis[0].emotion_label;
          const hoveredOpacity = hoveredBubble ? (hoveredBubble === topic ? 1 : 0.7) : 1;

          return (
            <g key={topic}>
              {renderCircles(userX, userY, userSize, color, hoveredOpacity, topic)}
              <g
                transform={`translate(${userX - 25 / 2}, ${userY - 25 / 2})`}
                style={{ opacity: hoveredOpacity, transition: "opacity 0.4s ease-out", cursor: "pointer" }}
                onMouseEnter={() => setHoveredBubble(topic)}
                onMouseLeave={() => setHoveredBubble(null)}
                onClick={() => setSelectedNode(topic)}
              >
                {getEmotionSVG("user", emotionLabel, userSize)}
              </g>
              {renderCircles(topicX, topicY, topicSize, color, hoveredOpacity, topic)}
              {index === 0 && (
                <g transform={`translate(${topicX + 5}, ${topicY - topicSize - 35}) rotate(15)`}>
                  <Flag width={40} height={45} style={{ color: color }} />
                </g>
              )}
              {renderText(topic, topicX, topicY, topicSize, hoveredOpacity)}
              {renderCircles(robotX, robotY, robotSize, color, hoveredOpacity, topic)}
              <g
                transform={`translate(${robotX - robotSize / 2}, ${robotY - robotSize / 2})`}
                style={{ opacity: hoveredOpacity, transition: "opacity 0.4s ease-out" }}
              >
                {getEmotionSVG("robot", emotionLabel, robotSize)}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default Bubbles;
