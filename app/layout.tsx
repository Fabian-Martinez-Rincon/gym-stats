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

function BarbellIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-6 w-6 shrink-0 text-(--brand)">
      <path
        d="M2 10.5v3M5 8v8M8 12h8M19 8v8M22 10.5v3"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
    <html
      lang="es"
      data-theme="light"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <head>
        <meta id="theme-color-meta" name="theme-color" content="#fbfcfd" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* next/font/google vía Turbopack no resuelve su loader interno en este entorno
            (paquete @vercel/turbopack-next ausente) — se carga como <link> normal en el
            único layout raíz de la app (App Router), así que el warning de la regla
            no-page-custom-font (pensada para el Pages Router) no aplica acá. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap" />
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
            <div className="flex items-center gap-2">
              <BarbellIcon />
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold text-foreground">Mi Gym</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-(--ink-faint)">Estadísticas</span>
              </div>
            </div>
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
