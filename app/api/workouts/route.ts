import { createWorkout, type ExerciseEntry } from "@/lib/gym";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "No se pudo leer el cuerpo del pedido." }, { status: 400 });
  }
  const { date, exercises, notes } = (body ?? {}) as Record<string, unknown>;
  if (typeof date !== "string" || !Array.isArray(exercises)) {
    return Response.json({ error: "Faltan datos del entrenamiento." }, { status: 400 });
  }

  try {
    const workout = await createWorkout({
      date,
      exercises: exercises as ExerciseEntry[],
      notes: typeof notes === "string" ? notes : undefined,
    });
    return Response.json({ workout });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido.";
    return Response.json({ error: message }, { status: 400 });
  }
}
