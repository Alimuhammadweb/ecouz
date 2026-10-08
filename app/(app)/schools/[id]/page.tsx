"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import { schools } from "@/lib/data";
import { CoinAmount } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

const stu = ["Madina R.", "Timur S.", "Aziza K.", "Jasur A.", "Dilnoza M."];
export default function SchoolDetail() {
  const { tr } = useI18n();
  const { id } = useParams<{ id: string }>();
  const s = schools.find((x) => x.id === id);
  const [cls, setCls] = useState<string | null>(null);
  if (!s)
    return (
      <main className="px-4 py-16 text-center text-sm text-muted">
        {tr("School not found.")}{" "}
        <Link href="/schools" className="text-accent">
          {tr("All schools")}
        </Link>
      </main>
    );
  const rank = [...schools].sort((a, b) => b.coins - a.coins).findIndex((x) => x.id === s.id) + 1;
  const cl = [...s.classes].sort((a, b) => b.coins - a.coins);
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <Link href="/schools" className="text-sm text-muted hover:text-fg">
        {tr("All schools")}
      </Link>
      <h1 className="t-h2 mt-2">{tr(s.name)}</h1>
      <p className="text-sm text-muted">
        {tr(s.district)} · {tr("Ranked #{rank}", { rank })}
      </p>
      <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg hairline bg-line/10 text-sm sm:grid-cols-4">
        {[
          ["Students", s.students],
          ["Cleanups", s.cleanups],
          ["Classes", s.classes.length],
        ].map(([k, v]) => (
          <div key={k as string} className="bg-surface p-4">
            <dt className="text-muted">{tr(k as string)}</dt>
            <dd className="mt-1 text-xl font-semibold">{v}</dd>
          </div>
        ))}
        <div className="bg-surface p-4">
          <dt className="text-muted">{tr("Coins")}</dt>
          <dd className="mt-1 text-xl font-semibold">
            <CoinAmount n={s.coins} />
          </dd>
        </div>
      </dl>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="font-semibold">{tr("Classes")}</h2>
          <ul className="mt-3 space-y-2">
            {cl.map((c, i) => (
              <li key={c.n}>
                <button
                  onClick={() => setCls(c.n)}
                  aria-pressed={cls === c.n}
                  className={clsx(
                    "flex w-full items-center gap-3 rounded-md p-3 text-left text-sm hairline",
                    cls === c.n ? "border-accent bg-accent/10" : "bg-surface hover:bg-raised/50",
                  )}
                >
                  <span className="w-5 text-muted">{i + 1}</span>
                  <span className="flex-1">
                    <b className="font-medium">{tr("Class {name}", { name: c.n })}</b>
                    <br />
                    <span className="text-muted">{tr("{n} students", { n: c.students })}</span>
                  </span>
                  <CoinAmount n={c.coins} />
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <div className="flex justify-between">
            <h2 className="font-semibold">
              {cls ? tr("Top students · {cls}", { cls }) : tr("Students")}
            </h2>
            {cls && (
              <Link href={`/schools/${id}/classes/${cls}`} className="text-sm text-accent">
                {tr("Class page")}
              </Link>
            )}
          </div>
          {cls ? (
            <ul className="mt-3 divide-y divide-line/10 rounded-lg hairline bg-surface">
              {stu.map((n, i) => (
                <li key={n} className="flex items-center gap-3 p-3 text-sm">
                  <span className="w-5 text-muted">{i + 1}</span>
                  <span className="flex-1">{n}</span>
                  <CoinAmount n={1200 - i * 170} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 rounded-lg border border-dashed border-line/15 p-8 text-center text-sm text-muted">
              {tr("Select a class to see its ranking.")}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
