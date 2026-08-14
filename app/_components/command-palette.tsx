"use client";

import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "./nav";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = NAV_LINKS.filter((link) => link.label.toLowerCase().includes(query.trim().toLowerCase()));

  function openPalette() {
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
        return;
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("open-command-palette", openPalette);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-command-palette", openPalette);
    };
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function go(id: string) {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 px-4 pt-[15vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Ir a…"
        className="w-full max-w-md overflow-hidden rounded-(--radius) border border-(--line) bg-(--bg-elevated) shadow-(--shadow)"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((i) => Math.min(i + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter" && results[activeIndex]) {
              e.preventDefault();
              go(results[activeIndex].id);
            }
          }}
          placeholder="Ir a una sección…"
          className="w-full border-b border-(--line) bg-transparent px-4 py-3 text-sm text-foreground outline-none placeholder:text-(--ink-faint)"
        />
        <ul className="max-h-72 overflow-y-auto p-1.5">
          {results.length === 0 && <li className="px-3 py-2 text-sm text-(--ink-faint)">Sin resultados.</li>}
          {results.map((link, i) => (
            <li key={link.id}>
              <button
                type="button"
                onClick={() => go(link.id)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition ${
                  i === activeIndex ? "bg-(--brand) text-(--brand-foreground)" : "text-(--ink-dim)"
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function CommandPaletteButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
      className="hidden items-center gap-1.5 rounded-full border border-(--line) px-3 py-1.5 text-xs font-medium text-(--ink-faint) transition hover:border-(--line-strong) hover:text-foreground sm:inline-flex"
    >
      Ir a…
      <kbd className="rounded border border-(--line) bg-(--bg-sunken) px-1 py-0.5 font-mono text-[10px] leading-none">Ctrl K</kbd>
    </button>
  );
}
