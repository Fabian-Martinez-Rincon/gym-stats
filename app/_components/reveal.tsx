"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// prefers-reduced-motion ya está cubierto globalmente (ver globals.css:
// transition-duration forzada a ~0), así que este componente no necesita
// chequearlo por separado — el fade-up simplemente pasa a ser instantáneo.
export function Reveal({ children, className = "", delayMs = 0 }: { children: ReactNode; className?: string; delayMs?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      // threshold 0 (no un %) a propósito: una sección larga nunca llega a
      // cubrir el 10% de SU PROPIA altura total desde una posición de
      // scroll normal, así que un threshold > 0 la deja invisible para
      // siempre. Basta con que un solo píxel entre en vista.
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delayMs}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}
