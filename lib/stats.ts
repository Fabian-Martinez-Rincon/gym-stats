import type { BodyMetric, CardioSession, GymData, Workout } from "./gym";

// ---------- Date helpers (all dates are "yyyy-mm-dd" local strings) ----------

export function todayStr(): string {
  return formatDate(new Date());
}

export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function epochDay(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}

function mondayOf(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const dow = dt.getUTCDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  dt.setUTCDate(dt.getUTCDate() + diff);
  return dt.toISOString().slice(0, 10);
}

function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

// ---------- Activity / attendance ----------

export function getActivityDates(data: GymData): Set<string> {
  const dates = new Set<string>();
  for (const w of data.workouts) dates.add(w.date);
  for (const c of data.cardioSessions) dates.add(c.date);
  for (const v of data.visits) dates.add(v.date);
  return dates;
}

export interface StreakInfo {
  current: number;
  longest: number;
}

export function computeStreaks(activityDates: Set<string>): StreakInfo {
  if (activityDates.size === 0) return { current: 0, longest: 0 };
  const days = Array.from(activityDates)
    .map(epochDay)
    .sort((a, b) => a - b);

  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    if (days[i] === days[i - 1] + 1) {
      run += 1;
    } else if (days[i] !== days[i - 1]) {
      run = 1;
    }
    longest = Math.max(longest, run);
  }

  const today = epochDay(todayStr());
  const daySet = new Set(days);
  let anchor: number | null = null;
  if (daySet.has(today)) anchor = today;
  else if (daySet.has(today - 1)) anchor = today - 1;

  let current = 0;
  if (anchor !== null) {
    current = 1;
    let cursor = anchor - 1;
    while (daySet.has(cursor)) {
      current += 1;
      cursor -= 1;
    }
  }

  return { current, longest };
}

export interface WeekBucket {
  weekStart: string;
  label: string;
  days: number;
}

export function computeWeeklyFrequency(activityDates: Set<string>, weeks = 8): WeekBucket[] {
  const byWeek = new Map<string, Set<string>>();
  for (const date of activityDates) {
    const wk = mondayOf(date);
    if (!byWeek.has(wk)) byWeek.set(wk, new Set());
    byWeek.get(wk)!.add(date);
  }

  const thisWeekStart = mondayOf(todayStr());
  const buckets: WeekBucket[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = addDays(thisWeekStart, -7 * i);
    const count = byWeek.get(weekStart)?.size ?? 0;
    const [, m, d] = weekStart.split("-");
    buckets.push({ weekStart, label: `${d}/${m}`, days: count });
  }
  return buckets;
}

// ---------- Strength: volume, 1RM, progress, PRs ----------

export function workoutVolume(workout: Workout): number {
  let total = 0;
  for (const ex of workout.exercises) {
    for (const s of ex.sets) total += s.reps * s.weightKg;
  }
  return total;
}

export function estimateOneRepMax(weightKg: number, reps: number): number {
  if (reps <= 1) return weightKg;
  return weightKg * (1 + reps / 30);
}

export interface MonthBucket {
  month: string; // yyyy-mm
  label: string;
  volume: number;
}

export function computeMonthlyVolume(workouts: Workout[], months = 6): MonthBucket[] {
  const byMonth = new Map<string, number>();
  for (const w of workouts) {
    const key = w.date.slice(0, 7);
    byMonth.set(key, (byMonth.get(key) ?? 0) + workoutVolume(w));
  }
  const now = new Date();
  const buckets: MonthBucket[] = [];
  const NAMES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.push({ month: key, label: NAMES[d.getMonth()], volume: byMonth.get(key) ?? 0 });
  }
  return buckets;
}

export function getExerciseNames(workouts: Workout[]): string[] {
  const names = new Set<string>();
  for (const w of workouts) for (const ex of w.exercises) names.add(ex.name);
  return Array.from(names).sort((a, b) => a.localeCompare(b, "es"));
}

export interface ExerciseSessionStat {
  date: string;
  maxWeight: number;
  bestSetReps: number;
  volume: number;
  estOneRM: number;
}

export function computeExerciseHistory(workouts: Workout[], exerciseName: string): ExerciseSessionStat[] {
  const rows: ExerciseSessionStat[] = [];
  const sorted = [...workouts].sort((a, b) => a.date.localeCompare(b.date));
  for (const w of sorted) {
    for (const ex of w.exercises) {
      if (ex.name !== exerciseName) continue;
      let maxWeight = 0;
      let bestSetReps = 0;
      let volume = 0;
      let estOneRM = 0;
      for (const s of ex.sets) {
        volume += s.reps * s.weightKg;
        if (s.weightKg > maxWeight) {
          maxWeight = s.weightKg;
          bestSetReps = s.reps;
        }
        estOneRM = Math.max(estOneRM, estimateOneRepMax(s.weightKg, s.reps));
      }
      rows.push({ date: w.date, maxWeight, bestSetReps, volume, estOneRM });
    }
  }
  return rows;
}

export interface PrEvent {
  date: string;
  exerciseName: string;
  weightKg: number;
  reps: number;
}

export function computeRecentPRs(workouts: Workout[], limit = 6): PrEvent[] {
  const names = getExerciseNames(workouts);
  const events: PrEvent[] = [];
  for (const name of names) {
    const history = computeExerciseHistory(workouts, name);
    let best = 0;
    for (const row of history) {
      if (row.maxWeight > best) {
        events.push({ date: row.date, exerciseName: name, weightKg: row.maxWeight, reps: row.bestSetReps });
        best = row.maxWeight;
      }
    }
  }
  return events.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

// ---------- Body weight ----------

export interface BodyWeightPoint {
  date: string;
  weightKg: number;
}

export function computeWeightTrend(bodyMetrics: BodyMetric[]): BodyWeightPoint[] {
  return bodyMetrics
    .filter((m): m is BodyMetric & { weightKg: number } => m.weightKg !== null)
    .map((m) => ({ date: m.date, weightKg: m.weightKg }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function weightDelta(points: BodyWeightPoint[], days: number): number | null {
  if (points.length === 0) return null;
  const latest = points[points.length - 1];
  const cutoff = addDays(latest.date, -days);
  let reference: BodyWeightPoint | null = null;
  for (const p of points) {
    if (p.date <= cutoff) reference = p;
  }
  if (!reference) reference = points[0];
  if (reference.date === latest.date) return null;
  return latest.weightKg - reference.weightKg;
}

export interface AttendanceDay {
  date: string;
  count: number; // 0-3: how many kinds of activity (workout / cardio / visit) landed on this day
  monthLabel: string | null; // set on the first day of a week whose month differs from the previous week
}

const MONTH_NAMES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export function buildAttendanceGrid(data: GymData, weeks = 18): AttendanceDay[] {
  const perDayCount = new Map<string, number>();
  const bump = (date: string) => perDayCount.set(date, (perDayCount.get(date) ?? 0) + 1);
  for (const w of data.workouts) bump(w.date);
  for (const c of data.cardioSessions) bump(c.date);
  for (const v of data.visits) bump(v.date);

  const thisWeekStart = mondayOf(todayStr());
  const gridStart = addDays(thisWeekStart, -7 * (weeks - 1));

  const days: AttendanceDay[] = [];
  let prevMonth = "";
  for (let w = 0; w < weeks; w++) {
    const weekStart = addDays(gridStart, w * 7);
    const month = weekStart.slice(0, 7);
    for (let d = 0; d < 7; d++) {
      const date = addDays(weekStart, d);
      days.push({
        date,
        count: Math.min(3, perDayCount.get(date) ?? 0),
        monthLabel: d === 0 && month !== prevMonth ? MONTH_NAMES[Number(month.slice(5, 7)) - 1] : null,
      });
    }
    prevMonth = month;
  }
  return days;
}

// ---------- Cardio ----------

export function computeCardioTotals(sessions: CardioSession[], days = 30) {
  const cutoff = addDays(todayStr(), -days);
  const recent = sessions.filter((s) => s.date > cutoff);
  const durationMin = recent.reduce((sum, s) => sum + s.durationMin, 0);
  const distanceKm = recent.reduce((sum, s) => sum + (s.distanceKm ?? 0), 0);
  return { durationMin, distanceKm, sessionCount: recent.length };
}
