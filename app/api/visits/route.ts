import { createVisit } from "@/lib/gym";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "No se pudo leer el cuerpo del pedido." }, { status: 400 });
  }
  const { date, notes } = (body ?? {}) as Record<string, unknown>;
  if (typeof date !== "string") {
    return Response.json({ error: "Falta la fecha." }, { status: 400 });
  }

  try {
    const visit = await createVisit(date, typeof notes === "string" ? notes : undefined);
    return Response.json({ visit });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido.";
    return Response.json({ error: message }, { status: 400 });
  }
}
