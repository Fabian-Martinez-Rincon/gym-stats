import { createCardioSession } from "@/lib/gym";

export const runtime = "nodejs";

function num(v: unknown): number | undefined {
  if (v === "" || v === null || v === undefined) return undefined;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "No se pudo leer el cuerpo del pedido." }, { status: 400 });
  }
  const { date, type, durationMin, distanceKm, calories, notes } = (body ?? {}) as Record<string, unknown>;
  if (typeof date !== "string" || typeof type !== "string") {
    return Response.json({ error: "Faltan datos de la sesión." }, { status: 400 });
  }

  try {
    const session = await createCardioSession({
      date,
      type,
      durationMin: num(durationMin) ?? 0,
      distanceKm: num(distanceKm),
      calories: num(calories),
      notes: typeof notes === "string" ? notes : undefined,
    });
    return Response.json({ session });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido.";
    return Response.json({ error: message }, { status: 400 });
  }
}
