"use client";
import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { PackageOpen } from "lucide-react";
import { useShared } from "@/lib/shared";
import { Button, Timeline, StatusBadge, type Step } from "@/components/ui";
import { EmptyState } from "@/components/states";
import { useStore } from "@/components/store";
import { useI18n } from "@/lib/i18n";

const flow = ["Pending", "Approved", "Ready", "Delivered"];
export default function MyRewards() {
  const { tr } = useI18n();
  const { owned } = useStore();
  const rewards = useShared().rewards;
  const items = [
    { id: "r1", st: "Ready" },
    { id: "r2", st: "Cancelled" },
    ...owned.map((id) => ({ id, st: "Pending" })),
  ];
  const [tab, setTab] = useState("All");
  const list = items.filter((i) => tab === "All" || i.st === tab);
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <h1 className="t-h2">{tr("My rewards")}</h1>
      <div role="tablist" className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {["All", ...flow, "Cancelled"].map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={clsx(
              "h-10 shrink-0 rounded-md px-4 text-sm hairline",
              tab === t ? "bg-raised font-medium" : "text-muted",
            )}
          >
            {tr(t)}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {list.length === 0 ? (
          <EmptyState
            icon={PackageOpen}
            title="No rewards here"
            text="Redeem coins in the marketplace and they’ll show up here."
            action={
              <Link href="/rewards">
                <Button>{tr("Browse rewards")}</Button>
              </Link>
            }
          />
        ) : (
          list.map(({ id, st }, n) => {
            const r = rewards.find((x) => x.id === id);
            if (!r) return null;
            const at = flow.indexOf(st);
            const steps: Step[] = flow.map((f, i) => ({
              label: f,
              state: i < at ? "done" : i === at ? "current" : "todo",
            }));
            return (
              <article key={id + n} className="rounded-lg hairline bg-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{tr(r.name)}</p>
                    <p className="text-sm text-muted">{tr(r.desc)}</p>
                  </div>
                  <StatusBadge
                    s={st === "Cancelled" ? "rejected" : st === "Pending" ? "review" : "verified"}
                  >
                    {st}
                  </StatusBadge>
                </div>
                {st === "Cancelled" ? (
                  <p className="mt-4 text-sm text-muted">
                    {tr("Cancelled by the district office. Your coins were returned.")}
                  </p>
                ) : (
                  <div className="mt-5">
                    <Timeline steps={steps} />
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </main>
  );
}
