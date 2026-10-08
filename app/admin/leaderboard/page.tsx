"use client";
import { useState } from "react";
import { Button, CoinAmount } from "@/components/ui";
import { Dialog } from "@/components/dialog";
import { useI18n, slot } from "@/lib/i18n";

export default function AdminLeaderboard() {
  const { tr } = useI18n();
  const [bonus, setBonus] = useState([500, 300, 200, 100, 100, 50, 50, 50, 50, 50]);
  const [saved, setSaved] = useState(false);
  const [reset, setReset] = useState(false);
  const [season, setSeason] = useState(3);
  return (
    <main className="space-y-4 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{tr("Season {n} rewards", { n: season })}</h1>
          <p className="text-sm text-muted">
            {tr("Bonus coins paid to the top 10 when the season closes.")}
          </p>
        </div>
        <Button variant="ghost" onClick={() => setReset(true)}>
          {tr("Close season")}
        </Button>
      </div>
      <ul className="divide-y divide-line/10 rounded-lg hairline bg-surface">
        {bonus.map((b, i) => (
          <li key={i} className="flex items-center gap-3 p-3 text-sm">
            <span className="w-8 text-muted">#{i + 1}</span>
            <span className="flex-1">{tr("Rank {n}", { n: i + 1 })}</span>
            <input
              aria-label={tr("Bonus for rank {n}", { n: i + 1 })}
              type="number"
              min={0}
              value={b}
              onChange={(e) => {
                setBonus(bonus.map((x, k) => (k === i ? Math.max(0, +e.target.value) : x)));
                setSaved(false);
              }}
              className="h-10 w-24 rounded-md bg-bg px-3 hairline"
            />
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-4">
        <Button onClick={() => setSaved(true)}>{tr("Save bonuses")}</Button>
        {saved ? (
          <p role="status" className="text-sm text-ok">
            {slot(
              tr("Saved. Total payout {coins}"),
              "coins",
              <CoinAmount n={bonus.reduce((a, b) => a + b, 0)} />,
            )}
          </p>
        ) : null}
      </div>
      <Dialog open={reset} onClose={() => setReset(false)} title={tr("Close this season?")}>
        <p className="text-sm text-muted">
          {tr("Bonuses are paid out and monthly rankings reset to zero. This can’t be undone.")}
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setReset(false)}>
            {tr("Cancel")}
          </Button>
          <Button
            className="flex-1 bg-bad text-white hover:bg-bad/90"
            onClick={() => {
              setSeason(season + 1);
              setReset(false);
            }}
          >
            {tr("Close season")}
          </Button>
        </div>
      </Dialog>
    </main>
  );
}
