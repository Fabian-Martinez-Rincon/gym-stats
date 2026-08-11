import { getGymData } from "@/lib/gym";
import { getExerciseNames } from "@/lib/stats";
import { ProgresoView } from "./view";
import { EmptyState } from "@/app/_components/ui";

export const dynamic = "force-dynamic";

export default async function ProgresoPage() {
  const data = await getGymData();
  const names = getExerciseNames(data.workouts);

  return (
    <div className="mx-auto max-w-4xl px-3 py-4 lg:px-4">
      <h1 className="mb-1 text-xl font-bold text-foreground">Progreso por ejercicio</h1>
      <p className="mb-4 text-sm text-(--ink-faint)">Evolución de peso, volumen y 1RM estimado para cada ejercicio.</p>
      {names.length === 0 ? (
        <EmptyState>Cargá entrenamientos en la sección Entrenamientos para ver tu progreso acá.</EmptyState>
      ) : (
        <ProgresoView workouts={data.workouts} exerciseNames={names} />
      )}
    </div>
  );
}
