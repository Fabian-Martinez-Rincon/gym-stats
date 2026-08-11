import { getGymData } from "@/lib/gym";
import { buildAttendanceGrid, computeStreaks, computeWeeklyFrequency, getActivityDates, todayStr } from "@/lib/stats";
import { AsistenciaView } from "./view";

export const dynamic = "force-dynamic";

export default async function AsistenciaPage() {
  const data = await getGymData();
  const activityDates = getActivityDates(data);
  const streaks = computeStreaks(activityDates);
  const weekly = computeWeeklyFrequency(activityDates, 10);
  const grid = buildAttendanceGrid(data, 18);
  const visits = [...data.visits].sort((a, b) => b.date.localeCompare(a.date));
  const checkedInToday = activityDates.has(todayStr());

  return (
    <div className="mx-auto max-w-4xl px-3 py-4 lg:px-4">
      <h1 className="mb-1 text-xl font-bold text-foreground">Asistencia</h1>
      <p className="mb-4 text-sm text-(--ink-faint)">Constancia y frecuencia: cada entrenamiento, cardio o visita cuenta como un día activo.</p>
      <AsistenciaView streaks={streaks} weekly={weekly} grid={grid} visits={visits} checkedInToday={checkedInToday} />
    </div>
  );
}
