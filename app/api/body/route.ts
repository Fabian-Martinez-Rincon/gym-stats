import { createBodyMetric } from "@/lib/gym";

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
  const { date, weightKg, bodyFatPct, chestCm, waistCm, hipsCm, armCm, thighCm } = (body ?? {}) as Record<
    string,
    unknown
  >;
  if (typeof date !== "string") {
    return Response.json({ error: "Falta la fecha." }, { status: 400 });
  }

  try {
    const metric = await createBodyMetric({
      date,
      weightKg: num(weightKg),
      bodyFatPct: num(bodyFatPct),
      chestCm: num(chestCm),
      waistCm: num(waistCm),
      hipsCm: num(hipsCm),
      armCm: num(armCm),
      thighCm: num(thighCm),
    });
    return Response.json({ metric });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido.";
    return Response.json({ error: message }, { status: 400 });
  }
}
