import { deleteWorkout } from "@/lib/gym";

export const runtime = "nodejs";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await deleteWorkout(id);
    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido.";
    return Response.json({ error: message }, { status: 400 });
  }
}
