"use client";
import { Photo } from "@/components/photo";
import { useState } from "react";
import clsx from "clsx";
import { Check, X } from "lucide-react";
import { cleanups } from "@/lib/data";
import { Button, CoinAmount, StatusBadge } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

const people = [
  "Madina R.",
  "Timur S.",
  "Aziza K.",
  "Jasur A.",
  "Dilnoza M.",
  "Bekzod T.",
  "Nodira Y.",
  "Sardor U.",
];
export default function AdminCleanups() {
  const { tr } = useI18n();
  const list = cleanups.filter((c) => c.status !== "open" || c.joined > 0);
  const [id, setId] = useState(list[0].id);
  const c = cleanups.find((x) => x.id === id)!;
  const [ok, setOk] = useState<Record<string, boolean>>(
    Object.fromEntries(people.map((p, i) => [p, i < 6])),
  );
  const [proof, setProof] = useState<"pending" | "approved" | "rejected">("pending");
  const [paid, setPaid] = useState(false);
  const n = Object.values(ok).filter(Boolean).length;
  const per = n ? Math.floor(c.reward / n) : 0;
  return (
    <main className="grid gap-4 p-4 md:p-6 lg:grid-cols-[320px_1fr]">
      <ul className="h-fit rounded-lg hairline bg-surface">
        {list.map((x) => (
          <li key={x.id}>
            <button
              onClick={() => {
                setId(x.id);
                setProof("pending");
                setPaid(false);
              }}
              className={clsx(
                "block w-full border-b border-line/10 p-4 text-left last:border-0",
                id === x.id ? "bg-raised" : "hover:bg-raised/50",
              )}
            >
              <p className="text-sm font-medium">{tr(x.title)}</p>
              <p className="text-sm text-muted">
                {tr(x.date)} · {tr("{n} joined", { n: x.joined })}
              </p>
            </button>
          </li>
        ))}
      </ul>
      <section className="min-w-0 space-y-4">
        <div className="rounded-lg hairline bg-surface p-4 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-xl font-semibold">{tr(c.title)}</h1>
            <StatusBadge
              s={proof === "approved" ? "verified" : proof === "rejected" ? "rejected" : "review"}
            >
              {proof === "pending"
                ? tr("Proof awaiting review")
                : proof === "approved"
                  ? tr("Proof approved")
                  : tr("Proof rejected")}
            </StatusBadge>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {(
              [
                ["Before", "before"],
                ["During", "during"],
                ["After", "after"],
                ["Group", "during"],
              ] as const
            ).map(([s, k], n) => (
              <div key={s} className="relative aspect-square overflow-hidden rounded-md hairline">
                <Photo kind={k} i={n === 3 ? 2 : 0} label={tr("{stage} photo", { stage: tr(s) })} />
                <span className="absolute bottom-1 left-1 rounded-sm bg-bg/90 px-1.5 text-xs">
                  {tr(s)}
                </span>
              </div>
            ))}
          </div>
          {proof === "pending" && (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => setProof("approved")}>
                <Check size={16} />
                {tr("Approve proof")}
              </Button>
              <Button variant="ghost" onClick={() => setProof("rejected")}>
                <X size={16} />
                {tr("Reject proof")}
              </Button>
            </div>
          )}
        </div>
        <div className="rounded-lg hairline bg-surface">
          <p className="border-b border-line/10 p-4 text-sm font-medium">
            {tr("Participants · tick those whose attendance is verified")}
          </p>
          <ul className="grid sm:grid-cols-2">
            {people.map((p) => (
              <li key={p}>
                <label className="flex min-h-12 cursor-pointer items-center gap-3 border-b border-line/10 px-4 text-sm">
                  <input
                    type="checkbox"
                    checked={ok[p]}
                    onChange={() => setOk({ ...ok, [p]: !ok[p] })}
                    className="size-4 accent-[rgb(var(--accent))]"
                  />
                  {p}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg hairline bg-surface p-4 md:p-6">
          <p className="text-sm font-medium">{tr("Reward split")}</p>
          <div className="mt-3 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
            <div>
              <p className="text-xs text-muted">{tr("Total reward")}</p>
              <CoinAmount n={c.reward} />
            </div>
            <span className="text-muted max-sm:hidden">÷</span>
            <div>
              <p className="text-xs text-muted">{tr("Verified participants")}</p>
              <span className="font-medium">{n}</span>
            </div>
            <span className="text-muted max-sm:hidden">=</span>
            <div className="rounded-md bg-accent/10 p-3">
              <p className="text-xs text-muted">{tr("Per participant")}</p>
              <span className="font-display text-2xl font-semibold">
                <CoinAmount n={per} />
              </span>
            </div>
          </div>
          <Button
            className="mt-5"
            disabled={proof !== "approved" || n === 0 || paid}
            onClick={() => setPaid(true)}
          >
            {paid ? tr("Distributed to {n} participants", { n }) : tr("Distribute coins")}
          </Button>
          {proof !== "approved" && (
            <p className="mt-2 text-xs text-muted">
              {tr("Approve the proof before distributing coins.")}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
