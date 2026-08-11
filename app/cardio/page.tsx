import { getGymData, CARDIO_TYPES } from "@/lib/gym";
import { CardioView } from "./view";

export const dynamic = "force-dynamic";

export default async function CardioPage() {
  const data = await getGymData();
  const sessions = [...data.cardioSessions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mx-auto max-w-4xl px-3 py-4 lg:px-4">
      <h1 className="mb-1 text-xl font-bold text-foreground">Cardio</h1>
      <p className="mb-4 text-sm text-(--ink-faint)">Distancia, tiempo y calorías de tus sesiones de cardio.</p>
      <CardioView initialSessions={sessions} cardioTypes={CARDIO_TYPES} />
    </div>
  );
}
