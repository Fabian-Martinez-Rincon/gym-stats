"use client";

import { useEffect, useRef, useState } from "react";

export const NAV_LINKS = [
  { id: "resumen", label: "Resumen" },
  { id: "entrenamientos", label: "Entrenamientos" },
  { id: "progreso", label: "Progreso" },
  { id: "cuerpo", label: "Cuerpo" },
  { id: "cardio", label: "Cardio" },
  { id: "asistencia", label: "Asistencia" },
];

export function Nav() {
  const [active, setActive] = useState(NAV_LINKS[0].id);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });

  // Scrollspy: todas las secciones viven en la misma página ahora (ver
  // app/page.tsx), así que "sección activa" se decide por cuál está cruzando
  // la franja superior del viewport, no por ruta.
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b));
        setActive(topMost.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Indicador deslizante: mide la posición/ancho del link activo y anima un
  // pill de fondo hasta ahí (en vez de simplemente reemplazar la clase).
  useEffect(() => {
    const el = linkRefs.current[active];
    if (!el) return;
    setIndicator({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
  }, [active]);

  return (
    <nav className="scroll-fade-x relative flex items-center gap-1 overflow-x-auto">
      <span
        aria-hidden
        className="absolute inset-y-0 rounded-full bg-(--brand) transition-[transform,width] duration-300 ease-out"
        style={{
          width: indicator.width,
          transform: `translateX(${indicator.left}px)`,
          opacity: indicator.ready ? 1 : 0,
        }}
      />
      {NAV_LINKS.map((link) => (
        <a
          key={link.id}
          ref={(el) => {
            linkRefs.current[link.id] = el;
          }}
          href={`#${link.id}`}
          className={`relative z-10 shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            active === link.id ? "text-(--brand-foreground)" : "text-(--ink-dim) hover:text-foreground"
          }`}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
