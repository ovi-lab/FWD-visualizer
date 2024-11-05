import ArcDiagram from "./diagrams/arc/arcDiagram";
import SankeyInterface from "./diagrams/sankey/page";
import Chatbox from "./chat/page";
import InfoPanel from "../components/infoPanel";

export default function Dashboard() {
  return (
    <div className="w-screen h-screen">
      <div className="grid grid-cols-7 row data-row">
        <InfoPanel />
        <div
          className="col-span-4"
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* <ArcDiagram/>
            <SankeyInterface/> */}
        </div>
        <Chatbox />
      </div>
    </div>
  );
}
