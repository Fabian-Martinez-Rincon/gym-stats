import type { GymData } from "@/lib/gym";
import {
  computeMonthlyVolume,
  computeRecentPRs,
  computeStreaks,
  computeWeeklyFrequency,
  computeWeightTrend,
  getActivityDates,
  todayStr,
  weightDelta,
  workoutVolume,
} from "@/lib/stats";
import { Card, EmptyState, LinkButton, StatTile } from "@/app/_components/ui";
import { DashboardCharts } from "@/app/_components/dashboard-charts";
import { HeroLogDemo } from "./hero-log-demo";

export function ResumenSection({ data }: { data: GymData }) {
  const activityDates = getActivityDates(data);
  const streaks = computeStreaks(activityDates);
  const weekly = computeWeeklyFrequency(activityDates, 8);
  const monthly = computeMonthlyVolume(data.workouts, 6);
  const prs = computeRecentPRs(data.workouts, 6);
  const weightPoints = computeWeightTrend(data.bodyMetrics);
  const delta30 = weightDelta(weightPoints, 30);
  const latestWeight = weightPoints[weightPoints.length - 1];

  const currentMonth = todayStr().slice(0, 7);
  const workoutsThisMonth = data.workouts.filter((w) => w.date.slice(0, 7) === currentMonth).length;
  const volumeThisMonth = data.workouts
    .filter((w) => w.date.slice(0, 7) === currentMonth)
    .reduce((sum, w) => sum + workoutVolume(w), 0);

  const hasAnyData = data.workouts.length > 0 || data.bodyMetrics.length > 0 || data.cardioSessions.length > 0 || data.visits.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-3 lg:px-4">
      <div className="mb-10 flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-2xl flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-(--brand)">Proyecto personal</span>
          <h1 className="text-4xl leading-tight font-extrabold text-foreground sm:text-5xl">Tu rendimiento en el gimnasio, en un solo lugar.</h1>
          <p className="max-w-xl text-sm text-(--ink-dim) sm:text-base">
            Entrenamientos, cardio, medidas corporales y asistencia — con récords, volumen y progreso por ejercicio calculados al vuelo.
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            <LinkButton href="#entrenamientos">{hasAnyData ? "Cargar entrenamiento" : "Empezar a registrar"}</LinkButton>
            <LinkButton href="#progreso" variant="secondary">
              Ver progreso
            </LinkButton>
          </div>
        </div>
        <HeroLogDemo />
      </div>

      <h2 className="mb-1 text-xl font-bold text-foreground">Resumen</h2>
      <p className="mb-4 text-sm text-(--ink-faint)">Tu rendimiento en el gimnasio, de un vistazo.</p>

      {!hasAnyData ? (
        <EmptyState>
          Todavía no cargaste nada. Arrancá por{" "}
          <a href="#entrenamientos" className="font-medium text-(--brand) hover:underline">
            Entrenamientos
          </a>{" "}
          o marcá tu primera asistencia en{" "}
          <a href="#asistencia" className="font-medium text-(--brand) hover:underline">
            Asistencia
          </a>
          .
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Racha actual" value={`${streaks.current}d`} sub={`Récord: ${streaks.longest}d`} />
            <StatTile label="Entrenamientos (mes)" value={String(workoutsThisMonth)} />
            <StatTile label="Volumen (mes)" value={`${Math.round(volumeThisMonth).toLocaleString("es-AR")}kg`} />
            <StatTile
              label="Peso actual"
              value={latestWeight ? `${latestWeight.weightKg}kg` : "—"}
              deltaLabel={delta30 !== null ? `${delta30 > 0 ? "+" : ""}${delta30.toFixed(1)}kg (30d)` : undefined}
            />
          </div>

          <Card
            title="Récords recientes"
            action={
              <a href="#progreso" className="text-xs font-medium text-(--brand) hover:underline">
                Ver progreso
              </a>
            }
          >
            {prs.length === 0 ? (
              <p className="text-sm text-(--ink-faint)">Todavía no hay récords registrados.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {prs.map((pr, i) => (
                  <li key={i} className="flex items-center justify-between gap-2 rounded-md bg-(--gold-bg) px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span aria-hidden>🏆</span>
                      <span className="text-sm font-medium text-foreground">{pr.exerciseName}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold" style={{ color: "var(--gold)" }}>
                        {pr.weightKg}kg x{pr.reps}
                      </div>
                      <div className="text-[10px] text-(--ink-faint)">{fmt(pr.date)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <DashboardCharts weekly={weekly} monthly={monthly} weightPoints={weightPoints} />
        </div>
      )}
    </div>
  );
}

function fmt(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
}
