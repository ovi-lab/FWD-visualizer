import { SunIcon } from "./svgs/sun_icon";
import { MoonIcon } from "./svgs/moon_icon";
import { useDarkMode } from "../contexts/DarkModeContext";

export const DarkModeSwitch = () => {
  const { darkMode, setDarkMode } = useDarkMode();

  // Helper function to toggle the dark mode based on the current state
  const darkModeToggle = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className="flex" onClick={darkModeToggle}>
      <span className={`${darkMode ? "text-white" : "text-black"} pt-1 pr-2`}>
        DarkMode
      </span>
      {/* Render icons based on darkMode state */}
      <div className="bg-stone-200 rounded-md p-2 pb-1">
        {darkMode ? (
          <MoonIcon className="mb-1" />
        ) : (
          <SunIcon className="mb-1" />
        )}
      </div>
    </div>
  );
};
