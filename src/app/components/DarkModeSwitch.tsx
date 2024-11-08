import { useState } from "react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useDarkModeHover } from "../contexts/DarkModeHoverContext";
import { useSelectedBackgroundColour } from "../contexts/SelectedBackgroundColourContext";
import { MoonIcon } from "./svgs/moon_icon";
import { SunIcon } from "./svgs/sun_icon";

const colors = [["White"], ["#e8efff"], ["#e5fff7"], ["#fffcea"], ["#fcedee"]];

export const DarkModeSwitch = () => {
  const { darkMode, setDarkMode } = useDarkMode();
  const { darkModeHover, setDarkModeHover } = useDarkModeHover();

  const darkModeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const { setSelectedBackgroundColour } = useSelectedBackgroundColour();
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState(
    colors[0]
  );

  const selectColorScheme = (scheme: string[]) => {
    setSelectedBackgroundColor(scheme);
    setSelectedBackgroundColour(scheme[0]);
  };
  const darkModeHoverOn = () => {
    if (!darkMode) setDarkModeHover(true);
  };

  const darkModeHoverOff = () => {
    if (!darkMode) setDarkModeHover(false);
  };

  return (
    <div className="flex relative z-10">
      <div
        className="flex"
        onMouseEnter={darkModeHoverOn}
        onMouseLeave={darkModeHoverOff}
        onClick={darkModeToggle}
      >
        <span
          className={`${
            darkMode ? "text-white" : "text-black"
          } pt-1 pr-2 whitespace-nowrap`}
        >
          Dark Mode
        </span>

        <div className="bg-cyan-100 rounded-md p-2 pl-2.5 pr-2.5 z-10">
          {darkMode ? (
            <MoonIcon className="mb-1" />
          ) : (
            <SunIcon className="mb-1" />
          )}
        </div>
      </div>

      {!darkMode && (
        <div
          className={`transform transition-all duration-[400ms] ${
            darkModeHover
              ? "translate-x-0 opacity-100 ease-in-out"
              : "-translate-x-8 opacity-0 pointer-events-none ease-in-out"
          } w-fit`}
          onMouseEnter={darkModeHoverOn}
          onMouseLeave={darkModeHoverOff}
        >
          <div className="flex gap-2 border border-gray-300 rounded-md bg-white p-1.5">
            {colors.map((scheme, index) => (
              <div
                key={index}
                onClick={() => selectColorScheme(scheme)}
                className={`flex items-center gap-1 p-1 cursor-pointer rounded-sm ${
                  scheme === selectedBackgroundColor
                    ? "border-1.5 border-gray-500"
                    : "border border-gray-300"
                }`}
                style={{
                  backgroundColor: scheme[0] === "White" ? "#fff" : scheme[0],
                }}
              >
                {scheme.map((color, i) => (
                  <span
                    key={i}
                    className="inline-block w-2 h-2"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
