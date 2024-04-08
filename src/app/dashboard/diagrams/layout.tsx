"use client";
import Chatbox from "../chat/page";
import InfoPanel from "../info/page";
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid grid-cols-7 row data-row">
      <InfoPanel />
      <div className="col-span-4 flex flex-col overflow-auto">{children}</div>
      <Chatbox />
      
    </div>
  );
}