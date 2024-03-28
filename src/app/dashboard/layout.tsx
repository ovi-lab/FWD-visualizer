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
    <div className="flex w-screen h-screen flex-col md:flex-row md:overflow-hidden">
      <WebSocketProvider>
        <div className="w-full flex-none md:w-56">
          <SideBar />
        </div>

        <div className="flex-grow">
          <TimeProvider>
            <FilterProvider>
              <div className="p-3 md:px-4 md:py-3 overflow-y-auto">
                <ChatProvider>
                  <SelectedNodeProvider>{children}</SelectedNodeProvider>
                </ChatProvider>

                <ControlPanel />
              </div>
            </FilterProvider>
          </TimeProvider>
        </div>
      </WebSocketProvider>
    </div>
  );
}
