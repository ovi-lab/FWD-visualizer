// Import 'use client' and useState to handle client side interaction
"use client";
import React, { useState } from "react";

// Import svg components
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
  Arrow,
} from "@/app/components/svgs";
import { useVisibleDivs } from "../../../contexts/VisibleTranscriptContext";
import { useSelectedColour } from "../../../contexts/SelectedColourContext";
import { useDarkMode } from "../../../contexts/DarkModeContext";
import { useSelectedNode } from "@/app/contexts/selectedNodeContext";
import { useSelectedBackgroundColour } from "@/app/contexts/SelectedBackgroundColourContext";

// Define the types for the passed parameters
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

// Main function to create the outer and inner bubble set with the passed topic Map & linksMap
const Bubbles: React.FC<BubbleProps> = ({ topicMap, linksMap }) => {
  // Fetch the selected colour scheme and darkmode setting passed from ColorPicker and DarkModeSwitch components using useContext
  const { selectedColour } = useSelectedColour();
  // If no colour is selected, set default colour
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

  // Pass clicked bubble topic name to chatbox component using useContext
  const { setSelectedNode } = useSelectedNode();

  // Track hovered bubble
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);

  // Track visible chat boxes by fetching visible div ids passed from chatbox page using useContext
  const { visibleDivs } = useVisibleDivs();

  const visibleTopics = Array.from(
    new Set(visibleDivs.map((divId) => divId.split("-")[0]))
  );

  // Convert topicMap and linkMap to Array
  const topicArray = Array.from(topicMap.entries());
  const totalTopicNum = topicArray.length;

  const linkRobotArray = Array.from(linksMap.robot.entries());
  const linkUserArray = Array.from(linksMap.user.entries());

  // Define configurations for the bubbles
  const userRadius = 275;
  const topicRadius = 175;
  const robotRadius = 85;

  const userScaleFactor = 10;
  const topicScaleFactor = 3;

  const angleSlice = (2 * Math.PI) / totalTopicNum;
  const startingAngle = -Math.PI / 2;
  const startingPosition = 300;

  // Helper function to return corresponding svg
  const getEmotionSVG = (bubble: string, emotion: string, size: number) => {
    const svgProps = {
      width: bubble === "user" ? 25 : size,
      height: bubble === "user" ? 25 : size,
      filter: "url(#drop-shadow)",
    };
    switch (emotion) {
      case "joy":
        return bubble === "robot" ? (
          <Joy {...svgProps} />
        ) : (
          <Joy_User {...svgProps} />
        );
      case "sadness":
        return bubble === "robot" ? (
          <Sadness {...svgProps} />
        ) : (
          <Sadness_User {...svgProps} />
        );
      case "anger":
        return bubble === "robot" ? (
          <Anger {...svgProps} />
        ) : (
          <Anger_User {...svgProps} />
        );
      case "fear":
        return bubble === "robot" ? (
          <Fear {...svgProps} />
        ) : (
          <Fear_User {...svgProps} />
        );
      case "disgust":
        return bubble === "robot" ? (
          <Disgust {...svgProps} />
        ) : (
          <Disgust_User {...svgProps} />
        );
      case "neutral":
        return bubble === "robot" ? (
          <Neutral {...svgProps} />
        ) : (
          <Neutral_User {...svgProps} />
        );
      case "surprise":
        return bubble === "robot" ? (
          <Surprise {...svgProps} />
        ) : (
          <Surprise_User {...svgProps} />
        );
      default:
        return null;
    }
  };

  // Helper function to create a mapping of topicId to topic name for easy lookup
  const topicIdToNameMap = topicArray.reduce((idToNameMap, [name, { ids }]) => {
    ids.forEach((id) => {
      idToNameMap.set(id, name);
    });
    return idToNameMap;
  }, new Map<number, string>());

  // Helper functions to extract the links initated by robot and user separately from the linksMap by deconstructing for each target Id to have each entry
  const robotLinks = linkRobotArray.flatMap(([sourceId, targetIds]) =>
    targetIds.map((targetId) => ({ sourceId, targetId }))
  );
  const userLinks = linkUserArray.flatMap(([sourceId, targetIds]) =>
    targetIds.map((targetId) => ({ sourceId, targetId }))
  );

  // Helper function to get the actual topic name for each topic id using topicIdToNameMap
  const getTopicName = (link: { sourceId: number; targetId: number }) => {
    /* let var: possibleType1 | possibleType2 | possibleType3... = initialType */
    let sourceTopicName: string | number | undefined = undefined;
    let targetTopicName: string | number | undefined = undefined;
    /* Map.forEach((key, value) => {callback_func(value or key)}); */
    topicIdToNameMap.forEach((key, value) => {
      if (value == link.sourceId) {
        sourceTopicName = key;
      } else if (value == link.targetId) {
        targetTopicName = key;
      }
    });
    return {
      sourceTopicName,
      targetTopicName,
    };
  };

  // topicMap only stores unique topic names
  const uniqueTopicNameArray = Array.from(topicMap.keys());

  // Helper function to reindexize topic id to calculate configuration
  const getReIndex = (sourceTopicName: string, targetTopicName: string) => {
    const sourceIndex = uniqueTopicNameArray.indexOf(String(sourceTopicName));
    const targetIndex = uniqueTopicNameArray.indexOf(String(targetTopicName));
    return {
      sourceIndex,
      targetIndex,
    };
  };

  // Helper function to calculate the configuration values
  const prepareConfiguration = (
    radius: number,
    sourceIndex: number,
    targetIndex: number
  ) => {
    const sourceAngle = startingAngle + sourceIndex * angleSlice;
    const targetAngle = startingAngle + targetIndex * angleSlice;

    const sourceX = startingPosition + radius * Math.cos(sourceAngle);
    const sourceY = startingPosition + radius * Math.sin(sourceAngle);
    const targetX = startingPosition + topicRadius * Math.cos(targetAngle);
    const targetY = startingPosition + topicRadius * Math.sin(targetAngle);

    return {
      sourceX,
      sourceY,
      targetX,
      targetY,
    };
  };

  // Define type of configuration_trans and configuration_add to resue for both robot and user links

  // Helper function to render the link lines using the configuration values
  const renderLinkLines = (
    links: { sourceId: any; targetId: any }[],
    transRadius: number,
    addRaidus: number,
    normalRaidus: number
  ) => {
    return (
      <>
        {links.map((link: { sourceId: any; targetId: any }) => {
          // Get topic names
          const topicNames = getTopicName(link);
          const sourceTopicName = String(topicNames.sourceTopicName);
          const targetTopicName = String(topicNames.targetTopicName);

          // Get source and target indices
          const reIndexes = getReIndex(sourceTopicName, targetTopicName);
          const sourceIndex = reIndexes.sourceIndex;
          const targetIndex = reIndexes.targetIndex;

          // Prepare configuration based on the source and target
          let configuration_add = null;
          let configuration_trans = null;

          // If topic changes,switch source and target speaker (prompt-sentence -> sentence-sentence )
          if (sourceTopicName !== targetTopicName) {
            configuration_trans = prepareConfiguration(
              transRadius,
              sourceIndex,
              targetIndex
            );
            configuration_add = prepareConfiguration(
              addRaidus,
              sourceIndex,
              sourceIndex
            );
          } else {
            configuration_trans = prepareConfiguration(
              normalRaidus,
              sourceIndex,
              targetIndex
            );
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
                opacity={
                  hoveredBubble
                    ? sourceTopicName === hoveredBubble
                      ? 1
                      : 0.2
                    : 1
                }
                style={{
                  transition: "opacity 0.4s ease-out",
                  strokeDasharray:
                    link.targetId - link.sourceId < -1 ? "5, 5" : "none",
                }}
                // filter="url(#drop-shadow)" // FIX: Not working
              />

              {configuration_add && (
                <line
                  x1={configuration_add.sourceX}
                  y1={configuration_add.sourceY}
                  x2={configuration_add.targetX}
                  y2={configuration_add.targetY}
                  // filter="url(#drop-shadow)" // FIX: Not working
                  stroke={colors[sourceIndex % colors.length]}
                  strokeWidth={6}
                  opacity={
                    hoveredBubble
                      ? sourceTopicName === hoveredBubble
                        ? 1
                        : 0.2
                      : 1
                  }
                  style={{
                    transition: "opacity 0.4s ease-out",
                    strokeDasharray:
                      link.targetId - link.sourceId < -1 ? "5, 5" : "none",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </>
    );
  };

  // Helper function to render circles
  const renderCircles = (
    cx: number,
    cy: number,
    r: number,
    color: string,
    opacity: number,
    topic: string
  ) => {
    // Helper function to return lighten the given colour by the given percentage
    function lightenColor(hexColor: string, percent: number) {
      let r = parseInt(hexColor.slice(1, 3), 16);
      let g = parseInt(hexColor.slice(3, 5), 16);
      let b = parseInt(hexColor.slice(5, 7), 16);

      r = Math.min(255, Math.floor(r + (255 - r) * percent));
      g = Math.min(255, Math.floor(g + (255 - g) * percent));
      b = Math.min(255, Math.floor(b + (255 - b) * percent));

      return `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }

    // Helper function to darken the given color by the given percentage
    function darkenColor(hexColor: string, percent: number) {
      let r = parseInt(hexColor.slice(1, 3), 16);
      let g = parseInt(hexColor.slice(3, 5), 16);
      let b = parseInt(hexColor.slice(5, 7), 16);

      r = Math.max(0, Math.floor(r - r * percent));
      g = Math.max(0, Math.floor(g - g * percent));
      b = Math.max(0, Math.floor(b - b * percent));

      return `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }

    return (
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        opacity={opacity}
        // If the current topic is visible on chatbox display, create stroke in lighter fill color with glow effect
        stroke={
          visibleTopics.includes(topic)
            ? darkMode
              ? lightenColor(color, 0.4)
              : darkenColor(color, 0.05)
            : "none"
        }
        strokeWidth={visibleTopics.includes(topic) ? 4 : 0}
        filter={
          visibleTopics.includes(topic) ? "url(#glow)" : "url(#drop-shadow)"
        }
        style={{
          transition: "opacity 0.4s ease-out",
          cursor: "pointer",
        }}
        // Set HoveredBubble and ClickedBubble on mouse event
        onMouseEnter={() => setHoveredBubble(topic)}
        onMouseLeave={() => setHoveredBubble(null)}
        onClick={() => setSelectedNode(topic)}
      />
    );
  };

  // Helper function to calculate the width of the text for a given font size
  const getTextWidth = (text: string, fontSize: number) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
      context.font = `${fontSize}px Arial`;
      return context.measureText(text).width;
    }
    return 0;
  };

  // Helper function to wrap text within the circle based on the available width
  const wrapText = (text: string, fontSize: number, availableWidth: number) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      // Wrap long words (longer than 10) by letter
      if (word.length > 10) {
        for (let i = 0; i < word.length; i += 1) {
          const letter = word[i];
          const testLine = currentLine ? `${currentLine}${letter}` : letter; // If currentLine is not empty, add the new letter to the currentLine. If currentLine is empty, set the testLine to be the new letter
          const testWidth = getTextWidth(testLine, fontSize); // Get the width of the testLine

          if (testWidth > availableWidth) {
            // If the test line width (added new letter) is bigger than avialable width
            lines.push(currentLine); // Just push currentLine without adding the new letter (don't add new letter)
            currentLine = letter; // Reset currentLine with the new letter
          } else {
            // If the test line width (added new letter) is smaller than avialble legnth
            currentLine = testLine; // Set the currentLine to be testLine (add new letter)
          }
        }
        if (currentLine) {
          // If there are remaining letters  in the currentLine after the loop
          lines.push(currentLine); // Add the remaining words to the lines
          currentLine = ""; // Reset currentLine for the next word
        }
        // Wrap short words (less long than 10) by word
      } else {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = getTextWidth(testLine, fontSize);

        if (testWidth > availableWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine; // Add the word to the current line
        }
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  // Calculate optimal font size to fit within a circle with padding
  const calculateFontSize = (
    circleRadius: number,
    text: string,
    padding = 13
  ) => {
    const circleDiameter = circleRadius * 2;
    const availableWidth = circleDiameter - padding * 2;

    let fontSize = 20;

    let wrappedLines = wrapText(text, fontSize, availableWidth);

    while (
      wrappedLines.some(
        (line) => getTextWidth(line, fontSize) > availableWidth
      ) &&
      fontSize > 10
    ) {
      fontSize -= 1; // Decrease font size if any line overflows
      wrappedLines = wrapText(text, fontSize, availableWidth); // Rewrap with new font size
    }

    return fontSize;
  };

  // Render function for text inside the circle
  const renderText = (
    text: string,
    cx: number,
    cy: number,
    circleSize: number,
    opactiy: number
  ) => {
    const fontSize = calculateFontSize(circleSize, text);
    const availableWidth = circleSize * 2 - 10;
    const lines = wrapText(text, fontSize, availableWidth);
    const lineHeight = fontSize * 1.2;
    return (
      <text
        className="font-mono"
        x={cx}
        y={cy - ((lines.length - 1) * lineHeight) / 4}
        textAnchor="middle"
        fontSize={fontSize}
        fill="white"
        filter="url(#drop-shadow)"
        opacity={opactiy}
        stroke="white"
        strokeWidth="0.5px"
        style={{
          transition: "opacity 0.4s ease-out",
          cursor: "pointer",
        }}
        onMouseEnter={() => setHoveredBubble(text)}
        onMouseLeave={() => setHoveredBubble(null)}
        onClick={() => setSelectedNode(text)}
      >
        {lines.map((line, index) => (
          <tspan
            // style={{ fontWeight: "bold" }}
            x={cx}
            dy={index === 0 ? 0 : lineHeight}
            key={index}
          >
            {line}
          </tspan>
        ))}
      </text>
    );
  };

  const { selectedBackgroundColour } = useSelectedBackgroundColour();

  // Display Section
  return (
    <div
      style={{
        display: "flex",
        width: "100wh",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: darkMode
          ? "#3C3C3C"
          : selectedBackgroundColour
          ? selectedBackgroundColour
          : "white",
      }}
    >
      <svg width="600" height="600">
        {/* Define drop shadow filter */}
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
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />{" "}
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Links Section */}
        {/* Display robot links */}
        {renderLinkLines(robotLinks, userRadius, robotRadius, robotRadius)};
        {/* Display user links */}
        {renderLinkLines(userLinks, robotRadius, robotRadius, userRadius)};
        {/* Bubbles Section */}
        {topicArray.map(([topic, { frequency, analysis }], index) => {
          // Define configurations for the bubbles based on the basic configurations
          const color = colors[index % colors.length];

          const angle = startingAngle + index * angleSlice;

          const topicX = startingPosition + topicRadius * Math.cos(angle);
          const topicY = startingPosition + topicRadius * Math.sin(angle);

          const userX = startingPosition + userRadius * Math.cos(angle);
          const userY = startingPosition + userRadius * Math.sin(angle);

          const robotX = startingPosition + robotRadius * Math.cos(angle);
          const robotY = startingPosition + robotRadius * Math.sin(angle);

          const robotSize = 22;

          const minTopicSize = 27.5;
          const topicSize = minTopicSize + frequency * topicScaleFactor;

          // Get the sum of all sentiment scores by accumulating current senitment score from initial value 0
          const totalSentimentScore = analysis.reduce(
            (sum, current) => sum + current.sentiment_score,
            0
          );
          const averageSentimentScore = totalSentimentScore / analysis.length;

          const minUserSize = 15;
          const userSize =
            minUserSize + averageSentimentScore * userScaleFactor;

          const emotionLabel = analysis[0].emotion_label;

          const hoveredOpacity = hoveredBubble
            ? hoveredBubble === topic
              ? 1
              : 0.7
            : 1;

          return (
            <g key={topic}>
              {/* User bubble */}
              {renderCircles(
                userX,
                userY,
                userSize,
                color,
                hoveredOpacity,
                topic
              )}
              {/* User bubble emotion svg */}
              <g
                transform={`translate(
                     ${userX - 25 / 2},
                     ${userY - 25 / 2}
                   )`}
                style={{
                  opacity: hoveredOpacity,
                  transition: "opacity 0.4s ease-out",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoveredBubble(topic)}
                onMouseLeave={() => setHoveredBubble(null)}
                onClick={() => setSelectedNode(topic)}
              >
                {getEmotionSVG("user", emotionLabel, userSize)}
              </g>
              {/* Topic bubble */}
              {renderCircles(
                topicX,
                topicY,
                topicSize,
                color,
                hoveredOpacity,
                topic
              )}
              {/* Topic bubble flag - Draw flag only for the first topic buble (id 0) */}
              {index === 0 && (
                <g
                  transform={`translate(${topicX + 5}, ${
                    topicY - topicSize - 35
                  }) rotate(15)`}
                >
                  <Flag width={40} height={45} style={{ color: color }} />{" "}
                </g>
              )}
              {/* Topic bubble text */}
              {renderText(topic, topicX, topicY, topicSize, hoveredOpacity)}
              {/* Robot bubble */}
              {renderCircles(
                robotX,
                robotY,
                robotSize,
                color,
                hoveredOpacity,
                topic
              )}
              {/* Robot bubble emotion svg */}
              <g
                transform={`translate(
                     ${robotX - robotSize / 2},
                     ${robotY - robotSize / 2}
                   )`}
                style={{
                  opacity: hoveredOpacity,
                  transition: "opacity 0.4s ease-out",
                }}
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
