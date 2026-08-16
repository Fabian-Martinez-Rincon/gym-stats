"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { GymVisit } from "@/lib/gym";
import type { AttendanceDay, StreakInfo, WeekBucket } from "@/lib/stats";
import { todayStr } from "@/lib/stats";
import { Button, Card, EmptyState, IconCircle, StatTile, inputClass } from "@/app/_components/ui";
import { BarChart } from "@/components/charts/BarChart";
import { Heatmap } from "@/components/charts/Heatmap";

function CalendarCheckIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5">
      <rect x="3.5" y="4.5" width="17" height="16" rx="2" stroke="currentColor" strokeWidth={1.75} />
      <path d="M3.5 9h17M8 3v3M16 3v3" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
      <path d="m8.5 13.5 2 2 4-4.5" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
  const [visibleCount, setVisibleCount] = useState(8);

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
          <h3 className="mb-2 text-sm font-semibold text-foreground">Asistencias rápidas ({visits.length})</h3>
          <div className="flex flex-col gap-2">
            {visits.slice(0, visibleCount).map((v) => (
              <Card key={v.id} interactive className="group">
                <div className="flex items-center gap-3">
                  <IconCircle color="var(--accent-asistencia)">
                    <CalendarCheckIcon />
                  </IconCircle>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-medium text-foreground">{fmt(v.date)}</div>
                      {v.notes && <div className="text-xs text-(--ink-faint)">{v.notes}</div>}
                    </div>
                    <button
                      type="button"
                      disabled={deletingId === v.id}
                      onClick={() => handleDelete(v.id)}
                      className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-(--danger) opacity-100 transition-opacity hover:bg-(--danger-bg) disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {visibleCount < visits.length && (
            <Button type="button" variant="secondary" onClick={() => setVisibleCount((n) => n + 8)} className="mt-3 w-full">
              Mostrar {Math.min(8, visits.length - visibleCount)} más ({visits.length - visibleCount} restantes)
            </Button>
          )}
        </div>
      )}
      {visits.length === 0 && <EmptyState>No hay asistencias rápidas registradas todavía.</EmptyState>}
    </div>
  );
}

function fmt(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
