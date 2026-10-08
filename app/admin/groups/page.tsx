"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { groups, cleanups } from "@/lib/data";
import { StatusBadge } from "@/components/ui";
import { useI18n } from "@/lib/i18n";
export default function AdminGroups() {
  const { tr } = useI18n();
  const [open, setOpen] = useState<string | null>("g1");
  return (
    <main className="space-y-3 p-4 md:p-6">
      {groups.map((g) => (
        <section key={g.id} className="rounded-lg hairline bg-surface">
          <button
            aria-expanded={open === g.id}
            onClick={() => setOpen(open === g.id ? null : g.id)}
            className="flex min-h-16 w-full items-center gap-3 p-4 text-left text-sm"
          >
            <span className="min-w-0 flex-1">
              <b className="font-medium">{tr(g.name)}</b>
              <br />
              <span className="text-muted">
                {tr(cleanups.find((c) => c.id === g.cleanup)?.title ?? "")} ·{" "}
                {tr("{n}/{cap} members · {proofs} proofs", {
                  n: g.members.length,
                  cap: g.cap,
                  proofs: g.proofs,
                })}
              </span>
            </span>
            <StatusBadge s={g.progress === 100 ? "verified" : "review"}>
              {g.progress === 100 ? tr("Complete") : `${g.progress}%`}
            </StatusBadge>
            <ChevronDown
              size={18}
              className={clsx(
                "shrink-0 text-muted transition-transform",
                open === g.id && "rotate-180",
              )}
            />
          </button>
          {open === g.id && (
            <ul className="grid border-t border-line/10 sm:grid-cols-2">
              {g.members.map((m) => (
                <li
                  key={m}
                  className="flex items-center gap-2 border-b border-line/10 px-4 py-3 text-sm"
                >
                  {m}
                  {m === g.leader && <span className="text-xs text-muted">· {tr("leader")}</span>}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </main>
  );
}
