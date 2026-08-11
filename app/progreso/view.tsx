"use client";

import { useMemo, useState } from "react";
import type { Workout } from "@/lib/gym";
import { computeExerciseHistory } from "@/lib/stats";
import { Card, StatTile } from "@/app/_components/ui";
import { LineChart } from "@/components/charts/LineChart";

type Metric = "maxWeight" | "estOneRM" | "volume";

const METRICS: { key: Metric; label: string; unit: string }[] = [
  { key: "maxWeight", label: "Peso máximo", unit: "kg" },
  { key: "estOneRM", label: "1RM estimado", unit: "kg" },
  { key: "volume", label: "Volumen de la sesión", unit: "kg" },
];

export function ProgresoView({ workouts, exerciseNames }: { workouts: Workout[]; exerciseNames: string[] }) {
  const [exercise, setExercise] = useState(exerciseNames[0]);
  const [metric, setMetric] = useState<Metric>("maxWeight");

  const history = useMemo(() => computeExerciseHistory(workouts, exercise), [workouts, exercise]);

  const chartData = history.map((h) => ({
    label: new Date(`${h.date}T00:00:00`).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }),
    value: Math.round(h[metric] * 10) / 10,
  }));

  const best = history.reduce((acc, h) => (h.maxWeight > acc.maxWeight ? h : acc), history[0]);
  const bestOneRM = history.reduce((acc, h) => (h.estOneRM > acc.estOneRM ? h : acc), history[0]);
  const last = history[history.length - 1];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          className="rounded-md border border-(--line) bg-(--bg-elevated) px-3 py-1.5 text-sm font-medium text-foreground outline-none focus:border-(--brand)"
        >
          {exerciseNames.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <div className="flex gap-1">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                metric === m.key ? "bg-(--brand) text-(--brand-foreground)" : "border border-(--line) text-(--ink-dim) hover:text-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Récord de peso" value={best ? `${best.maxWeight}kg` : "—"} sub={best ? `x${best.bestSetReps} · ${fmt(best.date)}` : undefined} />
        <StatTile label="Mejor 1RM estimado" value={bestOneRM ? `${Math.round(bestOneRM.estOneRM)}kg` : "—"} sub={bestOneRM ? fmt(bestOneRM.date) : undefined} />
        <StatTile label="Sesiones registradas" value={String(history.length)} />
        <StatTile label="Última sesión" value={last ? `${last.maxWeight}kg` : "—"} sub={last ? fmt(last.date) : undefined} />
      </div>

      <Card title={`${METRICS.find((m) => m.key === metric)?.label} — ${exercise}`}>
        <LineChart data={chartData} valueFormat={(v) => `${Math.round(v)}kg`} />
      </Card>
    </div>
  );
}

function fmt(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
