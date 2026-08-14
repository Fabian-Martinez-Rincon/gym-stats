"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Workout } from "@/lib/gym";
import { todayStr, workoutVolume } from "@/lib/stats";
import { Button, Card, EmptyState, Field, inputClass } from "@/app/_components/ui";

interface DraftSet {
  reps: string;
  weightKg: string;
}
interface DraftExercise {
  name: string;
  sets: DraftSet[];
}

function emptyExercise(): DraftExercise {
  return { name: "", sets: [{ reps: "", weightKg: "" }] };
}

export function EntrenamientosView({ workouts, knownExercises }: { workouts: Workout[]; knownExercises: string[] }) {
  const router = useRouter();
  const [date, setDate] = useState(todayStr());
  const [exercises, setExercises] = useState<DraftExercise[]>([emptyExercise()]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function updateExercise(i: number, patch: Partial<DraftExercise>) {
    setExercises((prev) => prev.map((ex, idx) => (idx === i ? { ...ex, ...patch } : ex)));
  }
  function updateSet(exIdx: number, setIdx: number, patch: Partial<DraftSet>) {
    setExercises((prev) =>
      prev.map((ex, idx) =>
        idx === exIdx ? { ...ex, sets: ex.sets.map((s, si) => (si === setIdx ? { ...s, ...patch } : s)) } : ex
      )
    );
  }
  function addSet(exIdx: number) {
    setExercises((prev) => prev.map((ex, idx) => (idx === exIdx ? { ...ex, sets: [...ex.sets, { reps: "", weightKg: "" }] } : ex)));
  }
  function removeSet(exIdx: number, setIdx: number) {
    setExercises((prev) => prev.map((ex, idx) => (idx === exIdx ? { ...ex, sets: ex.sets.filter((_, si) => si !== setIdx) } : ex)));
  }
  function addExercise() {
    setExercises((prev) => [...prev, emptyExercise()]);
  }
  function removeExercise(i: number) {
    setExercises((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payloadExercises = exercises
      .map((ex) => ({
        name: ex.name.trim(),
        sets: ex.sets
          .filter((s) => s.reps !== "" && s.weightKg !== "")
          .map((s) => ({ reps: Number(s.reps), weightKg: Number(s.weightKg) })),
      }))
      .filter((ex) => ex.name && ex.sets.length > 0);

    if (payloadExercises.length === 0) {
      setError("Agregá al menos un ejercicio con una serie completa (reps y peso).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, exercises: payloadExercises, notes }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No se pudo guardar.");
      setExercises([emptyExercise()]);
      setNotes("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/workouts/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    setDeletingId(null);
  }

  return (
    <div className="flex flex-col gap-5">
      <Card title="Nuevo entrenamiento">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
            <Field label="Fecha">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
            </Field>
          </div>

          <div className="flex flex-col gap-3">
            {exercises.map((ex, exIdx) => (
              <div key={exIdx} className="rounded-(--radius) border border-(--line) bg-(--bg-sunken) p-3">
                <div className="mb-2 flex items-center gap-2">
                  <input
                    list="exercise-names"
                    value={ex.name}
                    onChange={(e) => updateExercise(exIdx, { name: e.target.value })}
                    placeholder="Nombre del ejercicio"
                    className={`${inputClass} flex-1`}
                  />
                  {exercises.length > 1 && (
                    <Button type="button" variant="danger" onClick={() => removeExercise(exIdx)}>
                      Quitar
                    </Button>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  {ex.sets.map((s, setIdx) => (
                    <div key={setIdx} className="flex items-center gap-2">
                      <span className="w-14 shrink-0 text-xs text-(--ink-faint)">Serie {setIdx + 1}</span>
                      <input
                        type="number"
                        min={1}
                        placeholder="Reps"
                        value={s.reps}
                        onChange={(e) => updateSet(exIdx, setIdx, { reps: e.target.value })}
                        className={`${inputClass} w-20`}
                      />
                      <span className="text-xs text-(--ink-faint)">x</span>
                      <input
                        type="number"
                        min={0}
                        step={0.5}
                        placeholder="Kg"
                        value={s.weightKg}
                        onChange={(e) => updateSet(exIdx, setIdx, { weightKg: e.target.value })}
                        className={`${inputClass} w-20`}
                      />
                      <span className="text-xs text-(--ink-faint)">kg</span>
                      {ex.sets.length > 1 && (
                        <button type="button" onClick={() => removeSet(exIdx, setIdx)} className="ml-1 text-xs text-(--ink-faint) hover:text-(--danger)">
                          Quitar
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addSet(exIdx)} className="mt-1 w-fit text-xs font-medium text-(--brand) hover:underline">
                    + Agregar serie
                  </button>
                </div>
              </div>
            ))}
            <datalist id="exercise-names">
              {knownExercises.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
            <button type="button" onClick={addExercise} className="w-fit text-sm font-medium text-(--brand) hover:underline">
              + Agregar ejercicio
            </button>
          </div>

          <Field label="Notas (opcional)">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={inputClass} placeholder="Cómo te sentiste, RPE, etc." />
          </Field>

          {error && <p className="text-sm text-(--danger)">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-fit">
            {submitting ? "Guardando…" : "Guardar entrenamiento"}
          </Button>
        </form>
      </Card>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-foreground">Historial ({workouts.length})</h3>
        {workouts.length === 0 ? (
          <EmptyState>Todavía no cargaste ningún entrenamiento.</EmptyState>
        ) : (
          <div className="flex flex-col gap-2">
            {workouts.map((w) => (
              <Card key={w.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {new Date(`${w.date}T00:00:00`).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })}
                    </div>
                    <div className="text-xs text-(--ink-faint)">Volumen total: {workoutVolume(w).toLocaleString("es-AR")} kg</div>
                  </div>
                  <Button variant="danger" disabled={deletingId === w.id} onClick={() => handleDelete(w.id)}>
                    Eliminar
                  </Button>
                </div>
                <ul className="mt-2 flex flex-col gap-1">
                  {w.exercises.map((ex, i) => (
                    <li key={i} className="text-sm text-(--ink-dim)">
                      <span className="font-medium text-foreground">{ex.name}</span>{" "}
                      {ex.sets.map((s, si) => (
                        <span key={si} className="text-(--ink-faint)">
                          {si > 0 && " · "}
                          {s.reps}x{s.weightKg}kg
                        </span>
                      ))}
                    </li>
                  ))}
                </ul>
                {w.notes && <p className="mt-2 text-xs text-(--ink-faint) italic">{w.notes}</p>}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
