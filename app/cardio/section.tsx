import { CARDIO_TYPES, type GymData } from "@/lib/gym";
import { SectionHeading } from "@/app/_components/ui";
import { CardioView } from "./view";

export function CardioSection({ data }: { data: GymData }) {
  const sessions = [...data.cardioSessions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mx-auto max-w-4xl px-3 lg:px-4">
      <SectionHeading
        eyebrow="Resistencia"
        eyebrowColor="var(--accent-cardio)"
        title="Cardio"
        subtitle="Distancia, tiempo y calorías de tus sesiones de cardio."
      />
      <CardioView sessions={sessions} cardioTypes={CARDIO_TYPES} />
    </div>
  );
}
