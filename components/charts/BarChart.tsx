"use client";

import { useState } from "react";

export interface BarPoint {
  label: string;
  value: number;
}

interface Props {
  data: BarPoint[];
  valueFormat?: (v: number) => string;
  emptyMessage?: string;
  height?: number;
}

const VIEW_W = 600;
const PAD = { left: 34, right: 8, top: 20, bottom: 22 };
const MAX_BAR_W = 24;

function roundedTopPath(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.min(r, h, w / 2);
  if (h <= 0) return "";
  return `M${x},${y + h} L${x},${y + rr} Q${x},${y} ${x + rr},${y} L${x + w - rr},${y} Q${x + w},${y} ${x + w},${y + rr} L${x + w},${y + h} Z`;
}

export function BarChart({ data, valueFormat = (v) => String(Math.round(v * 10) / 10), emptyMessage, height = 200 }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  const hasData = data.some((d) => d.value > 0);
  if (data.length === 0 || !hasData) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-(--ink-faint)">
        {emptyMessage ?? "Todavía no hay datos."}
      </div>
    );
  }

  const innerW = VIEW_W - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const max = Math.max(...data.map((d) => d.value), 1);
  const slot = innerW / data.length;
  const barW = Math.min(MAX_BAR_W, slot * 0.55);
  const baselineY = PAD.top + innerH;

  const yAt = (v: number) => PAD.top + (1 - v / max) * innerH;

  return (
    <div className="relative w-full select-none">
      <svg viewBox={`0 0 ${VIEW_W} ${height}`} width="100%" height={height} preserveAspectRatio="none" className="block overflow-visible">
        <line x1={PAD.left} x2={VIEW_W - PAD.right} y1={baselineY} y2={baselineY} stroke="var(--line)" strokeWidth={1} />
        <text x={PAD.left - 8} y={PAD.top} textAnchor="end" dominantBaseline="hanging" fontSize={10} fill="var(--ink-faint)">
          {valueFormat(max)}
        </text>

        {data.map((d, i) => {
          const cx = PAD.left + slot * i + slot / 2;
          const x = cx - barW / 2;
          const y = yAt(d.value);
          const h = baselineY - y;
          const isLast = i === data.length - 1;
          const isHover = hover === i;
          return (
            <g
              key={i}
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover((h2) => (h2 === i ? null : h2))}
              style={{ cursor: "pointer" }}
            >
              <rect x={x - 6} y={PAD.top} width={barW + 12} height={innerH} fill="transparent" />
              {d.value > 0 && (
                <path d={roundedTopPath(x, y, barW, h, 4)} fill="var(--brand)" opacity={isHover ? 1 : 0.85} />
              )}
              {(isLast || isHover) && d.value > 0 && (
                <text x={cx} y={y - 6} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--ink)">
                  {valueFormat(d.value)}
                </text>
              )}
              <text x={cx} y={height - 8} textAnchor="middle" fontSize={10} fill={isHover ? "var(--ink)" : "var(--ink-faint)"}>
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute top-1 rounded-md border border-(--line) bg-(--bg-elevated) px-2.5 py-1.5 text-xs shadow-(--shadow)"
          style={{
            left: `${((PAD.left + (VIEW_W - PAD.left - PAD.right) / data.length * (hover + 0.5)) / VIEW_W) * 100}%`,
            transform: hover > data.length / 2 ? "translateX(-105%)" : "translateX(5%)",
          }}
        >
          <div className="font-semibold text-foreground">{valueFormat(data[hover].value)}</div>
          <div className="text-(--ink-faint)">{data[hover].label}</div>
        </div>
      )}
    </div>
  );
}
