import { COMMON_EXERCISES, type GymData } from "@/lib/gym";
import { getExerciseNames } from "@/lib/stats";
import { SectionHeading } from "@/app/_components/ui";
import { EntrenamientosView } from "./view";

export function EntrenamientosSection({ data }: { data: GymData }) {
  const usedNames = getExerciseNames(data.workouts);
  const knownExercises = Array.from(new Set([...COMMON_EXERCISES, ...usedNames])).sort((a, b) => a.localeCompare(b, "es"));
  const workouts = [...data.workouts].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mx-auto max-w-4xl px-3 lg:px-4">
      <SectionHeading
        eyebrow="Sesiones de fuerza"
        eyebrowColor="var(--accent-entrenamientos)"
        title="Entrenamientos"
        subtitle="Registrá tus sesiones de fuerza: ejercicios, series, repeticiones y peso."
      />
      <EntrenamientosView workouts={workouts} knownExercises={knownExercises} />
    </div>
  );
}
