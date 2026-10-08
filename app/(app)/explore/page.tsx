"use client";
import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { Search, X, MapPin } from "lucide-react";
import { reports, cleanups } from "@/lib/data";
import { CoinAmount, StatusBadge } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

const pos: Record<string, [number, number]> = {
  c1: [46, 56],
  c2: [64, 32],
  c3: [32, 74],
  c4: [22, 30],
};
const kinds = {
  all: "All",
  pollution: "Pollution",
  active: "Active cleanup",
  done: "Completed",
} as const;
type Pin = {
  id: string;
  kind: "pollution" | "active" | "done";
  title: string;
  place: string;
  x: number;
  y: number;
  href: string;
  reward?: number;
};
const pins: Pin[] = [
  ...reports
    .filter((r) => r.status !== "rejected")
    .map((r): Pin => ({
      id: r.id,
      kind: "pollution",
      title: r.title,
      place: r.place,
      x: r.x,
      y: r.y,
      href: `/reports/${r.id}`,
    })),
  ...cleanups.map((c): Pin => ({
    id: c.id,
    kind: c.status === "done" ? "done" : "active",
    title: c.title,
    place: c.place,
    x: pos[c.id][0],
    y: pos[c.id][1],
    href: `/cleanups/${c.id}`,
    reward: c.reward,
  })),
];
const dot = {
  pollution: "bg-accent ring-accent/25",
  active: "bg-water ring-water/25",
  done: "bg-ok ring-ok/25",
};
const lab = {
  pollution: ["review", "Pollution report"],
  active: ["review", "Cleanup open"],
  done: ["verified", "Completed"],
} as const;
export default function Explore() {
  const { tr } = useI18n();
  const [f, setF] = useState<keyof typeof kinds>("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string | null>(null);
  const vis = pins.filter(
    (p) =>
      (f === "all" || p.kind === f) && (p.title + p.place).toLowerCase().includes(q.toLowerCase()),
  );
  const cur = pins.find((p) => p.id === sel && vis.includes(p));
  const Card = cur && (
    <div className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <StatusBadge s={lab[cur.kind][0]}>{tr(lab[cur.kind][1])}</StatusBadge>
          <h2 className="mt-3 font-semibold">{tr(cur.title)}</h2>
          <p className="mt-1 flex gap-1 text-sm text-muted">
            <MapPin size={16} />
            {tr(cur.place)}
          </p>
        </div>
        <button
          aria-label={tr("Close")}
          onClick={() => setSel(null)}
          className="grid size-10 place-items-center rounded-md text-muted hover:bg-raised"
        >
          <X size={18} />
        </button>
      </div>
      {cur.reward && (
        <p className="mt-4 flex justify-between text-sm">
          <span className="text-muted">{tr("Reward pool")}</span>
          <CoinAmount n={cur.reward} />
        </p>
      )}
      <Link
        href={cur.href}
        className="mt-5 flex h-12 items-center justify-center rounded-md bg-accent text-sm font-medium text-accent-fg"
      >
        {tr("View details")}
      </Link>
    </div>
  );
  return (
    <main className="relative lg:grid lg:h-[calc(100dvh-4rem)] lg:grid-cols-[1fr_360px]">
      <div
        className="relative h-[calc(100dvh-4rem-4rem)] overflow-hidden lg:h-full"
        style={{
          backgroundImage:
            "linear-gradient(rgb(var(--line)/.07) 1px,transparent 1px),linear-gradient(90deg,rgb(var(--line)/.07) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      >
        <svg className="absolute inset-0 size-full" aria-hidden>
          <path
            d="M-20 300 C 200 180, 380 420, 1400 260"
            stroke="rgb(var(--water))"
            strokeOpacity=".25"
            strokeWidth="20"
            fill="none"
          />
        </svg>
        <div className="absolute inset-x-3 top-3 z-10 space-y-2 lg:right-auto lg:w-96">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-4 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label={tr("Search the map")}
              placeholder={tr("Search district or site")}
              className="h-12 w-full rounded-md bg-surface pl-11 pr-4 hairline placeholder:text-muted"
            />
          </div>
          <div role="tablist" className="flex gap-2 overflow-x-auto">
            {(Object.keys(kinds) as (keyof typeof kinds)[]).map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={f === k}
                onClick={() => setF(k)}
                className={clsx(
                  "h-10 shrink-0 rounded-md px-3 text-sm hairline",
                  f === k ? "bg-raised font-medium" : "bg-surface text-muted",
                )}
              >
                {tr(kinds[k])}
              </button>
            ))}
          </div>
        </div>
        {vis.map((p) => (
          <button
            key={p.id}
            aria-label={tr(p.title)}
            onClick={() => setSel(p.id)}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className="absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
          >
            <span
              className={clsx(
                "block rounded-full ring-8 transition-transform",
                dot[p.kind],
                sel === p.id ? "size-5 scale-110" : "size-3.5",
              )}
            />
          </button>
        ))}
        {vis.length === 0 && (
          <p className="absolute inset-x-0 top-1/2 text-center text-sm text-muted">
            {tr("Nothing matches these filters.")}
          </p>
        )}
      </div>
      <aside className="hidden border-l border-line/10 bg-surface lg:block">
        {Card ?? (
          <p className="p-5 text-sm text-muted">
            {tr("Select a marker to see details. {n} shown.", { n: vis.length })}
          </p>
        )}
      </aside>
      <AnimatePresence>
        {cur && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed inset-x-0 bottom-16 z-40 rounded-t-lg border-t border-line/10 bg-surface lg:hidden"
          >
            {Card}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
