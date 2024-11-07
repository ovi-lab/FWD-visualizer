"use client";
import { useState } from "react";
import Chatbox from "../chat/page";
// import InfoPanel from "../../components/infoPanel";
import React from "react";
<<<<<<< HEAD
=======
import ColorPicker from "@/app/components/ColorPicker";
import { DarkModeSwitch } from "@/app/components/DarkModeSwitch";
>>>>>>> b892bcf6d800f292edb193456d7d36caa99719d0
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
        <div className="col-span-1">
          {/* <InfoPanel /> */}
          <div className="ml-3 mt-2">
            <ColorPicker />
          </div>
          <div className="ml-3 mt-6">
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
