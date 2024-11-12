"use client";
import Chatbox from "../chat/page";
import React from "react";
import ColorPicker from "@/app/components/ColorPicker";
import { BackgroundPicker } from "@/app/components/BackgroundPicker";
import { useDarkMode } from "@/app/contexts/DarkModeContext";
import { useSelectedBackgroundColour } from "@/app/contexts/SelectedBackgroundColourContext";
import Legend from "@/app/components/Legend";
import { usePathname } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { darkMode } = useDarkMode();
  const { selectedBackgroundColour } = useSelectedBackgroundColour();

  const pathname = usePathname(); // Getting the current URL using usePathname from next/navigation library
  const isFerrisWheelPage = pathname.includes("/ferris-wheel");

  return (
    <>
      <div
        style={{
          background: darkMode
            ? "#3C3C3C"
            : selectedBackgroundColour
            ? selectedBackgroundColour
            : "white",
        }}
        className="grid grid-cols-7 w-full h-full"
      >
        <div className="col-span-1 ml-8 mt-5">
          <div className="z-10">
            <BackgroundPicker />
          </div>
          <div className="mt-2">
            <ColorPicker />
          </div>
          {isFerrisWheelPage && (
            <div className="mt-5">
              <Legend />
            </div>
          )}
        </div>
        <div className="col-span-4 flex flex-col overflow-auto">{children}</div>
        <div className="col-span-2">
          <Chatbox />
        </div>
      </div>
    </>
  );
}
