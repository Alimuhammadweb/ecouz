"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { setShared, useShared } from "@/lib/shared";
import { Button, StatusBadge } from "@/components/ui";
import { Dialog } from "@/components/dialog";
import { Field } from "@/components/field";
import { useI18n } from "@/lib/i18n";

type R = { id: string; name: string; desc: string; price: number; stock: number; on: boolean };
export default function AdminRewards() {
  const { tr } = useI18n();
  const rows: R[] = useShared().rewards;
  const setRows = (r: R[]) => setShared({ rewards: r });
  const [del, setDel] = useState<R | null>(null);
  const [add, setAdd] = useState(false);
  const [f, setF] = useState({ name: "", price: "", stock: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const up = (id: string, p: Partial<R>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...p } : r)));
  const create = () => {
    const e: Record<string, string> = {};
    if (f.name.trim().length < 3) e.name = "Enter a reward name";
    if (!(+f.price > 0)) e.price = "Price must be above 0";
    if (f.stock === "" || +f.stock < 0) e.stock = "Enter stock";
    setErr(e);
    if (Object.keys(e).length) return;
    setRows([
      ...rows,
      {
        id: `n${rows.length}`,
        name: f.name,
        desc: "New reward",
        price: +f.price,
        stock: +f.stock,
        on: true,
      },
    ]);
    setAdd(false);
    setF({ name: "", price: "", stock: "" });
  };
  return (
    <main className="space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{tr("Rewards")}</h1>
        <Button onClick={() => setAdd(true)}>
          <Plus size={16} />
          {tr("Add reward")}
        </Button>
      </div>
      <ul className="divide-y divide-line/10 rounded-lg hairline bg-surface">
        {rows.map((r) => (
          <li key={r.id} className="flex flex-col gap-3 p-4 text-sm sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{tr(r.name)}</p>
              <p className="text-muted">{tr("{n} in stock", { n: r.stock })}</p>
            </div>
            <label className="flex items-center gap-2 text-muted">
              {tr("Price")}
              <input
                type="number"
                min={1}
                value={r.price}
                onChange={(e) => up(r.id, { price: Math.max(1, +e.target.value) })}
                className="h-10 w-24 rounded-md bg-bg px-3 text-fg hairline"
              />
            </label>
            <button
              role="switch"
              aria-checked={r.on}
              onClick={() => up(r.id, { on: !r.on })}
              className="flex h-10 items-center gap-2"
            >
              <StatusBadge s={r.on && r.stock > 0 ? "verified" : "pending"}>
                {r.on ? (r.stock > 0 ? "Available" : "Out of stock") : "Hidden"}
              </StatusBadge>
            </button>
            <button
              aria-label={tr("Remove {name}", { name: tr(r.name) })}
              onClick={() => setDel(r)}
              className="grid size-10 place-items-center rounded-md text-muted hover:bg-bad/10 hover:text-bad"
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>
      <Dialog open={add} onClose={() => setAdd(false)} title={tr("Add reward")}>
        <div className="space-y-4">
          <Field
            id="rn"
            label={tr("Name")}
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
            error={err.name}
          />
          <Field
            id="rp"
            label={tr("Coin price")}
            type="number"
            value={f.price}
            onChange={(e) => setF({ ...f, price: e.target.value })}
            error={err.price}
          />
          <Field
            id="rs"
            label={tr("Stock")}
            type="number"
            value={f.stock}
            onChange={(e) => setF({ ...f, stock: e.target.value })}
            error={err.stock}
          />
          <Button className="w-full" onClick={create}>
            {tr("Add reward")}
          </Button>
        </div>
      </Dialog>
      <Dialog open={!!del} onClose={() => setDel(null)} title={tr("Remove reward?")}>
        <p className="text-sm text-muted">
          {tr("{name} disappears from the marketplace. Existing redemptions are not affected.", {
            name: tr(del?.name ?? ""),
          })}
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setDel(null)}>
            {tr("Cancel")}
          </Button>
          <Button
            className="flex-1 bg-bad text-white hover:bg-bad/90"
            onClick={() => {
              setRows(rows.filter((r) => r.id !== del!.id));
              setDel(null);
            }}
          >
            {tr("Remove")}
          </Button>
        </div>
      </Dialog>
    </main>
  );
}
