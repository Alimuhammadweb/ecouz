"use client";
import { Photo } from "@/components/photo";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { reports } from "@/lib/data";
import { Button, CoinAmount, StatusBadge, Timeline, type Step } from "@/components/ui";
import { ErrorState } from "@/components/states";
import { useI18n } from "@/lib/i18n";

export default function ReportDetail() {
  const { tr } = useI18n();
  const { id } = useParams<{ id: string }>();
  const r = reports.find((x) => x.id === id);
  if (!r)
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <ErrorState
          title="Report not found"
          text="Check the report ID or open it from your dashboard."
          action={
            <Link href="/dashboard">
              <Button>{tr("Back to dashboard")}</Button>
            </Link>
          }
        />
      </main>
    );
  const v = r.status === "verified",
    rej = r.status === "rejected",
    gov = r.path === "government";
  const steps: Step[] = [
    { label: "Reported", note: r.when, state: "done" },
    { label: "Under review", state: r.status === "review" ? "current" : "done" },
    {
      label: rej ? "Rejected" : "Verified",
      note: rej
        ? "Photos didn’t show the location clearly."
        : v
          ? tr("{n} coins awarded", { n: r.coins ?? 0 })
          : undefined,
      state: rej ? "failed" : v ? "done" : "todo",
    },
    ...(rej
      ? []
      : [
          {
            label: gov ? "Government cleanup assigned" : "Community cleanup",
            note: v && !gov ? "Open for volunteers" : undefined,
            state: v ? "current" : "todo",
          } as Step,
          { label: "Completed", state: "todo" } as Step,
          { label: "Rewarded", state: "todo" } as Step,
        ]),
  ];
  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-8 md:px-8 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0">
        <p className="text-sm text-muted">
          {r.id} · {tr(r.when)}
        </p>
        <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
          <h1 className="t-h2">{tr(r.title)}</h1>
          <StatusBadge s={r.status}>
            {rej ? "Rejected" : v ? "Verified" : "Under review"}
          </StatusBadge>
        </div>
        <p className="mt-2 text-sm text-muted">
          {tr(r.category)} · {tr(r.place)}
        </p>
        <div className="mt-6 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className="aspect-[4/3] overflow-hidden rounded-md hairline">
              <Photo kind="before" i={n} label={tr("Photo {n}", { n })} />
            </div>
          ))}
        </div>
        <p className="t-body mt-6">{tr(r.note)}</p>
        <div
          className="relative mt-6 h-48 rounded-lg hairline bg-surface"
          style={{
            backgroundImage:
              "linear-gradient(rgb(var(--line)/.07) 1px,transparent 1px),linear-gradient(90deg,rgb(var(--line)/.07) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        >
          <span
            style={{ left: `${r.x}%`, top: `${r.y}%` }}
            className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-8 ring-accent/20"
          />
        </div>
      </div>
      <aside className="h-fit space-y-6 rounded-lg hairline bg-surface p-5">
        <div>
          <p className="text-sm text-muted">{tr("Reward")}</p>
          <p className="mt-1 text-lg">
            {rej ? (
              <span className="text-sm text-muted">{tr("No coins for rejected reports")}</span>
            ) : (
              <CoinAmount n={r.coins ?? 100} />
            )}
          </p>
          {!v && !rej && (
            <p className="mt-1 text-xs text-muted">
              {tr("Paid once the city verifies this report.")}
            </p>
          )}
        </div>
        <Timeline steps={steps} />
        {v && !gov && (
          <Link
            href="/cleanups"
            className="flex h-12 items-center justify-center rounded-md bg-accent text-sm font-medium text-accent-fg"
          >
            {tr("Find the cleanup")}
          </Link>
        )}
      </aside>
    </main>
  );
}
