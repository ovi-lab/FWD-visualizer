"use client";
import { useState } from "react";
import Chatbox from "../chat/page";
// import InfoPanel from "../../components/infoPanel";
import React from "react";
import ColorPicker from "@/app/components/ColorPicker";
import { DarkModeSwitch } from "@/app/components/DarkModeSwitch";
import { useDarkMode } from "@/app/contexts/DarkModeContext";
import BackgroundColorPicker from "@/app/components/BackgroundColorPicker";
import { useSelectedBackgroundColour } from "@/app/contexts/SelectedBackgroundColourContext";
import { useDarkModeHover } from "@/app/contexts/DarkModeHoverContext";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { darkMode } = useDarkMode();
  const { selectedBackgroundColour } = useSelectedBackgroundColour();

  const { darkModeHover } = useDarkModeHover();

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
            <DarkModeSwitch />
          </div>
          <div className="mt-2">
            <ColorPicker />
          </div>
        </div>
        <div className="col-span-4 flex flex-col overflow-auto">{children}</div>
        <div className="col-span-2">
          <Chatbox />
        </div>
      </div>
    </>
  );
}
