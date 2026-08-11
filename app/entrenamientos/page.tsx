import { getGymData, COMMON_EXERCISES } from "@/lib/gym";
import { getExerciseNames } from "@/lib/stats";
import { EntrenamientosView } from "./view";

export const dynamic = "force-dynamic";

export default async function EntrenamientosPage() {
  const data = await getGymData();
  const usedNames = getExerciseNames(data.workouts);
  const knownExercises = Array.from(new Set([...COMMON_EXERCISES, ...usedNames])).sort((a, b) => a.localeCompare(b, "es"));
  const workouts = [...data.workouts].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mx-auto max-w-4xl px-3 py-4 lg:px-4">
      <h1 className="mb-1 text-xl font-bold text-foreground">Entrenamientos</h1>
      <p className="mb-4 text-sm text-(--ink-faint)">Registrá tus sesiones de fuerza: ejercicios, series, repeticiones y peso.</p>
      <EntrenamientosView initialWorkouts={workouts} knownExercises={knownExercises} />
    </div>
  );
}
