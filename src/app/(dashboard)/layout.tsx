import SideBar from "@/app/components/sideBar";
import ControlPanel from "@/app/components/controlPanel";
import { SelectedNodeProvider } from "@/app/contexts/selectedNodeContext";
import { ChatProvider } from "@/app/contexts/chatContext";
import { FilterProvider } from "@/app/contexts/filterContext";
import { SocketDataProvider } from "@/app/contexts/socketDataContext";
import { DarkModeProvider } from "../contexts/DarkModeContext";
import { ClickedBubbleProvider } from "./contexts/ClickedBubbleContext";
import { SelectedColourProvider } from "../contexts/SelectedColourContext";
import { VisibleDivsProvider } from "../contexts/VisibleTranscriptContext";
import { SelectedBackgroundColourProvider } from "../contexts/SelectedBackgroundColourContext";
import { DarkModeHoverProvider } from "../contexts/DarkModeHoverContext";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid grid-cols-9 w-full h-full min-h-screen min-w-screen">
      <SocketDataProvider>
        <div className="col-span-1 flex flex-col h-full">
        {/* comment this out to remove side abr */}
          <SideBar />
          {/* to remove side bar, comment out the above line */}
        </div>
        <ClickedBubbleProvider>
          <VisibleDivsProvider>
            <SelectedBackgroundColourProvider>
              <SelectedColourProvider>
                <div className="col-span-8 flex flex-col h-full">
                  <FilterProvider>
                    <DarkModeProvider>
                      <DarkModeHoverProvider>
                        {/* Could this div to be full? high */}
                        <div className="flex-1 overflow-y-auto">
                          <ChatProvider>
                            <SelectedNodeProvider>
                              {children}
                            </SelectedNodeProvider>
                          </ChatProvider>
                        </div>
                      </DarkModeHoverProvider>
                    </DarkModeProvider>
                    {/* Hidden for now: filter panel (speaker, sentiment, emotion, topic,
                        safety, reset, timeline). Uncomment to bring it back.
                    <ControlPanel /> */}
                  </FilterProvider>
                </div>
              </SelectedColourProvider>
            </SelectedBackgroundColourProvider>
          </VisibleDivsProvider>
        </ClickedBubbleProvider>
      </SocketDataProvider>
    </div>
  );
}
