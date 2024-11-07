import Chatbox from "../chat/page";
import InfoPanel from "../../components/infoPanel";
import React from "react";
import { useDarkMode } from "@/app/contexts/DarkModeContext";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // const { darkMode } = useDarkMode();
  // console.log("darkMode:" + darkMode);

  return (
    <>
      {/* set bg-black if darkmode is true bg-white if darkmode is false */}
      <div className="grid grid-cols-7 w-full h-full">
        <div className="col-span-1">
          <InfoPanel />
        </div>
        <div className="col-span-4 flex flex-col overflow-auto">{children}</div>
        <div className="col-span-2">
          <Chatbox />
        </div>
      </div>
    </>
  );
}
