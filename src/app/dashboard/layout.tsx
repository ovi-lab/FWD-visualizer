import SideBar from "../ui/sideBar";
import { SelectedProvider } from "../contexts/selectedContext";
import {ChatProvider} from '../contexts/chatContext'
import TimeLine from './timeline'
import { TimeProvider } from "../contexts/timeContext";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-56">
        <SideBar />
      </div>
      
      <div className="flex-grow p-3 md:overflow-y-auto md:px-4 md:py-6">
     <TimeProvider>
      <TimeLine />
        <ChatProvider>
        <SelectedProvider>{children}</SelectedProvider>
        </ChatProvider>
     </TimeProvider>
      </div>
    </div>
  );
}
