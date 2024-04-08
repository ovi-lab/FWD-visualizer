import SideBar from "../ui/sideBar";
import ControlPanel from "../ui/controlPanel";
import { SelectedNodeProvider } from "../contexts/selectedNodeContext";
import { ChatProvider } from "../contexts/chatContext";
import { TimeProvider } from "@/app/contexts/timeContext";
import { FilterProvider } from "@/app/contexts/filterContext";
import { WebSocketProvider } from "@/app/contexts/webSocketContext";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid grid-cols-9 w-screen h-screen">
      <WebSocketProvider>
        <div className="col-span-1 flex flex-col h-full">
          <SideBar />
        </div>

        <div className="col-span-8 flex flex-col h-full">
          <TimeProvider>
            <FilterProvider>
              <div className="p-3 overflow-y-auto flex-1">
                <ChatProvider>
                  <SelectedNodeProvider>{children}</SelectedNodeProvider>
                </ChatProvider>

              </div>
                <ControlPanel />
            </FilterProvider>
          </TimeProvider>
        </div>
      </WebSocketProvider>
    </div>
  );
}
