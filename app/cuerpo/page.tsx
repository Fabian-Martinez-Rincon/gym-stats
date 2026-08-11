import { getGymData } from "@/lib/gym";
import { CuerpoView } from "./view";

export const dynamic = "force-dynamic";

export default async function CuerpoPage() {
  const data = await getGymData();
  const metrics = [...data.bodyMetrics].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="mx-auto max-w-4xl px-3 py-4 lg:px-4">
      <h1 className="mb-1 text-xl font-bold text-foreground">Cuerpo</h1>
      <p className="mb-4 text-sm text-(--ink-faint)">Peso corporal y medidas a lo largo del tiempo.</p>
      <CuerpoView initialMetrics={metrics} />
    </div>
  );
}
