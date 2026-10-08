"use client";
import { badges } from "@/components/badges";
import { BadgeGrid } from "@/components/badge-grid";
import { useI18n } from "@/lib/i18n";

export default function Achievements() {
  const { tr } = useI18n();
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <h1 className="t-h2">{tr("Achievements")}</h1>
      <p className="t-body mt-2">
        {tr("{n} of {total} earned.", {
          n: badges.filter((b) => b.on).length,
          total: badges.length,
        })}
      </p>
      <div className="mt-8">
        <BadgeGrid />
      </div>
    </main>
  );
}
