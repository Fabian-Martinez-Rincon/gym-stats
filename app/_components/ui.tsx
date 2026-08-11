import type { ReactNode } from "react";

export function Card({ title, action, children }: { title?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-(--radius) border border-(--line) bg-(--bg-elevated) p-4 shadow-(--shadow)">
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-2">
          {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
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
  return (
    <div className="rounded-(--radius) border border-(--line) bg-(--bg-elevated) p-4 shadow-(--shadow)">
      <div className="text-xs font-medium text-(--ink-faint)">{label}</div>
      <div className="mt-1 text-3xl font-semibold text-foreground">{value}</div>
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

export function Button({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" }) {
  const styles = {
    primary: "bg-(--brand) text-(--brand-foreground) hover:opacity-90",
    secondary: "border border-(--line) text-(--ink-dim) hover:border-(--line-strong) hover:text-foreground",
    danger: "text-(--danger) hover:bg-(--danger-bg)",
  } as const;
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${props.className ?? ""}`}
    >
      {children}
    </button>
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
