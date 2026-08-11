"use client";

import Link from "next/link";
import type { BodyWeightPoint, MonthBucket, WeekBucket } from "@/lib/stats";
import { Card } from "@/app/_components/ui";
import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";

function fmt(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
}

export function DashboardCharts({ weekly, monthly, weightPoints }: { weekly: WeekBucket[]; monthly: MonthBucket[]; weightPoints: BodyWeightPoint[] }) {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <Card
          title="Frecuencia semanal"
          action={
            <Link href="/asistencia" className="text-xs font-medium text-(--brand) hover:underline">
              Ver asistencia
            </Link>
          }
        >
          <BarChart data={weekly.map((w) => ({ label: w.label, value: w.days }))} valueFormat={(v) => `${Math.round(v)}`} height={180} />
        </Card>

        <Card title="Volumen mensual">
          <BarChart data={monthly.map((m) => ({ label: m.label, value: m.volume }))} valueFormat={(v) => `${Math.round(v / 1000)}t`} height={180} />
        </Card>
      </div>

      {weightPoints.length > 0 && (
        <Card
          title="Peso corporal"
          action={
            <Link href="/cuerpo" className="text-xs font-medium text-(--brand) hover:underline">
              Ver cuerpo
            </Link>
          }
        >
          <LineChart data={weightPoints.slice(-20).map((p) => ({ label: fmt(p.date), value: p.weightKg }))} valueFormat={(v) => `${v.toFixed(1)}kg`} height={180} />
        </Card>
      )}
    </>
  );
}
