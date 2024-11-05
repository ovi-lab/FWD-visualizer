"use client";
import NodeList from "./NodeList";
import { useFilter } from "@/app/contexts/filterContext";

const FerrisWheelPage = () => {
  const { filteredDiagramData } = useFilter();

  return (
    <div>
      <NodeList
        nodes={filteredDiagramData.nodes}
        links={filteredDiagramData.links}
      />
    </div>
  );
};

export default FerrisWheelPage;
