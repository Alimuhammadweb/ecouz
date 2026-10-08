"use client";
import clsx from "clsx";
import { Check, Circle, Clock, X } from "lucide-react";
import type { ComponentProps } from "react";
import { useI18n } from "@/lib/i18n";

export function Button({
  variant = "primary",
  className,
  ...p
}: ComponentProps<"button"> & { variant?: "primary" | "ghost" }) {
  return (
    <button
      {...p}
      className={clsx(
        "inline-flex h-12 items-center justify-center gap-2 rounded-md px-6 text-sm font-medium transition-[transform,background-color] duration-200 ease-out active:scale-[.98] disabled:opacity-40 md:h-10",
        variant === "primary"
          ? "bg-accent text-accent-fg hover:bg-accent/90"
          : "hairline text-fg hover:bg-raised",
        className,
      )}
    />
  );
}
const S = {
  verified: ["bg-ok/15 text-ok", Check],
  review: ["bg-water/15 text-water", Clock],
  rejected: ["bg-bad/15 text-bad", X],
  pending: ["bg-raised text-muted", Circle],
} as const;
export function StatusBadge({ s, children }: { s: keyof typeof S; children: React.ReactNode }) {
  const [c, I] = S[s];
  const { tr } = useI18n();
  return (
    <span
      className={clsx("inline-flex h-6 items-center gap-1 rounded-sm px-2 text-xs font-medium", c)}
    >
      <I size={14} strokeWidth={1.75} />
      {typeof children === "string" ? tr(children) : children}
    </span>
  );
}
/** Custom coin: milled-edge disc with a water-drop cut-out. */
export function CoinMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="rgb(var(--accent))" />
      <circle
        cx="12"
        cy="12"
        r="8.5"
        fill="none"
        stroke="rgb(var(--accent-fg))"
        strokeOpacity=".35"
        strokeDasharray="1.2 1.2"
      />
      <path
        d="M12 6.5c2.4 3 3.5 4.7 3.5 6.2a3.5 3.5 0 0 1-7 0c0-1.5 1.1-3.2 3.5-6.2Z"
        fill="rgb(var(--accent-fg))"
      />
    </svg>
  );
}
export function CoinAmount({ n, signed }: { n: number; signed?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 font-medium tabular-nums">
      <CoinMark size={16} />
      {signed && n > 0 ? "+" : ""}
      {n.toLocaleString("en-US")}
    </span>
  );
}
export type Step = { label: string; note?: string; state: "done" | "current" | "todo" | "failed" };
export function Timeline({ steps }: { steps: Step[] }) {
  const { tr } = useI18n();
  return (
    <ol>
      {steps.map((s, i) => (
        <li key={s.label} className="relative flex gap-4 pb-6 last:pb-0">
          {i < steps.length - 1 && (
            <span
              className={clsx(
                "absolute left-[11px] top-6 h-[calc(100%-16px)] w-px",
                s.state === "done" ? "bg-accent" : "bg-line/10",
              )}
            />
          )}
          <span
            className={clsx(
              "z-10 grid size-6 shrink-0 place-items-center rounded-full",
              s.state === "done" && "bg-accent text-accent-fg",
              s.state === "current" && "bg-surface ring-2 ring-accent",
              s.state === "todo" && "bg-raised",
              s.state === "failed" && "bg-bad text-white",
            )}
          >
            {s.state === "done" ? (
              <Check size={14} />
            ) : s.state === "failed" ? (
              <X size={14} />
            ) : s.state === "current" ? (
              <span className="size-2 rounded-full bg-accent" />
            ) : null}
          </span>
          <div>
            <p className={clsx("text-sm font-medium", s.state === "todo" && "text-muted")}>
              {tr(s.label)}
            </p>
            {s.note && <p className="text-sm text-muted">{tr(s.note)}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
