"use client";

import { useRef, useState } from "react";
import type { AttendanceDay } from "@/lib/stats";

interface Props {
  days: AttendanceDay[];
}

const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];
const STEP_PCT = [0, 40, 70, 100];

function labelFor(date: string): string {
  const [, m, d] = date.split("-");
  return `${d}/${m}`;
}

export function Heatmap({ days }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ left: number; top: number } | null>(null);

  const weeks: AttendanceDay[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  function handleEnter(idx: number, el: HTMLElement) {
    const containerRect = containerRef.current?.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    if (!containerRect) return;
    setHoverIdx(idx);
    setTooltipPos({ left: elRect.left - containerRect.left + elRect.width / 2, top: elRect.top - containerRect.top });
  }

  const hovered = hoverIdx !== null ? days[hoverIdx] : null;

  return (
    <div ref={containerRef} className="relative w-full overflow-x-auto pb-1">
      <div className="flex gap-2">
        <div className="mt-4 flex shrink-0 flex-col gap-0.5">
          {DAY_LABELS.map((l, i) => (
            <div key={i} className="flex h-[13px] items-center text-[9px] text-(--ink-faint)" style={{ marginBottom: 2 }}>
              {i % 2 === 0 ? l : ""}
            </div>
          ))}
        </div>
        <div className="flex gap-0.5">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              <div className="h-3 text-[9px] whitespace-nowrap text-(--ink-faint)">{week[0]?.monthLabel ?? ""}</div>
              {week.map((day) => {
                const idx = days.indexOf(day);
                const bg =
                  day.count === 0
                    ? "var(--bg-sunken)"
                    : `color-mix(in srgb, var(--brand) ${STEP_PCT[day.count]}%, var(--bg-sunken))`;
                return (
                  <button
                    key={day.date}
                    type="button"
                    tabIndex={0}
                    onPointerEnter={(e) => handleEnter(idx, e.currentTarget)}
                    onFocus={(e) => handleEnter(idx, e.currentTarget)}
                    onPointerLeave={() => setHoverIdx(null)}
                    onBlur={() => setHoverIdx(null)}
                    className="h-[13px] w-[13px] rounded-[3px] border-0 outline-offset-1"
                    style={{ background: bg }}
                    aria-label={`${labelFor(day.date)}: ${day.count} actividad(es)`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {hovered && tooltipPos && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-(--line) bg-(--bg-elevated) px-2.5 py-1.5 text-xs whitespace-nowrap shadow-(--shadow)"
          style={{ left: tooltipPos.left, top: tooltipPos.top - 6 }}
        >
          <div className="font-semibold text-foreground">{labelFor(hovered.date)}</div>
          <div className="text-(--ink-faint)">
            {hovered.count === 0 ? "Sin actividad" : `${hovered.count} actividad${hovered.count > 1 ? "es" : ""}`}
          </div>
        </div>
      )}

      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-(--ink-faint)">
        <span>Menos</span>
        {STEP_PCT.map((p, i) => (
          <span
            key={i}
            className="h-[11px] w-[11px] rounded-[3px]"
            style={{ background: p === 0 ? "var(--bg-sunken)" : `color-mix(in srgb, var(--brand) ${p}%, var(--bg-sunken))` }}
          />
        ))}
        <span>Más</span>
      </div>
    </div>
  );
}
