"use client";
import { useState } from "react";
import clsx from "clsx";
import { Button, StatusBadge } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

type St = "checked_in" | "proof" | "verified" | "rejected";
const init: { n: string; c: string; t: string; st: St }[] = [
  { n: "Madina R.", c: "Chust riverbank", t: "09:04", st: "proof" },
  { n: "Timur S.", c: "Chust riverbank", t: "09:11", st: "checked_in" },
  { n: "Aziza K.", c: "Chust riverbank", t: "09:02", st: "proof" },
  { n: "Jasur A.", c: "Kosonsoy market", t: "08:15", st: "verified" },
  { n: "Bekzod T.", c: "Kosonsoy market", t: "08:40", st: "rejected" },
];
const lab = {
  checked_in: ["review", "Checked in"],
  proof: ["review", "Proof submitted"],
  verified: ["verified", "Verified"],
  rejected: ["rejected", "Rejected"],
} as const;
export default function Participants() {
  const { tr } = useI18n();
  const [rows, setRows] = useState(init);
  const [f, setF] = useState<"all" | St>("all");
  const set = (n: string, st: St) => setRows(rows.map((r) => (r.n === n ? { ...r, st } : r)));
  const list = rows.filter((r) => f === "all" || r.st === f);
  return (
    <main className="space-y-4 p-4 md:p-6">
      <div role="tablist" className="flex gap-2 overflow-x-auto">
        {(["all", "checked_in", "proof", "verified", "rejected"] as const).map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={f === k}
            onClick={() => setF(k)}
            className={clsx(
              "h-10 shrink-0 rounded-md px-4 text-sm hairline",
              f === k ? "bg-raised font-medium" : "bg-surface text-muted",
            )}
          >
            {k === "all" ? tr("All") : tr(lab[k][1])}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line/15 p-10 text-center text-sm text-muted">
          {tr("No participants in this state.")}
        </p>
      ) : (
        <ul className="divide-y divide-line/10 rounded-lg hairline bg-surface">
          {list.map((r) => (
            <li key={r.n} className="flex flex-col gap-3 p-4 text-sm sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{r.n}</p>
                <p className="text-muted">
                  {tr(r.c)} · {tr("checked in {t}", { t: r.t })}
                </p>
              </div>
              <StatusBadge s={lab[r.st][0]}>{tr(lab[r.st][1])}</StatusBadge>
              {r.st === "proof" && (
                <div className="flex gap-2">
                  <Button className="h-10" onClick={() => set(r.n, "verified")}>
                    {tr("Verify")}
                  </Button>
                  <Button variant="ghost" className="h-10" onClick={() => set(r.n, "rejected")}>
                    {tr("Reject")}
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
