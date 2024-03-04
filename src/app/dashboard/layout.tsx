import SideBar from "../ui/sideBar";
import { SelectedNodeProvider } from "../contexts/selectedNodeContext";
import {ChatProvider} from '../contexts/chatContext'
import TimeLine from '../ui/timeline'
import { TimeProvider } from "../contexts/timeContext";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-56">
        <SideBar />
      </div>
      <div className="flex-grow p-3 md:px-4 md:py-6 overflow-y-auto">
     <TimeProvider>
      <TimeLine />
        <ChatProvider>
        <SelectedNodeProvider>{children}</SelectedNodeProvider>
        </ChatProvider>
     </TimeProvider>
      </div>
    </div>
  );
}
