import type { Metadata } from "next";
import { ThemeToggle } from "./_components/theme-toggle";
import { Nav } from "./_components/nav";
import { InlineScript } from "./_components/inline-script";
import { Decor } from "./_components/decor";
import { CommandPalette, CommandPaletteButton } from "./_components/command-palette";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estadísticas del gimnasio",
  description: "Tu rendimiento en el gimnasio, en un solo lugar.",
};

const THEME_INIT_SCRIPT = `
  try {
    var t = localStorage.getItem("theme");
    var d = t === "light" || t === "dark" ? t : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", d);
    var m = document.getElementById("theme-color-meta");
    if (m) m.setAttribute("content", d === "dark" ? "#1a1a1e" : "#fbfcfd");
  } catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" data-theme="light" suppressHydrationWarning className="h-full antialiased">
      <head>
        <meta id="theme-color-meta" name="theme-color" content="#fbfcfd" />
        <InlineScript html={THEME_INIT_SCRIPT} />
      </head>
      <body className="relative flex min-h-full flex-col bg-background">
        <a
          href="#main-content"
          className="sr-only rounded-md bg-(--brand) px-3 py-2 text-sm font-medium text-(--brand-foreground) focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
        >
          Saltar al contenido
        </a>
        <Decor />
        <CommandPalette />
        <header className="sticky top-0 z-20 border-b border-(--line) bg-(--bg-elevated)">
          <div className="flex flex-wrap items-center gap-3 px-3 py-2 lg:px-4">
            <b className="text-lg font-extrabold text-foreground">🏋️ Mi gimnasio</b>
            <Nav />
            <div className="ml-auto flex items-center gap-2">
              <CommandPaletteButton />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="relative flex-1 outline-none">
          {children}
        </main>

        <footer className="relative border-t border-(--line) bg-(--bg-elevated) px-3 py-6 text-center text-xs text-(--ink-faint) lg:px-4">
          <p>Proyecto personal — entrenamientos, cardio, medidas corporales y asistencia, con récords y progreso calculados al vuelo.</p>
          <p className="mt-1">Next.js 16 · React 19 · Tailwind CSS v4 · TypeScript</p>
        </footer>
      </body>
    </html>
  );
}
