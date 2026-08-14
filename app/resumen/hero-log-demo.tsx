"use client";

import { useState } from "react";
import { BarChart } from "@/components/charts/BarChart";

// Sandbox 100% client-side: nunca toca data/gym.json. Deja probar el "loop"
// central de la app (cargar una serie -> verla reflejada en un gráfico) sin
// depender de que ya haya datos reales cargados (a diferencia de Inglés,
// acá no hay contenido real para mostrar en un demo hasta que el usuario
// empiece a usar la app de verdad).
const INITIAL = [
  { label: "Serie 1", value: 60 },
  { label: "Serie 2", value: 65 },
  { label: "Serie 3", value: 62.5 },
];

export function HeroLogDemo() {
  const [sets, setSets] = useState(INITIAL);

  function addSet() {
    const last = sets[sets.length - 1]?.value ?? 60;
    const next = Math.max(20, Math.round((last + (Math.random() * 15 - 5)) * 2) / 2);
    setSets((prev) => [...prev, { label: `Serie ${prev.length + 1}`, value: next }]);
  }

  return (
    <div className="w-full max-w-[19rem] shrink-0 rounded-(--radius) border border-(--line) bg-(--bg-elevated) p-4 shadow-(--shadow)">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-foreground">Press de banca — kg por serie</span>
        <button
          type="button"
          onClick={addSet}
          className="shrink-0 rounded-full bg-(--brand) px-2.5 py-1 text-xs font-medium text-(--brand-foreground) transition hover:opacity-90"
        >
          + Serie
        </button>
      </div>
      <BarChart data={sets} valueFormat={(v) => `${v}`} height={120} />
      <p className="mt-2 text-center text-xs text-(--ink-faint)">Así se ve tu progreso — probá agregar una serie.</p>
    </div>
  );
}
