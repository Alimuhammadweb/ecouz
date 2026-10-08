"use client";
import { useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button, CoinAmount } from "@/components/ui";
import { Dialog } from "@/components/dialog";
import { Field } from "@/components/field";
import { Balance, useStore } from "@/components/store";
import { BadgeGrid } from "@/components/badge-grid";
import { useI18n } from "@/lib/i18n";

export default function Profile() {
  const { tr } = useI18n();
  const [p, setP] = useState({ name: "Aziza Karimova", cls: "9A" });
  const [d, setD] = useState(p);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const { toast } = useStore();
  const save = () => {
    if (d.name.trim().length < 2) return setErr("Enter your name");
    setP(d);
    setOpen(false);
    setErr("");
    toast("Profile saved");
  };
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <div className="flex items-center gap-4">
        <span className="grid size-20 place-items-center rounded-full bg-raised font-display text-2xl font-semibold">
          {p.name[0]}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-2xl font-semibold">{p.name}</h1>
          <p className="text-sm text-muted">
            {tr("Student · School No. 110, class {cls}", { cls: p.cls })}
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            setD(p);
            setOpen(true);
          }}
        >
          <Pencil size={16} />
          <span className="hidden sm:inline">{tr("Edit")}</span>
        </Button>
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg hairline bg-line/10 text-sm sm:grid-cols-4">
        {[
          ["Coins", <Balance key="b" />],
          ["Rank", "#14"],
          ["Cleanups", "3"],
          ["Reports", "5"],
        ].map(([k, v]) => (
          <div key={k as string} className="bg-surface p-4">
            <dt className="text-muted">{tr(k as string)}</dt>
            <dd className="mt-1 text-xl font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
      <section className="mt-10">
        <div className="mb-3 flex justify-between">
          <h2 className="font-semibold">{tr("Achievements")}</h2>
          <Link href="/achievements" className="text-sm text-accent">
            {tr("View all")}
          </Link>
        </div>
        <BadgeGrid />
      </section>
      <section className="mt-10">
        <h2 className="font-semibold">{tr("Recent activity")}</h2>
        <ul className="mt-3 divide-y divide-line/10 rounded-lg hairline bg-surface text-sm">
          {[
            ["Report R-2036 verified", 100],
            ["Completed Canal cleanup", 250],
          ].map(([l, n]) => (
            <li key={l as string} className="flex justify-between p-4">
              <span>{tr(l as string)}</span>
              <CoinAmount n={n as number} signed />
            </li>
          ))}
        </ul>
      </section>
      <Dialog open={open} onClose={() => setOpen(false)} title={tr("Edit profile")}>
        <div className="space-y-4">
          <Field
            id="pn"
            label={tr("Full name")}
            value={d.name}
            onChange={(e) => setD({ ...d, name: e.target.value })}
            error={err}
          />
          <Field
            id="pc"
            label={tr("Class")}
            value={d.cls}
            onChange={(e) => setD({ ...d, cls: e.target.value })}
          />
          <Button className="w-full" onClick={save}>
            {tr("Save changes")}
          </Button>
        </div>
      </Dialog>
    </main>
  );
}
