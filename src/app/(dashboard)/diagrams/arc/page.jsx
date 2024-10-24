"use client";
import React from "react";
import ArcDiagram from "./arcDiagram";
import { useFilter } from "@/app/contexts/filterContext";

const ArcDiagramPage = () => {
  const { filteredDiagramData } = useFilter();

  return (
    <div>
      <h1 className="float-left text-xl font-bold mx-4">Arc Diagram</h1>
      <ArcDiagram data={filteredDiagramData} />
    </div>
  );
};

export default ArcDiagramPage;
