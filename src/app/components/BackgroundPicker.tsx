import { useDarkMode } from "../contexts/DarkModeContext";
import { useDarkModeHover } from "../contexts/DarkModeHoverContext";
import { useSelectedBackgroundColour } from "../contexts/SelectedBackgroundColourContext";
import { MoonIcon } from "./svgs/moon_icon";
import { SunIcon } from "./svgs/sun_icon";

// Define color option array
const colors = ["White", "#e8efff", "#e5fff7", "#fffcea", "#fcedee"];

export const BackgroundPicker = () => {
  // Keep track of darkmode setting and pass to other components
  const { darkMode, setDarkMode } = useDarkMode();
  // Keep track of whether dark mode switch is hovered
  const { darkModeHover, setDarkModeHover } = useDarkModeHover();
  // Handle dark mode switch toggle
  const darkModeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Keep track of selectedBackgroundColour
  const { selectedBackgroundColour, setSelectedBackgroundColour } =
    useSelectedBackgroundColour();

  return (
    <div className="flex relative z-10">
      <div className="flex" onClick={darkModeToggle}>
        <span
          className={`${
            darkMode ? "text-white" : "text-grey500"
          } pt-1 pr-2 whitespace-nowrap`}
        >
          Backdrop Theme
        </span>

        {/* Dark mode switch */}
        <div
          className="bg-cyan-100 rounded-md p-2 pl-2.5 pr-2.5 z-10"
          onMouseEnter={() => setDarkModeHover(true)}
          onMouseLeave={() => setDarkModeHover(false)}
        >
          {darkMode ? (
            <MoonIcon className="mb-1" />
          ) : (
            <SunIcon className="mb-1" />
          )}
        </div>
      </div>

      {/* Background colour option ui is shown only when dark mode is off upon mouse hover */}
      {!darkMode && (
        // Colour container
        <div
          className={`transform transition-all duration-[400ms] ${
            darkModeHover
              ? "translate-x-0 opacity-100 ease-in-out"
              : "-translate-x-8 opacity-0 pointer-events-none ease-in-out"
          } w-fit`}
          onMouseEnter={() => setDarkModeHover(true)}
          onMouseLeave={() => setDarkModeHover(false)}
        >
          {/* Colour blcoks */}
          <div className="flex gap-2 border border-gray-300 rounded-md bg-white p-1.5">
            {colors.map((scheme, index) => (
              <div
                key={index}
                onClick={() => setSelectedBackgroundColour(scheme)}
                className={`flex items-center gap-1 p-2 cursor-pointer rounded-sm ${
                  scheme === selectedBackgroundColour
                    ? "border-[1.5px] border-gray-400"
                    : "border border-gray-300"
                }`}
                style={{
                  backgroundColor: scheme,
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
