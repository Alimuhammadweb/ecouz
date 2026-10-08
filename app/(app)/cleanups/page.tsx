"use client";
import { Photo } from "@/components/photo";
import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { MapPin, Calendar, Users, SearchX } from "lucide-react";
import { cleanups } from "@/lib/data";
import { CoinAmount, StatusBadge } from "@/components/ui";
import { Skeleton, EmptyState } from "@/components/states";
import { useStore } from "@/components/store";
import { useI18n } from "@/lib/i18n";

const sorts = {
  near: "Nearby",
  soon: "Soonest",
  reward: "Highest reward",
  crowd: "Most participants",
} as const;
export default function Cleanups() {
  const { tr } = useI18n();
  const [sort, setSort] = useState<keyof typeof sorts>("near");
  const [q, setQ] = useState("");
  const [load, setLoad] = useState(true);
  const { part } = useStore();
  useEffect(() => {
    const t = setTimeout(() => setLoad(false), 600);
    return () => clearTimeout(t);
  }, []);
  const list = cleanups
    .filter((c) => (c.title + c.place).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) =>
      sort === "near"
        ? a.km - b.km
        : sort === "reward"
          ? b.reward - a.reward
          : sort === "crowd"
            ? b.joined - a.joined
            : a.id.localeCompare(b.id),
    );
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <h1 className="t-h2">{tr("Cleanups near you")}</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label={tr("Search cleanups")}
        placeholder={tr("Search by name or district")}
        className="mt-6 h-12 w-full max-w-md rounded-md bg-surface px-4 hairline placeholder:text-muted"
      />
      <div
        className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0"
        role="tablist"
      >
        {(Object.keys(sorts) as (keyof typeof sorts)[]).map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={sort === k}
            onClick={() => setSort(k)}
            className={clsx(
              "h-10 shrink-0 rounded-md px-4 text-sm hairline",
              sort === k ? "bg-raised font-medium" : "text-muted",
            )}
          >
            {tr(sorts[k])}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {load ? (
          [0, 1, 2, 3].map((n) => <Skeleton key={n} className="h-52" />)
        ) : list.length === 0 ? (
          <div className="md:col-span-2">
            <EmptyState
              icon={SearchX}
              title="No cleanups match"
              text="Try a different district or clear the search."
            />
          </div>
        ) : (
          list.map((c) => (
            <Link
              key={c.id}
              href={`/cleanups/${c.id}`}
              className="group rounded-lg hairline bg-surface p-5 transition-colors hover:bg-raised/50"
            >
              <div className="-mx-5 -mt-5 mb-4 aspect-[16/7] overflow-hidden rounded-t-lg">
                <Photo
                  kind={c.status === "done" ? "after" : "before"}
                  i={Number(c.id.slice(1))}
                  label={tr(c.title)}
                />
              </div>
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold">{tr(c.title)}</h2>
                <StatusBadge
                  s={part[c.id] ? "verified" : c.status === "open" ? "review" : "pending"}
                >
                  {part[c.id]
                    ? "Joined"
                    : c.status === "open"
                      ? "Open"
                      : c.status === "full"
                        ? "Full"
                        : "Completed"}
                </StatusBadge>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                <li className="flex gap-2">
                  <MapPin size={16} strokeWidth={1.75} />
                  {tr(c.place)} · {tr("{n} km", { n: c.km })}
                </li>
                <li className="flex gap-2">
                  <Calendar size={16} strokeWidth={1.75} />
                  {tr(c.date)}, {c.time}
                </li>
                <li className="flex gap-2">
                  <Users size={16} strokeWidth={1.75} />
                  {tr("{n} of {cap} joined", { n: c.joined + (part[c.id] ? 1 : 0), cap: c.cap })}
                </li>
              </ul>
              <div className="mt-4 h-1 rounded-full bg-line/10">
                <div
                  className="h-1 rounded-full bg-accent"
                  style={{
                    width: `${Math.min(100, ((c.joined + (part[c.id] ? 1 : 0)) / c.cap) * 100)}%`,
                  }}
                />
              </div>
              <p className="mt-4 flex justify-between text-sm">
                <span className="text-muted">{tr("Reward pool")}</span>
                <CoinAmount n={c.reward} />
              </p>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
