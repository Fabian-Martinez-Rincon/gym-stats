import type { GymData } from "@/lib/gym";
import { getExerciseNames } from "@/lib/stats";
import { EmptyState } from "@/app/_components/ui";
import { ProgresoView } from "./view";

export function ProgresoSection({ data }: { data: GymData }) {
  const names = getExerciseNames(data.workouts);

  return (
    <div className="mx-auto max-w-4xl px-3 lg:px-4">
      <h2 className="mb-1 text-xl font-bold text-foreground">Progreso por ejercicio</h2>
      <p className="mb-4 text-sm text-(--ink-faint)">Evolución de peso, volumen y 1RM estimado para cada ejercicio.</p>
      {names.length === 0 ? (
        <EmptyState>Cargá entrenamientos en la sección Entrenamientos para ver tu progreso acá.</EmptyState>
      ) : (
        <ProgresoView workouts={data.workouts} exerciseNames={names} />
      )}
    </div>
  );
}
