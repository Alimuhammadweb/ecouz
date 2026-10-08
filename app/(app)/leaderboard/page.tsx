"use client";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { Gift } from "lucide-react";
import { CoinAmount } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

const names = [
  "Madina R.",
  "Timur S.",
  "Aziza K.",
  "Jasur A.",
  "Dilnoza M.",
  "Bekzod T.",
  "Nodira Y.",
  "Sardor U.",
  "Malika H.",
  "Otabek N.",
  "Zarina F.",
  "Rustam B.",
];
const schools = ["School No. 110", "School No. 45", "School No. 21", "Presidential School"];
const tabs = ["Global", "Monthly", "City", "School"] as const;
export default function Leaderboard() {
  const { tr } = useI18n();
  const [t, setT] = useState<(typeof tabs)[number]>("Global");
  const rows = useMemo(() => {
    const k = tabs.indexOf(t) + 1;
    return Array.from({ length: t === "School" ? 20 : 50 }, (_, i) => ({
      n: names[(i * k + i) % names.length],
      sc: schools[(i + k) % 4],
      c: Math.round((6200 - i * 105) / (t === "Monthly" ? 4 : 1)),
      cl: 31 - Math.floor(i / 2),
    }));
  }, [t]);
  const medal = ["bg-accent text-accent-fg", "bg-fg/70 text-bg", "bg-fg/40 text-bg"];
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <h1 className="t-h2">{tr("Leaderboard")}</h1>
      <div role="tablist" className="mt-6 flex gap-2 overflow-x-auto">
        {tabs.map((x) => (
          <button
            key={x}
            role="tab"
            aria-selected={t === x}
            onClick={() => setT(x)}
            className={clsx(
              "h-10 shrink-0 rounded-md px-4 text-sm hairline",
              t === x ? "bg-raised font-medium" : "text-muted",
            )}
          >
            {tr(x)}
          </button>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-3 items-end gap-2">
        {[1, 0, 2].map((i) => (
          <div
            key={i}
            className={clsx(
              "rounded-lg hairline bg-surface p-3 text-center sm:p-5",
              i === 0 ? "pb-8 sm:pb-12" : "",
            )}
          >
            <span
              className={clsx(
                "mx-auto grid size-8 place-items-center rounded-full text-sm font-semibold",
                medal[i],
              )}
            >
              {i + 1}
            </span>
            <p className="mt-3 truncate text-sm font-medium">{rows[i].n}</p>
            <p className="truncate text-xs text-muted">{tr(rows[i].sc)}</p>
            <p className="mt-2 text-sm">
              <CoinAmount n={rows[i].c} />
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-start gap-3 rounded-lg bg-accent/10 p-4 text-sm">
        <Gift size={18} className="mt-0.5 shrink-0 text-accent" />
        <p>
          {tr(
            "The top 10 each month receive a bonus reward. You’re currently {rank}, 310 coins behind #10.",
          )
            .split("{rank}")
            .flatMap((part, n) => (n ? [<b key={n}>#14</b>, part] : [part]))}
        </p>
      </div>
      <ol className="mt-4 divide-y divide-line/10 rounded-lg hairline bg-surface">
        {rows.slice(3).map((r, i) => (
          <li
            key={i}
            className={clsx(
              "flex items-center gap-3 p-4 text-sm",
              i + 4 <= 10 && "bg-accent/[.04]",
            )}
          >
            <span className="w-7 text-right tabular-nums text-muted">{i + 4}</span>
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-raised text-xs font-medium">
              {r.n.slice(0, 1)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{r.n}</p>
              <p className="truncate text-muted">
                {tr(r.sc)} · {tr("{n} cleanups", { n: r.cl })}
              </p>
            </div>
            <CoinAmount n={r.c} />
          </li>
        ))}
      </ol>
    </main>
  );
}
