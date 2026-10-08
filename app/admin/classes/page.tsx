"use client";
import { useState } from "react";
import { schools } from "@/lib/data";
import { CoinAmount } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

export default function AdminClasses() {
  const { tr } = useI18n();
  const [sc, setSc] = useState("all");
  const [q, setQ] = useState("");
  const rows = schools
    .flatMap((s) => s.classes.map((c) => ({ ...c, school: s.name, sid: s.id })))
    .filter((r) => (sc === "all" || r.sid === sc) && r.n.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.coins - a.coins);
  return (
    <main className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          aria-label={tr("Search classes")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={tr("Search class, e.g. 9A")}
          className="h-12 rounded-md bg-surface px-4 hairline sm:w-64"
        />
        <select
          aria-label={tr("School")}
          value={sc}
          onChange={(e) => setSc(e.target.value)}
          className="h-12 rounded-md bg-surface px-3 hairline"
        >
          <option value="all">{tr("All schools")}</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>
              {tr(s.name)}
            </option>
          ))}
        </select>
      </div>
      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line/15 p-10 text-center text-sm text-muted">
          {tr("No classes match.")}
        </p>
      ) : (
        <ol className="divide-y divide-line/10 rounded-lg hairline bg-surface">
          {rows.map((r, i) => (
            <li key={r.sid + r.n} className="flex items-center gap-3 p-4 text-sm">
              <span className="w-6 text-muted">{i + 1}</span>
              <span className="min-w-0 flex-1">
                <b className="font-medium">{tr("Class {name}", { name: r.n })}</b>
                <br />
                <span className="text-muted">
                  {tr(r.school)} · {tr("{n} students", { n: r.students })}
                </span>
              </span>
              <CoinAmount n={r.coins} />
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
