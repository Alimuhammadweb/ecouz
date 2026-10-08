"use client";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "./ui";
import { Toolbar } from "./toolbar";
import { useI18n, type TKey } from "@/lib/i18n";

const links: [TKey, string][] = [
  ["nav.how", "/#how"],
  ["nav.explore", "/explore"],
  ["nav.leaderboard", "/leaderboard"],
  ["nav.report", "/report/new"],
  ["nav.dashboard", "/dashboard"],
];

/** Public top navbar — rendered on the landing page only. */
export function SiteNav() {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-50 border-b border-line/10 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <MapPin size={20} strokeWidth={1.75} className="text-accent" />
          Tozalash
        </Link>
        <nav className="hidden gap-8 text-sm text-muted md:flex">
          {links.map(([k, h]) => (
            <Link key={k} href={h} className="transition-colors hover:text-fg">
              {t(k)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <Toolbar />
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost">{t("nav.login")}</Button>
          </Link>
          <Link href="/register">
            <Button className="px-4 sm:px-6">{t("nav.start")}</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
