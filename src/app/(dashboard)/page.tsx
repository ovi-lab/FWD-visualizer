import InfoPanel from "../info-panel/infoPanel";
import ArcDiagram from "./diagrams/arc/arcDiagram";
import Chatbox from "./chat/page";
import SankeyInterface from "./diagrams/sankey/page";

export default function Dashboard() {
  return (
    <div className="w-screen h-screen">  
        <div className="grid grid-cols-7 row data-row">
        <InfoPanel/>
          <div
            className="col-span-4"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            
            <ArcDiagram/>
            <SankeyInterface/>
          </div>
          <Chatbox/>
        </div>
    </div>
  );
};

