import type { GymData } from "@/lib/gym";
import { buildAttendanceGrid, computeStreaks, computeWeeklyFrequency, getActivityDates, todayStr } from "@/lib/stats";
import { SectionHeading } from "@/app/_components/ui";
import { AsistenciaView } from "./view";

export function AsistenciaSection({ data }: { data: GymData }) {
  const activityDates = getActivityDates(data);
  const streaks = computeStreaks(activityDates);
  const weekly = computeWeeklyFrequency(activityDates, 10);
  const grid = buildAttendanceGrid(data, 18);
  const visits = [...data.visits].sort((a, b) => b.date.localeCompare(a.date));
  const checkedInToday = activityDates.has(todayStr());

  return (
    <div className="mx-auto max-w-4xl px-3 lg:px-4">
      <SectionHeading
        eyebrow="Constancia"
        eyebrowColor="var(--accent-asistencia)"
        title="Asistencia"
        subtitle="Constancia y frecuencia: cada entrenamiento, cardio o visita cuenta como un día activo."
      />
      <AsistenciaView streaks={streaks} weekly={weekly} grid={grid} visits={visits} checkedInToday={checkedInToday} />
    </div>
  );
}
