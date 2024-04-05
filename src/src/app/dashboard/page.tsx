import InfoPanel from "./info/page";
import ArcDiagram from "./diagrams/(infoGroup)/arc/page";
import Chatbox from "./chat/page";
import SankeySelector from "./diagrams/(infoGroup)/sankey/page";

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
            <SankeySelector/>
          </div>
          <Chatbox/>
        </div>
    </div>
  );
};

