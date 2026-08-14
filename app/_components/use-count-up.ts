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
  const suffix = match ? match[2] : "";
  const [display, setDisplay] = useState(target === null ? value : `0${suffix}`);

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
          const current = Math.round((target as number) * eased);
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
  }, [value, target, suffix, durationMs]);

  return { ref, display };
}
