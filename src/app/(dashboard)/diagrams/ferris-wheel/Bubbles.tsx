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
  Flag,
  Arrow,
  Joy_User,
  Neutral_User,
  Sadness_User,
  Surprise_User,
} from "@/app/components/svgs";

// Define interface for Analysis
interface Analysis {
  turn: string;
  emotion_label: string;
  emotion_score: number;
  sentiment_score: number;
  // sentence: string;
}

// Define interface for TopicMap
interface TopicMap {
  frequency: number;
  analysis: Analysis[];
  ids: number[];
}

// Define interface for LinksMap
interface LinksMap {
  robot: Map<number, number[]>;
  user: Map<number, number[]>;
}

// Define interface for BubbleProps
interface BubbleProps {
  topicMap: Map<string, TopicMap>;
  linksMap: LinksMap;
}

// Main function to create the outer and inner bubble set with the passed topic Map & linksMap
const Bubbles: React.FC<BubbleProps> = ({ topicMap, linksMap }) => {
  // Define colors for the bubbles
  const colors = [
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

  const topicArray = Array.from(topicMap.entries());
  const totalTopicNum = topicArray.length;

  // Define basic configurations for the bubbles
  const userRadius = 275;
  const topicRadius = 175;
  const robotRadius = 85;

  const userScaleFactor = 10;
  const topicScaleFactor = 3;

  const angleSlice = (2 * Math.PI) / totalTopicNum;
  const startingAngle = -Math.PI / 2;
  const startingPosition = 300;

  // Track hovered bubble
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);

  // Helper function to return corresponding svg
  const getEmotionSVG = (bubble: string, emotion: string, size: number) => {
    const svgProps = {
      width: size,
      height: size,
      filter: "url(#drop-shadow)",
    };
    switch (emotion) {
      case "joy":
        return <Joy {...svgProps} />;
      case "sadness":
        return <Sadness {...svgProps} />;
      case "anger":
        return <Anger {...svgProps} />;
      case "fear":
        return <Fear {...svgProps} />;
      case "disgust":
        return <Disgust {...svgProps} />;
      case "neutral":
        return <Neutral {...svgProps} />;
      case "surprise":
        return <Surprise {...svgProps} />;
      default:
        return null;
    }
  };

  // Helper function to wrap text to fit in the outer bubble
  /* FIX: Look up if there is a way to make text fit-content in svg */
  const wrapText = (text: string, topicSize: number, fontSize: number) => {
    const maxLength = Math.floor(topicSize / fontSize);
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      if ((currentLine + word).length <= maxLength) {
        currentLine += `${word} `;
      } else {
        lines.push(currentLine.trim());
        currentLine = `${word} `;
      }
    });
    lines.push(currentLine.trim());
    return lines;
  };

  // Helper function to create a mapping of topicId to topic name for easy lookup
  const topicIdToNameMap = Array.from(topicMap.entries()).reduce(
    (acc, [key, { ids }]) => {
      ids.forEach((id) => {
        acc.set(id, key);
      });
      return acc;
    },
    new Map<number, string>()
  );
  console.log("topicIdToNameMap:", Array.from(topicIdToNameMap.entries()));

  // Helper functions to extract the links initated by robot and user separately from the linksMap
  /*
   Destructure each entry of linksMap with `sourceId` being the key (source topic ID) and `targetIds` being the array values (target topic IDs)
   Iterate over the array `targetId`s, creating an object `{ sourceId, targetId }` for each one
   flatMap((item) => ( callback_func(item) ))
   * Method of Array instances
   * Return a new array formed by applying a given callback function to each element of the array
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
    Before: linksMap<number, number[]>
   Stores each key (source ID) pointing to an array of values(target IDs)
   {
     0 => [2],
     2 => [2, 4],
    ...
   }
   After: robotLinks{sourceid: num, targetId: num}
   Flattens map structure to create individual link objects
   [
     { sourceId: 0, targetId: 2 },
     { sourceId: 2, targetId: 2 },
     { sourceId: 2, targetId: 4 },
     ...
   ]
 */
  const robotLinks = Array.from(linksMap.robot.entries()).flatMap(
    ([sourceId, targetIds]) =>
      targetIds.map((targetId) => ({ sourceId, targetId }))
  );
  const userLinks = Array.from(linksMap.user.entries()).flatMap(
    ([sourceId, targetIds]) =>
      targetIds.map((targetId) => ({ sourceId, targetId }))
  );

  // Helper function to get the actual topic name for the topic id using topicIdToNameMap
  const getTopicName = (link: { sourceId: number; targetId: number }) => {
    let sourceTopicName: string | number | undefined = undefined;
    let targetTopicName: string | number | undefined = undefined;

    topicIdToNameMap.forEach((key, value) => {
      if (value == link.sourceId) {
        console.log(
          "Robot Source Topic Name: " + key + " Robot Source Topic Id: " + value
        );
        sourceTopicName = key;
      } else if (value == link.targetId) {
        console.log(
          "Robot Target Topic Name: " + key + " Robot Target Topic Id: " + value
        );
        targetTopicName = key;
      }
    });

    return {
      sourceTopicName,
      targetTopicName,
    };
  };

  // Helper function to reindexize topic id to calculate configuration
  const getReIndex = (sourceTopicName: string, targetTopicName: string) => {
    const sourceIndex = Array.from(topicMap.keys()).indexOf(
      String(sourceTopicName)
    );
    const targetIndex = Array.from(topicMap.keys()).indexOf(
      String(targetTopicName)
    );

    console.log(
      "Robot Source Index: " +
        sourceIndex +
        " Robot Target Index: " +
        targetIndex
    );

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

    /* TODO: Find whose turn each source and target is, and startingPosition - speakerBubbleSize/2 */
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
  let configuration_trans: {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
  } | null = null;

  let configuration_add: {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
  } | null = null;

  // Helper function to render the link lines using the configuration values
  /*
    IDEA
    * If the source and target of a link are not the same it means the link is transition link

    * As the way the link object stores link is prompt -> sentence, we need modify the way to fetch and render them
      * prompt -> sentence link suggests there should be 2 links if it was constructed as sentence -> sentence 
        * source topic -> source topic from the prompt speaker(who prompted the new topic)
        * souce topic -> target topic from the sentence speaker(who actually started the new topic)
        
    * If sourceTopicName !== targetTopicName (using topic name as topic can have multiple ids), draw two liens
      * one line from source topic to source topic from the prompt speaker (last sentence wihtin the current topic) - use targetIndex to calculate targetAngle
      * one line from source topic to target topic from the sentence speaker (first sentence of the new topic) - use promptSpeakerBubble radius to calculate target coordinate
  */
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
              {/* QUESTION: How to set the target coordinate to be the outline not the center point */}
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
                markerEnd="url(#arrow)"
                style={{
                  transition: "opacity 0.4s ease-out",
                  markerEnd: `url(#arrow)`,
                  fill: "black",
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
    return (
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        filter="url(#drop-shadow)"
        opacity={opacity}
        style={{
          transition: "opacity 0.4s ease-out",
        }}
        onMouseEnter={() => setHoveredBubble(topic)}
        onMouseLeave={() => setHoveredBubble(null)}
      />
    );
  };

  // Display Section
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
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

          {/* <marker */}
          {/* id="arrow"
            markerWidth="3"
            markerHeight="3" 
            refX="8.5"
            refY="1.5" 
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,3 L4,1.5 Z" fill="white" /> */}
          {/* </marker> */}
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

          const robotSize = 22.5;

          const minTopicSize = 25;
          const topicSize = minTopicSize + frequency * topicScaleFactor;

          const fontSize = topicSize / 2.75;

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
              {/* <g
                transform={`translate(
                     ${userX - userSize / 2},
                     ${userY - robotSize / 2}
                   )`}
                style={{
                  transition: "opacity 0.4s ease-out",
                }}
              >
                {getEmotionSVG("user", emotionLabel, userSize)}
              </g> */}

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
                  transform={`translate(${topicX - 5}, ${
                    topicY - topicSize - 35
                  })`}
                >
                <Flag width={40} height={45} style={{ color: color }} />{" "}
                </g>
              )}
              {/* Topic bubble text */}
              <text
                x={topicX}
                y={
                  topicY -
                  ((wrapText(topic, topicSize - 10, fontSize).length - 1) *
                    fontSize) /
                    2
                }
                textAnchor="middle"
                fontSize={fontSize}
                fill="white"
                filter="url(#drop-shadow)"
                opacity={hoveredOpacity}
                style={{
                  transition: "opacity 0.4s ease-out",
                }}
              >
                {wrapText(topic, topicSize, fontSize).map((line, i) => (
                  <tspan x={topicX} dy={i === 0 ? 0 : fontSize} key={i}>
                    {line}
                  </tspan>
                ))}
              </text>

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
                  transition: "opacity 0.4s ease-out",
                }}
              >
                {getEmotionSVG("robot", emotionLabel, robotSize)}
              </g>
            </g>
          );
        })}
      </svg>

      {/* Chat Box Section */}
      {/* <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "transparent",
          color: "#03304f",
          border: `3px solid ${
            colors[
              topicArray.findIndex(
                ([topicName]) => topicName === hoveredBubble
              ) % colors.length
            ]
          }`,
          borderRadius: "8px",
          boxSizing: "border-box",x
          maxWidth: "500px",
          maxHeight: "fit-content",
          display: hoveredBubble ? "flex" : "none",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {hoveredBubble &&
          topicMap.get(hoveredBubble)!.analysis.map((interaction, index) => (
            <h4 key={index} style={{ margin: "5px 0" }}>
              <strong>
                {interaction.turn === "robot" ? "Robot:" : "User:"}
              </strong>{" "}
              {interaction.sentence} <br />
            </h4>
          ))}
      </div> */}
    </div>
  );
};

export default Bubbles;
