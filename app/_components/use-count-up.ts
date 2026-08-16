"use client";

import { useEffect, useRef, useState } from "react";

// Anima "171" -> cuenta de 0 a 171, o "82%" -> 0% a 82%, la primera vez que
// el elemento entra en pantalla. Valores sin dígito inicial se muestran tal
// cual, sin animar.
export function useCountUp(value: string, durationMs = 900) {
  const ref = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const match = value.match(/^(-?\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1]) : null;
  // Preserva la cantidad de decimales del valor real (ej. "-0.5kg" o "76.7kg"):
  // redondear siempre a entero acá perdía el signo y los decimales (Math.round(-0.5) = -0 -> "0").
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0;
  const suffix = match ? match[2] : "";
  const [display, setDisplay] = useState(target === null ? value : `${(0).toFixed(decimals)}${suffix}`);

  useEffect(() => {
    if (target === null) {
      setDisplay(value);
      return;
    }
    if (startedRef.current) {
      setDisplay(value);
      return;
    }
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      startedRef.current = true;
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        const start = performance.now();
        function tick(now: number) {
          const t = Math.min(1, (now - start) / durationMs);
          const eased = 1 - Math.pow(1 - t, 3);
          const current = ((target as number) * eased).toFixed(decimals);
          setDisplay(`${current}${suffix}`);
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, target, suffix, decimals, durationMs]);

  return { ref, display };
}
