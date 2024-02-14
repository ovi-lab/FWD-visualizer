
import SideBar from "../ui/sideBar";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-56">
          <SideBar />
        </div>
        <div className="flex-grow p-3 md:overflow-y-auto md:px-4 md:py-6">{children}</div>
      </div>
    );
  }