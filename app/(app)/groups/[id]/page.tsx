"use client";
import { Photo } from "@/components/photo";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Camera, Crown } from "lucide-react";
import { groups, cleanups } from "@/lib/data";
import { StatusBadge } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

export default function GroupDetail() {
  const { tr } = useI18n();
  const { id } = useParams<{ id: string }>();
  const g = groups.find((x) => x.id === id);
  if (!g)
    return (
      <main className="px-4 py-16 text-center text-sm text-muted">
        {tr("Group not found.")}{" "}
        <Link href="/groups" className="text-accent">
          {tr("All groups")}
        </Link>
      </main>
    );
  const c = cleanups.find((x) => x.id === g.cleanup)!;
  const present = Math.ceil(g.members.length * (g.progress / 100 || 0.4));
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <Link href="/groups" className="text-sm text-muted hover:text-fg">
        {tr("All groups")}
      </Link>
      <h1 className="t-h2 mt-2">{tr(g.name)}</h1>
      <p className="mt-2 text-sm text-muted">
        {tr("Cleanup:")}{" "}
        <Link href={`/cleanups/${c.id}`} className="text-accent">
          {tr(c.title)}
        </Link>{" "}
        · {tr(c.date)}
      </p>
      <div className="mt-6 rounded-lg hairline bg-surface p-5">
        <div className="flex justify-between text-sm">
          <span>{tr("Group progress")}</span>
          <span>{g.progress}%</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-line/10">
          <div className="h-2 rounded-full bg-accent" style={{ width: `${g.progress}%` }} />
        </div>
        <p className="mt-3 text-sm text-muted">
          {tr("{n} of {total} members checked in · {proofs} proof photos uploaded", {
            n: present,
            total: g.members.length,
            proofs: g.proofs,
          })}
        </p>
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section>
          <h2 className="font-semibold">{tr("Members")}</h2>
          <ul className="mt-3 divide-y divide-line/10 rounded-lg hairline bg-surface">
            {g.members.map((m, i) => (
              <li key={m} className="flex items-center gap-3 p-3 text-sm">
                <span className="grid size-10 place-items-center rounded-full bg-raised text-xs font-medium">
                  {m[0]}
                </span>
                <span className="flex-1">{m}</span>
                {m === g.leader && (
                  <Crown size={16} className="text-accent" aria-label={tr("Leader")} />
                )}
                <StatusBadge s={i < present ? "verified" : "pending"}>
                  {i < present ? "Checked in" : "Not yet"}
                </StatusBadge>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-semibold">{tr("Proof")}</h2>
          {g.proofs ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {Array.from({ length: Math.min(g.proofs, 6) }, (_, n) => (
                <div key={n} className="aspect-square overflow-hidden rounded-md hairline">
                  <Photo
                    kind={n % 2 ? "during" : "after"}
                    i={n >> 1}
                    label={tr("Proof photo {n}", { n: n + 1 })}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 grid place-items-center rounded-lg border border-dashed border-line/15 p-8 text-center text-sm text-muted">
              <Camera size={22} className="mb-2" />
              {tr("No proof yet. Photos appear after check-in.")}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
