import type { GymData } from "@/lib/gym";
import { getExerciseNames } from "@/lib/stats";
import { EmptyState, SectionHeading } from "@/app/_components/ui";
import { ProgresoView } from "./view";

export function ProgresoSection({ data }: { data: GymData }) {
  const names = getExerciseNames(data.workouts);

  return (
    <div className="mx-auto max-w-4xl px-3 lg:px-4">
      <SectionHeading
        eyebrow="Récords y evolución"
        eyebrowColor="var(--accent-progreso)"
        title="Progreso por ejercicio"
        subtitle="Evolución de peso, volumen y 1RM estimado para cada ejercicio."
      />
      {names.length === 0 ? (
        <EmptyState>Cargá entrenamientos en la sección Entrenamientos para ver tu progreso acá.</EmptyState>
      ) : (
        <ProgresoView workouts={data.workouts} exerciseNames={names} />
      )}
    </div>
  );
}
