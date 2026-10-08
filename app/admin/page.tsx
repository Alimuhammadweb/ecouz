"use client";
import Link from "next/link";
import { CoinAmount } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

const kpi: [string, string | number][] = [
  ["Users", "9,310"],
  ["Active this week", "2,148"],
  ["Pending reports", 2],
  ["Active cleanups", 3],
  ["Pending proofs", 1],
  ["Rewards redeemed", 412],
];
const week = [14, 22, 18, 31, 27, 36, 29];
const feed = [
  ["Proof submitted", "Chust riverbank", "12 min ago"],
  ["Report submitted", "R-2041 · Plastic dump", "1 h ago"],
  ["Reward requested", "Cinema ticket pair", "3 h ago"],
  ["School 110 joined", "14 new students", "Yesterday"],
];
export default function Overview() {
  const { tr } = useI18n();
  const max = Math.max(...week);
  return (
    <main className="space-y-4 p-4 md:p-6">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg hairline bg-line/10 sm:grid-cols-3 xl:grid-cols-6">
        {kpi.map(([k, v]) => (
          <div key={k} className="bg-surface p-4">
            <dt className="text-xs text-muted">{tr(k)}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <section className="rounded-lg hairline bg-surface p-4 md:p-6">
          <div className="flex justify-between text-sm">
            <p className="font-medium">{tr("Reports per day")}</p>
            <p className="text-muted">
              {tr("Coins distributed")} <CoinAmount n={412000} />
            </p>
          </div>
          <div
            className="mt-6 flex h-40 items-end gap-2"
            role="img"
            aria-label={tr("Reports per day, last 7 days")}
          >
            {week.map((n, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-sm bg-water/70"
                  style={{ height: `${(n / max) * 100}%` }}
                />
                <span className="text-xs text-muted">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg hairline bg-surface">
          <p className="border-b border-line/10 p-4 text-sm font-medium">{tr("Needs attention")}</p>
          {[
            ["2 reports waiting for review", "/admin/reports"],
            ["1 cleanup proof to verify", "/admin/cleanups"],
          ].map(([l, h]) => (
            <Link
              key={h}
              href={h}
              className="flex min-h-12 items-center border-b border-line/10 px-4 text-sm last:border-0 hover:bg-raised/50"
            >
              {tr(l)}
            </Link>
          ))}
        </section>
      </div>
      <section className="rounded-lg hairline bg-surface">
        <p className="border-b border-line/10 p-4 text-sm font-medium">{tr("Recent activity")}</p>
        <ul className="divide-y divide-line/10 text-sm">
          {feed.map(([a, b, c]) => (
            <li key={a + b} className="flex flex-wrap justify-between gap-1 p-4">
              <span>
                <b className="font-medium">{tr(a)}</b> <span className="text-muted">· {tr(b)}</span>
              </span>
              <span className="text-muted">{tr(c)}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
