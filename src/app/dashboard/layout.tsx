import SideBar from "../ui/sideBar";
import ControlPanel from "../ui/controlPanel"
import { SelectedNodeProvider } from "../contexts/selectedNodeContext";
import { ChatProvider } from "../contexts/chatContext";
import { TimeProvider } from "@/app/contexts/timeContext";
import { FilterProvider } from "@/app/contexts/filterContext";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
  <div className="w-full flex-none md:w-56">
    <SideBar />
  </div>

  <div className="flex-grow">
    <TimeProvider>
      <FilterProvider>
        <div className="flex flex-col h-full">
          <div className="p-3 md:px-4 md:py-3 overflow-y-auto flex">
            
            <ChatProvider>
              <SelectedNodeProvider>
                {children}
              </SelectedNodeProvider>
            </ChatProvider>
          </div>
          <div className="mr-5">
            <ControlPanel />
          </div>
        </div>
      </FilterProvider>
    </TimeProvider>
  </div>
</div>
  );
}
