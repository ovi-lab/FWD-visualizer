"use client";
import { useState } from "react";
import Chatbox from "../chat/page";
// import InfoPanel from "../../components/infoPanel";
import React from "react";
import ColorPicker from "@/app/components/ColorPicker";
import { DarkModeSwitch } from "@/app/components/DarkModeSwitch";
import { useDarkMode } from "@/app/contexts/DarkModeContext";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { darkMode } = useDarkMode();

  return (
    <>
      <div
        style={{ background: darkMode ? "#3C3C3C" : "white" }}
        className="grid grid-cols-7 w-full h-full"
      >
        <div className="col-span-1 ml-8 mt-5">
          {/* <InfoPanel /> */}
          <div>
            <ColorPicker />
          </div>
          <div className="mt-6">
            <DarkModeSwitch />
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
