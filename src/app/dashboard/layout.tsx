import SideBar from "@/app/components/sideBar";
import ControlPanel from "@/app/components/controlPanel";
import { SelectedNodeProvider } from "@/app/contexts/selectedNodeContext";
import { ChatProvider } from "@/app/contexts/chatContext";
import { TimeProvider } from "@/app/contexts/timeContext";
import { FilterProvider } from "@/app/contexts/filterContext";
import { SocketDataProvider } from "@/app/contexts/socketDataContext";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid grid-cols-9 w-full h-full min-h-screen min-w-screen">
      <SocketDataProvider>
        <div className="col-span-1 flex flex-col h-full">
          <SideBar />
        </div>

        <div className="col-span-8 flex flex-col h-full">
          <TimeProvider>
            <FilterProvider>
              <div className="flex-1 overflow-y-auto p-3">
                <ChatProvider>
                  <SelectedNodeProvider>
                    {children}
                  </SelectedNodeProvider>
                </ChatProvider>
              </div>
              <ControlPanel />
            </FilterProvider>
          </TimeProvider>
        </div>
      </SocketDataProvider>
    </div>
  );
}
