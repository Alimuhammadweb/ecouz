"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { schools } from "@/lib/data";
import { CoinAmount } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

export default function AdminSchools() {
  const { tr } = useI18n();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>("s1");
  const list = schools.filter((s) => (s.name + s.district).toLowerCase().includes(q.toLowerCase()));
  return (
    <main className="space-y-4 p-4 md:p-6">
      <input
        aria-label={tr("Search schools")}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={tr("Search schools or districts")}
        className="h-12 w-full rounded-md bg-surface px-4 hairline sm:max-w-sm"
      />
      {list.length === 0 && (
        <p className="rounded-lg border border-dashed border-line/15 p-10 text-center text-sm text-muted">
          {tr("No schools match “{q}”.", { q })}
        </p>
      )}
      <ul className="space-y-3">
        {list.map((s) => (
          <li key={s.id} className="rounded-lg hairline bg-surface">
            <button
              aria-expanded={open === s.id}
              onClick={() => setOpen(open === s.id ? null : s.id)}
              className="flex min-h-16 w-full items-center gap-3 p-4 text-left text-sm"
            >
              <span className="min-w-0 flex-1">
                <b className="font-medium">{tr(s.name)}</b>
                <br />
                <span className="text-muted">
                  {tr(s.district)} · {tr("{n} students", { n: s.students })} ·{" "}
                  {tr("{n} cleanups", { n: s.cleanups })}
                </span>
              </span>
              <CoinAmount n={s.coins} />
              <ChevronDown
                size={18}
                className={clsx(
                  "shrink-0 text-muted transition-transform",
                  open === s.id && "rotate-180",
                )}
              />
            </button>
            {open === s.id && (
              <ul className="border-t border-line/10">
                {[...s.classes]
                  .sort((a, b) => b.coins - a.coins)
                  .map((c, i) => (
                    <li
                      key={c.n}
                      className="flex items-center gap-3 border-b border-line/10 px-4 py-3 pl-8 text-sm last:border-0"
                    >
                      <span className="w-5 text-muted">{i + 1}</span>
                      <span className="flex-1">
                        {tr("Class {name}", { name: c.n })}{" "}
                        <span className="text-muted">
                          · {tr("{n} students", { n: c.students })}
                        </span>
                      </span>
                      <CoinAmount n={c.coins} />
                    </li>
                  ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
