"use client";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { CleaningScene } from "@/components/cleaning-scene";
import { Toolbar } from "@/components/toolbar";
import { useI18n } from "@/lib/i18n";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      <aside className="hidden flex-col justify-between border-r border-line/10 bg-surface p-12 lg:flex">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <MapPin size={22} className="text-accent" strokeWidth={1.75} />
          Tozalash
        </Link>
        <div>
          <div className="mb-8 flex justify-center">
            <CleaningScene />
          </div>
          <p className="t-h2 max-w-[18ch]">{t("auth.tag")}</p>
          <p className="t-body mt-4">{t("auth.text")}</p>
        </div>
        <p className="text-sm text-muted">{t("auth.org")}</p>
      </aside>
      <div className="flex flex-col">
        <div className="flex justify-end p-3">
          <Toolbar />
        </div>
        <main className="mx-auto w-full max-w-md flex-1 px-4 py-8 md:px-0 lg:self-center">
          {children}
        </main>
      </div>
    </div>
  );
}
