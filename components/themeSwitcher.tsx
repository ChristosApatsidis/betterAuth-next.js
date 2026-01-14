// components/themeSwitcher.tsx
"use client";
import { useTheme } from "./ThemeContext";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

export default function ThemeSwitcher(props: { 
  text?: string, 
  size?: number,
  className?: string
}) {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(theme === "black" ? "light" : "black");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`cursor-pointer rounded ${props.className || ""}`}
      aria-label="Toggle Theme"
    >
      {theme === "black" ? (
        <MdOutlineLightMode size={props.size || 12} />
      ) : (
        <MdOutlineDarkMode size={props.size || 12} />
      )}
      {props.text && <span>{props.text}</span>}
    </button>

  );
}