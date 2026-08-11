"use client";

import { useEffect } from "react";
import { Button } from "@/app/_components/ui";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-3 py-16 text-center lg:px-4">
      <p className="text-sm font-medium text-foreground">Algo salió mal al cargar tus datos.</p>
      <p className="text-xs text-(--ink-faint)">Puede que data/gym.json esté dañado o no se haya podido leer.</p>
      <Button onClick={reset}>Reintentar</Button>
    </div>
  );
}
