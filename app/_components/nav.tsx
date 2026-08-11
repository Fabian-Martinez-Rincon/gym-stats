"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Resumen" },
  { href: "/entrenamientos", label: "Entrenamientos" },
  { href: "/progreso", label: "Progreso" },
  { href: "/cuerpo", label: "Cuerpo" },
  { href: "/cardio", label: "Cardio" },
  { href: "/asistencia", label: "Asistencia" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="scroll-fade-x flex items-center gap-1 overflow-x-auto">
      {LINKS.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition ${
              active
                ? "bg-(--brand) text-(--brand-foreground)"
                : "text-(--ink-dim) hover:bg-(--bg-sunken) hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
