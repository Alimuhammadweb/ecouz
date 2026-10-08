"use client";
import { useState } from "react";
import clsx from "clsx";
import { Receipt } from "lucide-react";
import { txs } from "@/lib/data";
import { CoinAmount, StatusBadge } from "@/components/ui";
import { EmptyState } from "@/components/states";
import { Balance } from "@/components/store";
import { useI18n } from "@/lib/i18n";

const f = { all: "All", in: "Earned", out: "Spent", pending: "Pending" } as const;
export default function Coins() {
  const { tr } = useI18n();
  const [t, setT] = useState<keyof typeof f>("all");
  const list = txs.filter(
    (x) =>
      t === "all" ||
      (t === "in" && x.n > 0 && !x.pending) ||
      (t === "out" && x.n < 0) ||
      (t === "pending" && x.pending),
  );
  const sum = (fn: (n: number) => boolean) =>
    txs.filter((x) => !x.pending && fn(x.n)).reduce((a, x) => a + Math.abs(x.n), 0);
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <p className="text-sm text-muted">{tr("Current balance")}</p>
      <p className="font-display text-5xl font-semibold">
        <Balance />
      </p>
      <dl className="mt-6 grid grid-cols-3 divide-x divide-line/10 rounded-lg hairline bg-surface text-sm">
        {[
          ["Earned", sum((n) => n > 0)],
          ["Spent", sum((n) => n < 0)],
          ["Pending", 100],
        ].map(([k, v]) => (
          <div key={k as string} className="p-4">
            <dt className="text-muted">{tr(k as string)}</dt>
            <dd className="mt-1">
              <CoinAmount n={v as number} />
            </dd>
          </div>
        ))}
      </dl>
      <div role="tablist" className="mt-8 flex gap-2">
        {(Object.keys(f) as (keyof typeof f)[]).map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={t === k}
            onClick={() => setT(k)}
            className={clsx(
              "h-10 rounded-md px-4 text-sm hairline",
              t === k ? "bg-raised font-medium" : "text-muted",
            )}
          >
            {tr(f[k])}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {list.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="Nothing here yet"
            text="Transactions of this type will show up as you report and clean."
          />
        ) : (
          <ul className="divide-y divide-line/10 rounded-lg hairline bg-surface">
            {list.map((x) => (
              <li key={x.id} className="flex items-center justify-between gap-3 p-4 text-sm">
                <div className="min-w-0">
                  <p className="truncate">{tr(x.label)}</p>
                  <p className="text-muted">{tr(x.when)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {x.pending && <StatusBadge s="review">{tr("Pending")}</StatusBadge>}
                  <span className={x.n < 0 ? "text-muted" : ""}>
                    <CoinAmount n={x.n} signed />
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
