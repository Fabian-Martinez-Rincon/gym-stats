"use client";

import { useState } from "react";
import type { CardioSession } from "@/lib/gym";
import { computeCardioTotals, todayStr } from "@/lib/stats";
import { Button, Card, EmptyState, Field, StatTile, inputClass } from "@/app/_components/ui";
import { LineChart } from "@/components/charts/LineChart";

function emptyForm(type: string) {
  return { date: todayStr(), type, durationMin: "", distanceKm: "", calories: "", notes: "" };
}

export function CardioView({ initialSessions, cardioTypes }: { initialSessions: CardioSession[]; cardioTypes: string[] }) {
  const [sessions, setSessions] = useState(initialSessions);
  const [form, setForm] = useState(emptyForm(cardioTypes[0]));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const totals30 = computeCardioTotals(sessions, 30);
  const chartData = [...sessions]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-20)
    .map((s) => ({ label: fmtShort(s.date), value: s.durationMin }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/cardio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo guardar.");
      setSessions((prev) => [json.session, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
      setForm(emptyForm(form.type));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const prev = sessions;
    setSessions((s) => s.filter((x) => x.id !== id));
    const res = await fetch(`/api/cardio/${id}`, { method: "DELETE" });
    if (!res.ok) setSessions(prev);
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile label="Sesiones (30 días)" value={String(totals30.sessionCount)} />
        <StatTile label="Minutos (30 días)" value={String(totals30.durationMin)} />
        <StatTile label="Km (30 días)" value={totals30.distanceKm.toFixed(1)} />
      </div>

      <Card title="Duración por sesión">
        <LineChart data={chartData} valueFormat={(v) => `${Math.round(v)}min`} emptyMessage="Cargá una sesión de cardio para ver el gráfico." />
      </Card>

      <Card title="Nueva sesión">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <Field label="Fecha">
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} required />
            </Field>
            <Field label="Tipo">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>
                {cardioTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Duración (min)">
              <input type="number" min={1} value={form.durationMin} onChange={(e) => setForm({ ...form, durationMin: e.target.value })} className={inputClass} required />
            </Field>
            <Field label="Distancia (km)">
              <input type="number" step={0.01} min={0} value={form.distanceKm} onChange={(e) => setForm({ ...form, distanceKm: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Calorías">
              <input type="number" min={0} value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} className={inputClass} />
            </Field>
          </div>
          <Field label="Notas (opcional)">
            <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputClass} />
          </Field>
          {error && <p className="text-sm text-(--danger)">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-fit">
            {submitting ? "Guardando…" : "Guardar sesión"}
          </Button>
        </form>
      </Card>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-foreground">Historial ({sessions.length})</h2>
        {sessions.length === 0 ? (
          <EmptyState>Todavía no cargaste ninguna sesión de cardio.</EmptyState>
        ) : (
          <div className="flex flex-col gap-2">
            {sessions.map((s) => (
              <Card key={s.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {s.type} · {fmt(s.date)}
                    </div>
                    <div className="text-xs text-(--ink-faint)">
                      {s.durationMin} min{s.distanceKm ? ` · ${s.distanceKm}km` : ""}
                      {s.calories ? ` · ${s.calories}kcal` : ""}
                    </div>
                    {s.notes && <p className="mt-1 text-xs text-(--ink-faint) italic">{s.notes}</p>}
                  </div>
                  <Button variant="danger" disabled={deletingId === s.id} onClick={() => handleDelete(s.id)}>
                    Eliminar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function fmt(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function fmtShort(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
}
