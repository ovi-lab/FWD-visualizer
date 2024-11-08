"use client";
import Bubbles from "./Bubbles";

// Define the types for the node(interaction) and links
interface Nodes {
  id: number;
  topic: string;
  interactions: Interaction[];
}

interface Interaction {
  turn: string;
  emotion_label: string;
  emotion_score: number;
  sentiment_score: number;
}

interface Links {
  robot: { source: number; target: number }[];
  user: { source: number; target: number }[];
}

// Main function NodeList()
export default function NodeList({
  nodes,
  links,
}: {
  nodes: Nodes[];
  links: Links;
}) {
  // Create topicMap(a single map with key and object value) to store data fetched from nodes
  const topicMap = new Map<
    string,
    {
      frequency: number; // manually track frequency count
      analysis: Interaction[]; // array of only user interaction
      ids: number[]; // array of topic ids (each topic can have upto 2 ids, child and robot)
    }
  >();

  // Need to ensure there is conversation data before iteration
  if (nodes.length === 0) return null;

  // Iterate through nodes (outer) array
  nodes.forEach((node) => {
    // Iterate through interactions (inner) array
    node.interactions.forEach((interaction) => {
      // If the topic already exists in topicMap, update frequency, analysis
      if (topicMap.has(node.topic)) {
        const topicData = topicMap.get(node.topic);
        if (topicData) {
          // Include frequency count from robot but exclude emotion related interactions to separate from robot sentiment score and emotion label
          topicData.frequency += 1;
          if (interaction.turn === "user") {
            topicData.analysis.push(interaction);
          }

          // Add id only if it's not already present
          if (!topicData.ids.includes(node.id)) {
            topicData.ids.push(node.id);
          }
          // console.log(
          //   "ID Already Exists " +
          //     node.topic +
          //     " " +
          //     node.id +
          //     " topicData.ids " +
          //     topicData.ids
          // );
        }
      } else {
        // If the topic doesn't exist in topicMap, create new entry with the initial data
        topicMap.set(node.topic, {
          frequency: 1,
          analysis: interaction.turn === "user" ? [interaction] : [],
          ids: [node.id],
        });
        console.log("NEW ID " + node.topic + " " + node.id);
      }
    });
  });

  // Create linksMap(a single object with two maps) to store data fetched from nodes
  const linksMap = {
    robot: new Map<number, number[]>(),
    user: new Map<number, number[]>(),
  };

  // Need to ensure there are links data before iteration
  if (links.robot.length === 0 && links.user.length === 0) return null;

  // Process robot-initiated links
  links.robot.forEach((link) => {
    if (!linksMap.robot.has(link.source)) {
      linksMap.robot.set(link.source, []);
    }
    linksMap.robot.get(link.source)?.push(link.target);
  });

  // Process user-initiated links
  links.user.forEach((link) => {
    if (!linksMap.user.has(link.source)) {
      linksMap.user.set(link.source, []);
    }
    linksMap.user.get(link.source)?.push(link.target);
  });

  return (
    <div>
      <Bubbles topicMap={topicMap} linksMap={linksMap} />
    </div>
  );
}
