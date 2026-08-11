"use client";

import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

function subscribe(callback: () => void) {
  window.addEventListener("theme-change", callback);
  return () => window.removeEventListener("theme-change", callback);
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function getServerSnapshot(): Theme {
  return "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem("theme", next);
    window.dispatchEvent(new Event("theme-change"));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center rounded-full border border-(--line) px-3 py-1.5 text-xs font-medium text-(--ink-dim) transition hover:border-(--line-strong) hover:text-foreground"
    >
      {theme === "dark" ? "Modo claro" : "Modo oscuro"}
    </button>
  );
}
