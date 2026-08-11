import type { Metadata } from "next";
import { ThemeToggle } from "./_components/theme-toggle";
import { Nav } from "./_components/nav";
import { InlineScript } from "./_components/inline-script";
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
  } catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" data-theme="light" suppressHydrationWarning className="h-full antialiased">
      <head>
        <InlineScript html={THEME_INIT_SCRIPT} />
      </head>
      <body className="flex min-h-full flex-col bg-background">
        <header className="sticky top-0 z-20 border-b border-(--line) bg-(--bg-elevated)">
          <div className="flex flex-wrap items-center gap-3 px-3 py-2 lg:px-4">
            <b className="text-lg font-extrabold text-foreground">🏋️ Mi gimnasio</b>
            <Nav />
            <div className="ml-auto flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
