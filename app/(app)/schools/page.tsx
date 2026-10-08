"use client";
import Link from "next/link";
import { schools } from "@/lib/data";
import { CoinAmount } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

export default function Schools() {
  const { tr } = useI18n();
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <h1 className="t-h2">{tr("Schools")}</h1>
      <p className="t-body mt-2">{tr("Ranked by coins earned by all students this season.")}</p>
      <ol className="mt-8 space-y-3">
        {[...schools]
          .sort((a, b) => b.coins - a.coins)
          .map((s, i) => (
            <li key={s.id}>
              <Link
                href={`/schools/${s.id}`}
                className="flex items-center gap-4 rounded-lg hairline bg-surface p-5 transition-colors hover:bg-raised/50"
              >
                <span className="font-display text-2xl font-semibold text-muted tabular-nums">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{tr(s.name)}</p>
                  <p className="text-sm text-muted">
                    {tr(s.district)} · {tr("{n} students", { n: s.students })} ·{" "}
                    {tr("{n} classes", { n: s.classes.length })}
                  </p>
                </div>
                <CoinAmount n={s.coins} />
              </Link>
            </li>
          ))}
      </ol>
    </main>
  );
}
