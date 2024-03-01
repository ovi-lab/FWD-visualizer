"use client";
import Chatbox from "../../chat/page";
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid grid-cols-7 row data-row h-full">
      <div className="flex flex-col col-span-5 h-full overflow-auto">{children}</div>
      <Chatbox />
    </div>
  );
}
