// components/ThemeContext.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "black" | "light";
type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mouted, setMouted] = useState<boolean>(false);
  const [theme, setThemeState] = useState<Theme>("black");
  
  useEffect(() => {
    setMouted(true);
  }, []);

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme) || "black";
    setThemeState(stored);
    document.documentElement.setAttribute("data-theme", stored);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {mouted && children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}