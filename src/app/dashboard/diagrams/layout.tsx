"use client";
import Chatbox from "../chat/page";
import InfoPanel from "../info/page";
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid grid-cols-7 row data-row h-full">
      <InfoPanel />
      <div className="flex flex-col col-span-4 h-full overflow-auto">{children}</div>
      <Chatbox />
    </div>
  );
}
