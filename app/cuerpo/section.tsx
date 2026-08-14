import type { GymData } from "@/lib/gym";
import { CuerpoView } from "./view";

export function CuerpoSection({ data }: { data: GymData }) {
  const metrics = [...data.bodyMetrics].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="mx-auto max-w-4xl px-3 lg:px-4">
      <h2 className="mb-1 text-xl font-bold text-foreground">Cuerpo</h2>
      <p className="mb-4 text-sm text-(--ink-faint)">Peso corporal y medidas a lo largo del tiempo.</p>
      <CuerpoView metrics={metrics} />
    </div>
  );
}
