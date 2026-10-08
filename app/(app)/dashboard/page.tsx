"use client";
import { Timeline, CoinAmount, StatusBadge } from "@/components/ui";
import { Balance } from "@/components/store";
import { useI18n } from "@/lib/i18n";

const tx: [string, number][] = [
  ["Report verified", 100],
  ["Cleanup completed", 250],
  ["Reward redeemed", -500],
];
export default function Dashboard() {
  const { tr } = useI18n();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <p className="text-sm text-muted">{tr("Good morning, Aziza")}</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="t-h2">{tr("Your next cleanup is Saturday.")}</h1>
        <div className="sm:text-right">
          <p className="text-sm text-muted">{tr("Balance")}</p>
          <p className="font-display text-3xl font-semibold">
            <Balance />
          </p>
        </div>
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-lg hairline bg-surface p-6">
          <div className="flex justify-between gap-2">
            <h2 className="font-semibold">{tr("Chust riverbank cleanup")}</h2>
            <StatusBadge s="review">{tr("Checked in")}</StatusBadge>
          </div>
          <div className="mt-6">
            <Timeline
              steps={[
                { label: "Joined", state: "done" },
                { label: "Checked in", note: "42 m from site", state: "done" },
                { label: "Participating", state: "current" },
                { label: "Proof submitted", state: "todo" },
                { label: "Verified", state: "todo" },
                { label: "Rewarded", note: "Est. 100 coins", state: "todo" },
              ]}
            />
          </div>
        </section>
        <section className="rounded-lg hairline bg-surface p-6">
          <h2 className="font-semibold">{tr("Recent activity")}</h2>
          <ul className="mt-4 divide-y divide-line/10 text-sm">
            {tx.map(([l, n]) => (
              <li key={l} className="flex justify-between py-3">
                <span>{tr(l)}</span>
                <CoinAmount n={n} signed />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
