import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "gym.json");

export interface SetEntry {
  reps: number;
  weightKg: number;
}

export interface ExerciseEntry {
  name: string;
  sets: SetEntry[];
}

export interface Workout {
  id: string;
  date: string; // yyyy-mm-dd
  exercises: ExerciseEntry[];
  notes: string;
  createdAt: string;
}

export interface BodyMetric {
  id: string;
  date: string; // yyyy-mm-dd
  weightKg: number | null;
  bodyFatPct: number | null;
  chestCm: number | null;
  waistCm: number | null;
  hipsCm: number | null;
  armCm: number | null;
  thighCm: number | null;
  createdAt: string;
}

export interface CardioSession {
  id: string;
  date: string; // yyyy-mm-dd
  type: string;
  durationMin: number;
  distanceKm: number | null;
  calories: number | null;
  notes: string;
  createdAt: string;
}

export interface GymVisit {
  id: string;
  date: string; // yyyy-mm-dd
  notes: string;
  createdAt: string;
}

export interface GymData {
  workouts: Workout[];
  bodyMetrics: BodyMetric[];
  cardioSessions: CardioSession[];
  visits: GymVisit[];
}

export const COMMON_EXERCISES = [
  "Sentadilla",
  "Peso muerto",
  "Press de banca",
  "Press militar",
  "Remo con barra",
  "Dominadas",
  "Press inclinado con mancuernas",
  "Curl de bíceps",
  "Extensión de tríceps",
  "Prensa de piernas",
  "Zancadas",
  "Elevaciones laterales",
  "Face pull",
  "Hip thrust",
  "Jalón al pecho",
];

export const CARDIO_TYPES = [
  "Correr",
  "Bicicleta",
  "Remo",
  "Elíptica",
  "Caminata",
  "Natación",
  "Otro",
];

const EMPTY_DATA: GymData = {
  workouts: [],
  bodyMetrics: [],
  cardioSessions: [],
  visits: [],
};

async function readData(): Promise<GymData> {
  if (!existsSync(DATA_FILE)) {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, `${JSON.stringify(EMPTY_DATA, null, 2)}\n`, "utf-8");
    return structuredClone(EMPTY_DATA);
  }
  const raw = JSON.parse(await readFile(DATA_FILE, "utf-8")) as Partial<GymData>;
  return {
    workouts: raw.workouts ?? [],
    bodyMetrics: raw.bodyMetrics ?? [],
    cardioSessions: raw.cardioSessions ?? [],
    visits: raw.visits ?? [],
  };
}

async function writeData(data: GymData): Promise<void> {
  await writeFile(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export async function getGymData(): Promise<GymData> {
  return readData();
}

// ---------- Workouts ----------

export interface WorkoutInput {
  date: string;
  exercises: ExerciseEntry[];
  notes?: string;
}

function sanitizeExercises(exercises: ExerciseEntry[]): ExerciseEntry[] {
  const cleaned = exercises
    .map((ex) => ({
      name: ex.name.trim(),
      sets: ex.sets
        .filter((s) => Number.isFinite(s.reps) && Number.isFinite(s.weightKg) && s.reps > 0)
        .map((s) => ({ reps: Math.round(s.reps), weightKg: Math.max(0, s.weightKg) })),
    }))
    .filter((ex) => ex.name && ex.sets.length > 0);
  if (cleaned.length === 0) throw new Error("Agregá al menos un ejercicio con una serie válida.");
  return cleaned;
}

export async function createWorkout(input: WorkoutInput): Promise<Workout> {
  if (!isValidDate(input.date)) throw new Error("Fecha inválida.");
  const data = await readData();
  const workout: Workout = {
    id: randomUUID(),
    date: input.date,
    exercises: sanitizeExercises(input.exercises),
    notes: input.notes?.trim() ?? "",
    createdAt: new Date().toISOString(),
  };
  data.workouts.push(workout);
  await writeData(data);
  return workout;
}

export async function deleteWorkout(id: string): Promise<void> {
  const data = await readData();
  if (!data.workouts.some((w) => w.id === id)) throw new Error("El entrenamiento no existe.");
  data.workouts = data.workouts.filter((w) => w.id !== id);
  await writeData(data);
}

// ---------- Body metrics ----------

export interface BodyMetricInput {
  date: string;
  weightKg?: number | null;
  bodyFatPct?: number | null;
  chestCm?: number | null;
  waistCm?: number | null;
  hipsCm?: number | null;
  armCm?: number | null;
  thighCm?: number | null;
}

function numOrNull(v: number | null | undefined): number | null {
  return typeof v === "number" && Number.isFinite(v) && v > 0 ? v : null;
}

export async function createBodyMetric(input: BodyMetricInput): Promise<BodyMetric> {
  if (!isValidDate(input.date)) throw new Error("Fecha inválida.");
  const metric: BodyMetric = {
    id: randomUUID(),
    date: input.date,
    weightKg: numOrNull(input.weightKg),
    bodyFatPct: numOrNull(input.bodyFatPct),
    chestCm: numOrNull(input.chestCm),
    waistCm: numOrNull(input.waistCm),
    hipsCm: numOrNull(input.hipsCm),
    armCm: numOrNull(input.armCm),
    thighCm: numOrNull(input.thighCm),
    createdAt: new Date().toISOString(),
  };
  if (
    metric.weightKg === null &&
    metric.bodyFatPct === null &&
    metric.chestCm === null &&
    metric.waistCm === null &&
    metric.hipsCm === null &&
    metric.armCm === null &&
    metric.thighCm === null
  ) {
    throw new Error("Cargá al menos un dato del cuerpo.");
  }
  const data = await readData();
  data.bodyMetrics.push(metric);
  await writeData(data);
  return metric;
}

export async function deleteBodyMetric(id: string): Promise<void> {
  const data = await readData();
  if (!data.bodyMetrics.some((m) => m.id === id)) throw new Error("El registro no existe.");
  data.bodyMetrics = data.bodyMetrics.filter((m) => m.id !== id);
  await writeData(data);
}

// ---------- Cardio ----------

export interface CardioInput {
  date: string;
  type: string;
  durationMin: number;
  distanceKm?: number | null;
  calories?: number | null;
  notes?: string;
}

export async function createCardioSession(input: CardioInput): Promise<CardioSession> {
  if (!isValidDate(input.date)) throw new Error("Fecha inválida.");
  const type = input.type.trim();
  if (!type) throw new Error("Elegí un tipo de cardio.");
  if (!Number.isFinite(input.durationMin) || input.durationMin <= 0) {
    throw new Error("La duración debe ser mayor a 0.");
  }
  const session: CardioSession = {
    id: randomUUID(),
    date: input.date,
    type,
    durationMin: Math.round(input.durationMin),
    distanceKm: numOrNull(input.distanceKm),
    calories: numOrNull(input.calories),
    notes: input.notes?.trim() ?? "",
    createdAt: new Date().toISOString(),
  };
  const data = await readData();
  data.cardioSessions.push(session);
  await writeData(data);
  return session;
}

export async function deleteCardioSession(id: string): Promise<void> {
  const data = await readData();
  if (!data.cardioSessions.some((c) => c.id === id)) throw new Error("La sesión no existe.");
  data.cardioSessions = data.cardioSessions.filter((c) => c.id !== id);
  await writeData(data);
}

// ---------- Visits (asistencia rápida) ----------

export async function createVisit(date: string, notes?: string): Promise<GymVisit> {
  if (!isValidDate(date)) throw new Error("Fecha inválida.");
  const data = await readData();
  if (data.visits.some((v) => v.date === date)) {
    throw new Error("Ya marcaste asistencia ese día.");
  }
  const visit: GymVisit = {
    id: randomUUID(),
    date,
    notes: notes?.trim() ?? "",
    createdAt: new Date().toISOString(),
  };
  data.visits.push(visit);
  await writeData(data);
  return visit;
}

export async function deleteVisit(id: string): Promise<void> {
  const data = await readData();
  if (!data.visits.some((v) => v.id === id)) throw new Error("La visita no existe.");
  data.visits = data.visits.filter((v) => v.id !== id);
  await writeData(data);
}
