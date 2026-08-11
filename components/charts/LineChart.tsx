"use client";

import { useRef, useState } from "react";

export interface LinePoint {
  label: string;
  value: number;
}

interface Props {
  data: LinePoint[];
  valueFormat?: (v: number) => string;
  emptyMessage?: string;
  height?: number;
}

const VIEW_W = 600;
const PAD = { left: 40, right: 14, top: 16, bottom: 26 };

export function LineChart({ data, valueFormat = (v) => String(Math.round(v * 10) / 10), emptyMessage, height = 200 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-(--ink-faint)">
        {emptyMessage ?? "Todavía no hay datos."}
      </div>
    );
  }

  const innerW = VIEW_W - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const values = data.map((d) => d.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const span = rawMax - rawMin || Math.max(1, rawMax * 0.1) || 1;
  const min = rawMin - span * 0.15;
  const max = rawMax + span * 0.15;

  const xAt = (i: number) => (data.length === 1 ? PAD.left + innerW / 2 : PAD.left + (i / (data.length - 1)) * innerW);
  const yAt = (v: number) => PAD.top + (1 - (v - min) / (max - min)) * innerH;

  const linePath = data.map((d, i) => `${i === 0 ? "M" : "L"}${xAt(i).toFixed(1)},${yAt(d.value).toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${xAt(data.length - 1).toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${xAt(0).toFixed(1)},${(
    PAD.top + innerH
  ).toFixed(1)} Z`;

  const last = data[data.length - 1];
  const gridValues = [min + (max - min) * 0.05, (min + max) / 2, max - (max - min) * 0.05];

  function handlePointer(clientX: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const relX = ((clientX - rect.left) / rect.width) * VIEW_W;
    let nearest = 0;
    let nearestDist = Infinity;
    for (let i = 0; i < data.length; i++) {
      const dist = Math.abs(xAt(i) - relX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    }
    setHover(nearest);
  }

  const hoverPoint = hover !== null ? data[hover] : null;

  return (
    <div ref={containerRef} className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${VIEW_W} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        className="block overflow-visible"
        onPointerMove={(e) => handlePointer(e.clientX)}
        onPointerLeave={() => setHover(null)}
      >
        {gridValues.map((gv, i) => (
          <g key={i}>
            <line
              x1={PAD.left}
              x2={VIEW_W - PAD.right}
              y1={yAt(gv)}
              y2={yAt(gv)}
              stroke="var(--line)"
              strokeWidth={1}
            />
            <text x={PAD.left - 8} y={yAt(gv)} textAnchor="end" dominantBaseline="middle" fontSize={10} fill="var(--ink-faint)">
              {valueFormat(gv)}
            </text>
          </g>
        ))}

        <path d={areaPath} fill="var(--brand)" opacity={0.1} stroke="none" />
        <path d={linePath} fill="none" stroke="var(--brand)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {data.length <= 20 &&
          data.map((d, i) => (
            <circle key={i} cx={xAt(i)} cy={yAt(d.value)} r={hover === i ? 5 : 3} fill="var(--brand)" stroke="var(--bg-elevated)" strokeWidth={2} />
          ))}

        <circle cx={xAt(data.length - 1)} cy={yAt(last.value)} r={4} fill="var(--brand)" stroke="var(--bg-elevated)" strokeWidth={2} />
        <text
          x={xAt(data.length - 1)}
          y={yAt(last.value) - 12}
          textAnchor="end"
          fontSize={12}
          fontWeight={600}
          fill="var(--ink)"
        >
          {valueFormat(last.value)}
        </text>

        {hover !== null && (
          <line
            x1={xAt(hover)}
            x2={xAt(hover)}
            y1={PAD.top}
            y2={PAD.top + innerH}
            stroke="var(--ink-faint)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        )}

        {data.map((d, i) => (
          <text key={i} x={xAt(i)} y={height - 8} textAnchor="middle" fontSize={10} fill="var(--ink-faint)">
            {data.length > 10 && i % Math.ceil(data.length / 8) !== 0 && i !== data.length - 1 ? "" : d.label}
          </text>
        ))}
      </svg>

      {hoverPoint && (
        <div
          className="pointer-events-none absolute top-1 rounded-md border border-(--line) bg-(--bg-elevated) px-2.5 py-1.5 text-xs shadow-(--shadow)"
          style={{
            left: `${(xAt(hover!) / VIEW_W) * 100}%`,
            transform: hover! > data.length / 2 ? "translateX(-105%)" : "translateX(5%)",
          }}
        >
          <div className="font-semibold text-foreground">{valueFormat(hoverPoint.value)}</div>
          <div className="text-(--ink-faint)">{hoverPoint.label}</div>
        </div>
      )}
    </div>
  );
}
