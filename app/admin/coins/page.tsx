"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button, CoinAmount } from "@/components/ui";
import { Dialog } from "@/components/dialog";
import { Field } from "@/components/field";
import { useI18n } from "@/lib/i18n";

export default function AdminCoins() {
  const { tr } = useI18n();
  const [rows, setRows] = useState([
    { id: 1, who: "Madina R.", why: "Cleanup completed", n: 250, w: "Today" },
    { id: 2, who: "Aziza K.", why: "Report verified R-2036", n: 100, w: "Yesterday" },
    { id: 3, who: "Timur S.", why: "Reward redeemed", n: -800, w: "Yesterday" },
  ]);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ who: "", n: "", why: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const add = () => {
    const e: Record<string, string> = {};
    if (!f.who.trim()) e.who = "Enter a user";
    if (!+f.n) e.n = "Enter a non-zero amount";
    if (f.why.trim().length < 4) e.why = "Give a reason for the audit log";
    setErr(e);
    if (Object.keys(e).length) return;
    setRows([{ id: Date.now(), who: f.who, why: f.why, n: +f.n, w: "Just now" }, ...rows]);
    setOpen(false);
    setF({ who: "", n: "", why: "" });
  };
  const total = rows.reduce((a, r) => a + r.n, 0);
  return (
    <main className="space-y-4 p-4 md:p-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-muted">{tr("Net coins in this ledger")}</p>
          <p className="text-2xl font-semibold">
            <CoinAmount n={total} signed />
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} />
          {tr("Adjust coins")}
        </Button>
      </div>
      <ul className="divide-y divide-line/10 rounded-lg hairline bg-surface">
        {rows.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-3 p-4 text-sm">
            <div className="min-w-0">
              <p className="font-medium">{r.who}</p>
              <p className="truncate text-muted">
                {tr(r.why)} · {tr(r.w)}
              </p>
            </div>
            <CoinAmount n={r.n} signed />
          </li>
        ))}
      </ul>
      <Dialog open={open} onClose={() => setOpen(false)} title={tr("Adjust coins")}>
        <div className="space-y-4">
          <Field
            id="w"
            label={tr("User")}
            value={f.who}
            onChange={(e) => setF({ ...f, who: e.target.value })}
            error={err.who}
          />
          <Field
            id="a"
            label={tr("Amount (negative to deduct)")}
            type="number"
            value={f.n}
            onChange={(e) => setF({ ...f, n: e.target.value })}
            error={err.n}
          />
          <Field
            id="r"
            label={tr("Reason")}
            value={f.why}
            onChange={(e) => setF({ ...f, why: e.target.value })}
            error={err.why}
          />
          <Button className="w-full" onClick={add}>
            {tr("Record adjustment")}
          </Button>
        </div>
      </Dialog>
    </main>
  );
}
