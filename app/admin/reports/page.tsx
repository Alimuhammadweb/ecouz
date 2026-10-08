"use client";
import { Photo } from "@/components/photo";
import { useState } from "react";
import clsx from "clsx";
import { Building2, Users, Check, X } from "lucide-react";
import { reports as seed, type Report } from "@/lib/data";
import { Button, CoinAmount, StatusBadge } from "@/components/ui";
import { Dialog } from "@/components/dialog";
import { useI18n } from "@/lib/i18n";

const tabs = ["review", "verified", "rejected"] as const;
const label = { review: "Pending", verified: "Verified", rejected: "Rejected" };
export default function AdminReports() {
  const { tr } = useI18n();
  const [rows, setRows] = useState<Report[]>(seed);
  const [tab, setTab] = useState<(typeof tabs)[number]>("review");
  const [sel, setSel] = useState<string>("R-2041");
  const [dlg, setDlg] = useState<"approve" | "reject" | null>(null);
  const [coins, setCoins] = useState(100);
  const [path, setPath] = useState<"government" | "community">("community");
  const [pool, setPool] = useState(1000);
  const [people, setPeople] = useState(10);
  const list = rows.filter((r) => r.status === tab);
  const cur = rows.find((r) => r.id === sel) ?? list[0];
  const set = (p: Partial<Report>) => {
    setRows(rows.map((r) => (r.id === cur.id ? { ...r, ...p } : r)));
    setDlg(null);
    setTab(p.status ?? tab);
  };
  return (
    <main className="grid gap-4 p-4 md:p-6 lg:grid-cols-[360px_1fr]">
      <section className="rounded-lg hairline bg-surface">
        <div role="tablist" className="flex border-b border-line/10 p-1">
          {tabs.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={clsx(
                "h-10 flex-1 rounded-sm text-sm",
                tab === t ? "bg-raised font-medium" : "text-muted",
              )}
            >
              {tr(label[t])}{" "}
              <span className="text-xs">{rows.filter((r) => r.status === t).length}</span>
            </button>
          ))}
        </div>
        {list.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted">
            {tr("Queue is clear. New reports appear here as citizens submit them.")}
          </p>
        ) : (
          <ul>
            {list.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => setSel(r.id)}
                  className={clsx(
                    "block w-full border-b border-line/10 p-4 text-left last:border-0",
                    cur?.id === r.id ? "bg-raised" : "hover:bg-raised/50",
                  )}
                >
                  <div className="flex justify-between gap-2 text-xs text-muted">
                    <span>{r.id}</span>
                    <span>{tr(r.when)}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium">{tr(r.title)}</p>
                  <p className="text-sm text-muted">{tr(r.place)}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
      {cur && (
        <section className="min-w-0 rounded-lg hairline bg-surface p-4 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted">
                {cur.id} · {tr(cur.category)} · {cur.by}
              </p>
              <h1 className="mt-1 text-2xl font-semibold">{tr(cur.title)}</h1>
            </div>
            <StatusBadge s={cur.status}>
              {cur.status === "review"
                ? tr("Pending review")
                : cur.status === "verified"
                  ? `${tr("Verified")} · ${tr(cur.path === "government" ? "Government cleanup" : "Community cleanup")}`
                  : tr("Rejected")}
            </StatusBadge>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="grid grid-cols-3 gap-2 md:grid-cols-2">
              {[0, 1, 2].map((n) => (
                <div key={n} className="aspect-[4/3] overflow-hidden rounded-md hairline">
                  <Photo kind="before" i={n} label={tr("Photo {n}", { n: n + 1 })} />
                </div>
              ))}
            </div>
            <div
              className="relative min-h-40 rounded-md hairline bg-raised"
              style={{
                backgroundImage:
                  "linear-gradient(rgb(var(--line)/.08) 1px,transparent 1px),linear-gradient(90deg,rgb(var(--line)/.08) 1px,transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            >
              <span
                style={{ left: `${cur.x}%`, top: `${cur.y}%` }}
                className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-8 ring-accent/20"
              />
            </div>
          </div>
          <p className="mt-6 max-w-[60ch] text-sm leading-6">{tr(cur.note)}</p>
          {cur.status === "review" && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => setDlg("approve")}>
                <Check size={16} />
                {tr("Verify report")}
              </Button>
              <Button variant="ghost" onClick={() => setDlg("reject")}>
                <X size={16} />
                {tr("Reject")}
              </Button>
            </div>
          )}
          {cur.status === "verified" && cur.path === "community" && (
            <div className="mt-6 rounded-md hairline p-4">
              <p className="text-sm font-medium">{tr("Coin split")}</p>
              <Calc pool={pool} setPool={setPool} people={people} setPeople={setPeople} />
            </div>
          )}
        </section>
      )}
      <Dialog open={dlg === "approve"} onClose={() => setDlg(null)} title={tr("Verify report")}>
        <label htmlFor="c" className="text-sm font-medium">
          {tr("Coins for the reporter")}
        </label>
        <input
          id="c"
          type="number"
          min={0}
          value={coins}
          onChange={(e) => setCoins(Math.max(0, +e.target.value))}
          className="mt-2 h-12 w-full rounded-md bg-bg px-4 hairline"
        />
        <p className="mb-2 mt-5 text-sm font-medium">{tr("Who cleans it up?")}</p>
        <div className="grid gap-2">
          {(
            [
              ["government", "Government cleanup", Building2],
              ["community", "Community cleanup", Users],
            ] as const
          ).map(([k, l, I]) => (
            <button
              key={k}
              onClick={() => setPath(k)}
              aria-pressed={path === k}
              className={clsx(
                "flex h-14 items-center gap-3 rounded-md px-4 text-sm hairline",
                path === k && "border-accent bg-accent/10 font-medium",
              )}
            >
              <I size={18} strokeWidth={1.75} />
              {tr(l)}
            </button>
          ))}
        </div>
        <Button className="mt-6 w-full" onClick={() => set({ status: "verified", path, coins })}>
          {tr("Verify and award")} <CoinAmount n={coins} />
        </Button>
      </Dialog>
      <Dialog open={dlg === "reject"} onClose={() => setDlg(null)} title={tr("Reject report")}>
        <p className="text-sm text-muted">{tr("The reporter is notified and earns no coins.")}</p>
        <div className="mt-6 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setDlg(null)}>
            {tr("Cancel")}
          </Button>
          <Button
            className="flex-1 bg-bad text-white hover:bg-bad/90"
            onClick={() => set({ status: "rejected" })}
          >
            {tr("Reject report")}
          </Button>
        </div>
      </Dialog>
    </main>
  );
}
function Calc({
  pool,
  setPool,
  people,
  setPeople,
}: {
  pool: number;
  setPool: (n: number) => void;
  people: number;
  setPeople: (n: number) => void;
}) {
  const { tr } = useI18n();
  const per = people ? Math.floor(pool / people) : 0;
  return (
    <div className="mt-3 grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
      <label className="text-xs text-muted">
        {tr("Total reward")}
        <input
          type="number"
          min={0}
          value={pool}
          onChange={(e) => setPool(Math.max(0, +e.target.value))}
          className="mt-1 h-12 w-full rounded-md bg-bg px-3 text-base text-fg hairline"
        />
      </label>
      <span className="hidden pb-3 text-muted sm:block">÷</span>
      <label className="text-xs text-muted">
        {tr("Verified participants")}
        <input
          type="number"
          min={1}
          value={people}
          onChange={(e) => setPeople(Math.max(1, +e.target.value))}
          className="mt-1 h-12 w-full rounded-md bg-bg px-3 text-base text-fg hairline"
        />
      </label>
      <span className="hidden pb-3 text-muted sm:block">=</span>
      <div className="rounded-md bg-accent/10 p-3">
        <p className="text-xs text-muted">{tr("Per participant")}</p>
        <p className="font-display text-2xl font-semibold">
          <CoinAmount n={per} />
        </p>
      </div>
      {pool % people !== 0 && (
        <p className="text-xs text-muted sm:col-span-5">
          {tr("{n} coins remain undistributed (rounded down).", { n: pool - per * people })}
        </p>
      )}
    </div>
  );
}
