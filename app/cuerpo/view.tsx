"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BodyMetric } from "@/lib/gym";
import { computeWeightTrend, todayStr, weightDelta } from "@/lib/stats";
import { Button, Card, EmptyState, Field, StatTile, inputClass } from "@/app/_components/ui";
import { LineChart } from "@/components/charts/LineChart";

const EMPTY_FORM = { date: todayStr(), weightKg: "", bodyFatPct: "", chestCm: "", waistCm: "", hipsCm: "", armCm: "", thighCm: "" };

export function CuerpoView({ metrics }: { metrics: BodyMetric[] }) {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const weightPoints = computeWeightTrend(metrics);
  const delta30 = weightDelta(weightPoints, 30);
  const latest = weightPoints[weightPoints.length - 1];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/body", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo guardar.");
      setForm({ ...EMPTY_FORM, date: form.date });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/body/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile label="Peso actual" value={latest ? `${latest.weightKg}kg` : "—"} sub={latest ? fmt(latest.date) : undefined} />
        <StatTile label="Cambio (30 días)" value={delta30 === null ? "—" : `${delta30 > 0 ? "+" : ""}${delta30.toFixed(1)}kg`} />
        <StatTile label="Registros totales" value={String(metrics.length)} />
      </div>

      <Card title="Peso corporal">
        <LineChart data={weightPoints.map((p) => ({ label: fmtShort(p.date), value: p.weightKg }))} valueFormat={(v) => `${v.toFixed(1)}kg`} emptyMessage="Cargá tu peso para ver la evolución." />
      </Card>

      <Card title="Nuevo registro">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Field label="Fecha">
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} required />
            </Field>
            <Field label="Peso (kg)">
              <input type="number" step={0.1} min={0} value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: e.target.value })} className={inputClass} />
            </Field>
            <Field label="% grasa">
              <input type="number" step={0.1} min={0} value={form.bodyFatPct} onChange={(e) => setForm({ ...form, bodyFatPct: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Pecho (cm)">
              <input type="number" step={0.1} min={0} value={form.chestCm} onChange={(e) => setForm({ ...form, chestCm: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Cintura (cm)">
              <input type="number" step={0.1} min={0} value={form.waistCm} onChange={(e) => setForm({ ...form, waistCm: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Cadera (cm)">
              <input type="number" step={0.1} min={0} value={form.hipsCm} onChange={(e) => setForm({ ...form, hipsCm: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Brazo (cm)">
              <input type="number" step={0.1} min={0} value={form.armCm} onChange={(e) => setForm({ ...form, armCm: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Muslo (cm)">
              <input type="number" step={0.1} min={0} value={form.thighCm} onChange={(e) => setForm({ ...form, thighCm: e.target.value })} className={inputClass} />
            </Field>
          </div>
          {error && <p className="text-sm text-(--danger)">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-fit">
            {submitting ? "Guardando…" : "Guardar registro"}
          </Button>
        </form>
      </Card>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">Historial ({metrics.length})</h3>
        {metrics.length === 0 ? (
          <EmptyState>Todavía no cargaste ningún registro corporal.</EmptyState>
        ) : (
          <div className="scroll-fade-x overflow-x-auto rounded-(--radius) border border-(--line)">
            <table className="w-full text-left text-sm">
              <thead className="bg-(--bg-sunken) text-xs text-(--ink-faint)">
                <tr>
                  <th className="px-3 py-2 font-medium">Fecha</th>
                  <th className="px-3 py-2 font-medium">Peso</th>
                  <th className="px-3 py-2 font-medium">% grasa</th>
                  <th className="px-3 py-2 font-medium">Pecho</th>
                  <th className="px-3 py-2 font-medium">Cintura</th>
                  <th className="px-3 py-2 font-medium">Cadera</th>
                  <th className="px-3 py-2 font-medium">Brazo</th>
                  <th className="px-3 py-2 font-medium">Muslo</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {metrics.map((m) => (
                  <tr key={m.id} className="border-t border-(--line)">
                    <td className="px-3 py-2 whitespace-nowrap">{fmt(m.date)}</td>
                    <td className="px-3 py-2 tabular-nums">{m.weightKg ?? "—"}</td>
                    <td className="px-3 py-2 tabular-nums">{m.bodyFatPct ?? "—"}</td>
                    <td className="px-3 py-2 tabular-nums">{m.chestCm ?? "—"}</td>
                    <td className="px-3 py-2 tabular-nums">{m.waistCm ?? "—"}</td>
                    <td className="px-3 py-2 tabular-nums">{m.hipsCm ?? "—"}</td>
                    <td className="px-3 py-2 tabular-nums">{m.armCm ?? "—"}</td>
                    <td className="px-3 py-2 tabular-nums">{m.thighCm ?? "—"}</td>
                    <td className="px-3 py-2 text-right">
                      <button disabled={deletingId === m.id} onClick={() => handleDelete(m.id)} className="rounded px-2 py-1.5 text-xs text-(--ink-faint) transition hover:bg-(--danger-bg) hover:text-(--danger)">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
