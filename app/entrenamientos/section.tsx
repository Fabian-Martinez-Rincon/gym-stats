import { COMMON_EXERCISES, type GymData } from "@/lib/gym";
import { getExerciseNames } from "@/lib/stats";
import { EntrenamientosView } from "./view";

export function EntrenamientosSection({ data }: { data: GymData }) {
  const usedNames = getExerciseNames(data.workouts);
  const knownExercises = Array.from(new Set([...COMMON_EXERCISES, ...usedNames])).sort((a, b) => a.localeCompare(b, "es"));
  const workouts = [...data.workouts].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mx-auto max-w-4xl px-3 lg:px-4">
      <h2 className="mb-1 text-xl font-bold text-foreground">Entrenamientos</h2>
      <p className="mb-4 text-sm text-(--ink-faint)">Registrá tus sesiones de fuerza: ejercicios, series, repeticiones y peso.</p>
      <EntrenamientosView workouts={workouts} knownExercises={knownExercises} />
    </div>
  );
}
