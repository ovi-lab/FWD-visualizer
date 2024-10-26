"use client";
import { useState, useEffect } from "react";
import Bubbles from "./Bubbles";

// Main function NodeList()
export default function NodeList({nodes, links}) {
  const linksMap = {
    robot: new Map<number, number[]>(),
    user: new Map<number, number[]>()}
    
    const topicMap = new Map<
    string,
    {
      frequency: number;
      analysis: any[];
      ids: number[];
    }
  >();
  
    if (nodes.length === 0  ) return;
    nodes.forEach(
      (node: {
        id: number;
        topic: string;
        interactions: {
          turn: string;
          emotion_label: string;
          emotion_score: number;
          sentiment_score: number;
        }[];
      }) => {
        // Iterate through interactions(inner) array
        node.interactions.forEach((interaction) => {
          // If the topic already exists in topicMap, update frequency, analysis
          if (topicMap.has(node.topic)) {
            const topicData = topicMap.get(node.topic);
            if (topicData) {
              topicData.frequency += 1;

              if (interaction.turn === "user") {
                topicData.analysis.push(interaction);
              }

              // Add id only if it's not already present
              if (!topicData.ids.includes(node.id)) {
                topicData.ids.push(node.id);
              }
              console.log(
                "ID Already Exists " +
                  node.topic +
                  " " +
                  node.id +
                  " topicData.ids " +
                  topicData.ids
              );
            }

            // If the topic doesn't exist in topicMap, create new entry with the initial data
          } else {
            topicMap.set(node.topic, {
              frequency: 1,
              analysis: [interaction],
              ids: [node.id],
            });
            console.log("NEW ID " + node.topic + " " + node.id);
          }
        });
      }
    );

  
    console.log('links', links)
    if (links.length === 0) return;
    // Process robot-initiated links
  links.robot.forEach((link: { source: number; target: number }) => {
    if (!linksMap.robot.has(link.source)) {
      linksMap.robot.set(link.source, []);
    }
    linksMap.robot.get(link.source)?.push(link.target);
  });

  // Process user-initiated links
  links.user.forEach((link: { source: number; target: number }) => {
    if (!linksMap.user.has(link.source)) {
      linksMap.user.set(link.source, []);
    }
    linksMap.user.get(link.source)?.push(link.target);
  });




  // Store the fetched data to the map
  // Iterate through nodes(outer) array
  /* Array.forEach(item) => { //statement to apply to each item } 
     
    In this case, item is each entry of values
    Populate map with only required entries
  */

  // Store an array of target ids (value) for each source id(key)
  /*
    Map.prototype.get(key) 

    * Method of Map instances 
    * Returns a specified element from this map
    * If the value that is associated to the provided key is an object, 
      you will get a reference to that object 
      ex. myMap.set("bar", arr);
          myMap.get("bar").push("foo");
          console.log(arr); // ["foo"]

    In this case, source id(link.source) is key and linksMap.user.get(link.source) retrieves array values and adds (pushes) link.target to that array.
    The ?. (optional chaining) ensures that if link.source does not exist (though it should after the previous step), the code won't throw an error.
  */
  // Arrays to store userTransitionLinks and robotTransitionLinks
  // const userTransitionLinks: { source: number; target: number }[] = [];
  // const robotTransitionLinks: { source: number; target: number }[] = [];

  

  // // Add userTransitionLinks to linksMap.user
  // userTransitionLinks.forEach((link) => {
  //   if (!linksMap.user.has(link.source)) {
  //     linksMap.user.set(link.source, []);
  //   }
  //   linksMap.user.get(link.source)?.push(link.target);
  // });

  // // Add robotTransitionLinks to linksMap.robot
  // robotTransitionLinks.forEach((link) => {
  //   if (!linksMap.robot.has(link.source)) {
  //     linksMap.robot.set(link.source, []);
  //   }
  //   linksMap.robot.get(link.source)?.push(link.target);
  // });

  return (
    <>
      {/* Pass the topicMap and linksMap to Bubbles */}
      <Bubbles topicMap={topicMap} linksMap={linksMap} />
    </>
  );
}
