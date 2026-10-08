"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { schools } from "@/lib/data";
import { CoinAmount } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

const stu = [
  "Madina R.",
  "Timur S.",
  "Aziza K.",
  "Jasur A.",
  "Dilnoza M.",
  "Bekzod T.",
  "Nodira Y.",
];
export default function ClassPage() {
  const { tr } = useI18n();
  const { id, classId } = useParams<{ id: string; classId: string }>();
  const s = schools.find((x) => x.id === id),
    c = s?.classes.find((x) => x.n === classId);
  if (!s || !c)
    return (
      <main className="px-4 py-16 text-center text-sm text-muted">
        {tr("Class not found.")}{" "}
        <Link href="/schools" className="text-accent">
          {tr("All schools")}
        </Link>
      </main>
    );
  const rank = [...s.classes].sort((a, b) => b.coins - a.coins).findIndex((x) => x.n === c.n) + 1;
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <Link href={`/schools/${id}`} className="text-sm text-muted hover:text-fg">
        {tr(s.name)}
      </Link>
      <h1 className="t-h2 mt-2">{tr("Class {name}", { name: c.n })}</h1>
      <p className="text-sm text-muted">
        {tr("Ranked #{rank} of {total} in school", { rank, total: s.classes.length })}
      </p>
      <dl className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-lg hairline bg-line/10 text-sm">
        {[
          ["Students", c.students],
          ["Cleanups", Math.round(c.coins / 600)],
          ["Participation", `${Math.min(96, 55 + c.students)}%`],
        ].map(([k, v]) => (
          <div key={k as string} className="bg-surface p-4">
            <dt className="text-muted">{tr(k as string)}</dt>
            <dd className="mt-1 text-xl font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
      <h2 className="mt-8 font-semibold">{tr("Students")}</h2>
      <ol className="mt-3 divide-y divide-line/10 rounded-lg hairline bg-surface">
        {stu.map((n, i) => (
          <li key={n} className="flex items-center gap-3 p-4 text-sm">
            <span className="w-5 text-muted">{i + 1}</span>
            <span className="grid size-9 place-items-center rounded-full bg-raised text-xs font-medium">
              {n[0]}
            </span>
            <span className="flex-1">{n}</span>
            <CoinAmount n={Math.round(c.coins / 6) - i * 90} />
          </li>
        ))}
      </ol>
    </main>
  );
}
