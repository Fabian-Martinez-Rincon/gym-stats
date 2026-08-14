import { CARDIO_TYPES, type GymData } from "@/lib/gym";
import { CardioView } from "./view";

export function CardioSection({ data }: { data: GymData }) {
  const sessions = [...data.cardioSessions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mx-auto max-w-4xl px-3 lg:px-4">
      <h2 className="mb-1 text-xl font-bold text-foreground">Cardio</h2>
      <p className="mb-4 text-sm text-(--ink-faint)">Distancia, tiempo y calorías de tus sesiones de cardio.</p>
      <CardioView sessions={sessions} cardioTypes={CARDIO_TYPES} />
    </div>
  );
}
