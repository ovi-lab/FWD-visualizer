"use client";
import NodeList from "./NodeList";
import { useFilter } from "@/app/contexts/filterContext";

const  FerrisWheelPage = () => {
  const {filteredDiagramData} = useFilter();
  return (
    <>
      <NodeList nodes={filteredDiagramData.nodes} links={filteredDiagramData.links} />
    </>
  );
}

export default FerrisWheelPage;