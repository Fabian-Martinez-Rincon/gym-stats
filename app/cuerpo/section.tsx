import type { GymData } from "@/lib/gym";
import { SectionHeading } from "@/app/_components/ui";
import { CuerpoView } from "./view";

export function CuerpoSection({ data }: { data: GymData }) {
  const metrics = [...data.bodyMetrics].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="mx-auto max-w-4xl px-3 lg:px-4">
      <SectionHeading
        eyebrow="Composición corporal"
        eyebrowColor="var(--accent-cuerpo)"
        title="Cuerpo"
        subtitle="Peso corporal y medidas a lo largo del tiempo."
      />
      <CuerpoView metrics={metrics} />
    </div>
  );
}
