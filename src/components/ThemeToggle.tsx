"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="fixed top-4 right-4 z-50 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm transition-colors cursor-pointer"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
