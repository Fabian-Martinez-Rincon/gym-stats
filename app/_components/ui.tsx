"use client";

import type { ReactNode } from "react";
import { useCountUp } from "./use-count-up";

export function Card({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-(--radius) border border-(--line) bg-(--bg-elevated) p-4 shadow-(--shadow) ${className}`}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatTile({
  label,
  value,
  sub,
  deltaLabel,
  deltaGood,
}: {
  label: string;
  value: string;
  sub?: string;
  deltaLabel?: string;
  deltaGood?: boolean | null;
}) {
  const { ref, display } = useCountUp(value);
  return (
    <div className="rounded-(--radius) border border-(--line) bg-(--bg-elevated) p-4 shadow-(--shadow) transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="text-xs font-medium text-(--ink-faint)">{label}</div>
      <div ref={ref} className="mt-1 text-3xl font-semibold tabular-nums text-foreground">
        {display}
      </div>
      {(sub || deltaLabel) && (
        <div className="mt-1 flex items-center gap-2 text-xs">
          {deltaLabel && (
            <span
              className="font-medium"
              style={{
                color: deltaGood === null || deltaGood === undefined ? "var(--ink-faint)" : deltaGood ? "var(--success)" : "var(--danger)",
              }}
            >
              {deltaLabel}
            </span>
          )}
          {sub && <span className="text-(--ink-faint)">{sub}</span>}
        </div>
      )}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="rounded-(--radius) border border-dashed border-(--line) p-6 text-center text-sm text-(--ink-faint)">{children}</div>;
}

type ButtonVariant = "primary" | "secondary" | "danger";

const buttonVariantClass: Record<ButtonVariant, string> = {
  primary: "bg-(--brand) text-(--brand-foreground) hover:opacity-90",
  secondary: "border border-(--line) text-(--ink-dim) hover:border-(--line-strong) hover:text-foreground",
  danger: "text-(--danger) hover:bg-(--danger-bg)",
};
const buttonBaseClass =
  "inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

export function Button({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button {...props} className={`${buttonBaseClass} ${buttonVariantClass[variant]} ${props.className ?? ""}`}>
      {children}
    </button>
  );
}

// Mismo look que Button pero como <a> — para anclas de scroll (#seccion),
// donde anidar un <button> dentro de un <a> sería HTML inválido.
export function LinkButton({
  children,
  variant = "primary",
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: ButtonVariant }) {
  return (
    <a {...props} className={`${buttonBaseClass} ${buttonVariantClass[variant]} ${props.className ?? ""}`}>
      {children}
    </a>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-(--ink-dim)">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "rounded-md border border-(--line) bg-(--bg) px-2.5 py-1.5 text-sm text-foreground outline-none transition focus:border-(--brand)";
