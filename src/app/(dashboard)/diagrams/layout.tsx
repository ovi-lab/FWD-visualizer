import Chatbox from "../chat/page";
import InfoPanel from "../../components/infoPanel";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid grid-cols-7 w-full h-full">
      <div className="col-span-1">
        <InfoPanel />
      </div>
      <div className="col-span-4 flex flex-col overflow-auto">
        {children}
      </div>
      <div className="col-span-2">
        <Chatbox />
      </div>
    </div>
  );
}
