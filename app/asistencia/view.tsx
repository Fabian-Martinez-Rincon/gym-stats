"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { GymVisit } from "@/lib/gym";
import type { AttendanceDay, StreakInfo, WeekBucket } from "@/lib/stats";
import { todayStr } from "@/lib/stats";
import { Button, Card, EmptyState, StatTile, inputClass } from "@/app/_components/ui";
import { BarChart } from "@/components/charts/BarChart";
import { Heatmap } from "@/components/charts/Heatmap";

export function AsistenciaView({
  streaks,
  weekly,
  grid,
  visits,
  checkedInToday,
}: {
  streaks: StreakInfo;
  weekly: WeekBucket[];
  grid: AttendanceDay[];
  visits: GymVisit[];
  checkedInToday: boolean;
}) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCheckIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: todayStr(), notes: note }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo registrar.");
      setNote("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/visits/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
        <StatTile label="Racha actual" value={`${streaks.current} día${streaks.current === 1 ? "" : "s"}`} />
        <StatTile label="Racha más larga" value={`${streaks.longest} día${streaks.longest === 1 ? "" : "s"}`} />
      </div>

      <Card title="Marcar asistencia de hoy">
        {checkedInToday ? (
          <p className="text-sm text-(--success)">Ya registraste actividad hoy. ¡Bien ahí!</p>
        ) : (
          <form onSubmit={handleCheckIn} className="flex flex-wrap items-end gap-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Nota opcional (ej. movilidad, elongación)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={`${inputClass} w-full`}
              />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Guardando…" : "Marcar asistencia de hoy"}
            </Button>
          </form>
        )}
        {error && <p className="mt-2 text-sm text-(--danger)">{error}</p>}
        <p className="mt-2 text-xs text-(--ink-faint)">Usá esto para días que fuiste pero no cargaste un entrenamiento o cardio (ej. solo movilidad).</p>
      </Card>

      <Card title="Días activos por semana">
        <BarChart data={weekly.map((w) => ({ label: w.label, value: w.days }))} valueFormat={(v) => `${Math.round(v)}`} />
      </Card>

      <Card title="Calendario de actividad">
        <Heatmap days={grid} />
      </Card>

      {visits.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-foreground">Asistencias rápidas ({visits.length})</h2>
          <div className="flex flex-col gap-2">
            {visits.map((v) => (
              <Card key={v.id}>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm font-medium text-foreground">{fmt(v.date)}</div>
                    {v.notes && <div className="text-xs text-(--ink-faint)">{v.notes}</div>}
                  </div>
                  <Button variant="danger" disabled={deletingId === v.id} onClick={() => handleDelete(v.id)}>
                    Eliminar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
      {visits.length === 0 && <EmptyState>No hay asistencias rápidas registradas todavía.</EmptyState>}
    </div>
  );
}

function fmt(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
