"use client";
import { useState } from "react";
import clsx from "clsx";
import { Lock } from "lucide-react";
import { badges } from "./badges";
import { Dialog } from "./dialog";
import { useI18n } from "@/lib/i18n";
export function BadgeGrid() {
  const { tr } = useI18n();
  const [sel, setSel] = useState<string | null>(null);
  const b = badges.find((x) => x.id === sel);
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {badges.map(({ id, name, I, on, hint }) => (
          <button
            key={id}
            onClick={() => setSel(id)}
            className={clsx(
              "rounded-lg p-5 text-left transition-colors",
              on
                ? "bg-surface hairline hover:bg-raised/50"
                : "border border-dashed border-line/15 text-muted hover:bg-raised/30",
            )}
          >
            <span
              className={clsx(
                "grid size-12 place-items-center rounded-full",
                on ? "bg-accent text-accent-fg" : "bg-raised",
              )}
            >
              {on ? <I size={22} strokeWidth={1.75} /> : <Lock size={18} />}
            </span>
            <p className={clsx("mt-4 text-sm font-medium", on && "text-fg")}>{tr(name)}</p>
            <p className="mt-1 text-xs">{tr(hint)}</p>
          </button>
        ))}
      </div>
      <Dialog open={!!b} onClose={() => setSel(null)} title={b ? tr(b.name) : ""}>
        {b && (
          <>
            <p className="text-sm text-muted">{tr(b.desc)}</p>
            <p className={clsx("mt-4 text-sm font-medium", b.on ? "text-ok" : "text-muted")}>
              {b.on ? tr(b.hint) : tr("Locked · {hint}", { hint: tr(b.hint) })}
            </p>
          </>
        )}
      </Dialog>
    </>
  );
}
