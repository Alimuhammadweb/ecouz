"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Bell,
  Coins,
  FilePlus2,
  Gift,
  LayoutDashboard,
  Map,
  MapPin,
  School,
  Sprout,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { Balance } from "./store";
import { Toolbar } from "./toolbar";
import { useI18n, type TKey } from "@/lib/i18n";

type Item = { h: string; k: TKey; I: LucideIcon };
const main: Item[] = [
  { h: "/dashboard", k: "app.home", I: LayoutDashboard },
  { h: "/cleanups", k: "app.cleanups", I: Sprout },
  { h: "/report/new", k: "app.report", I: FilePlus2 },
  { h: "/rewards", k: "app.rewards", I: Gift },
  { h: "/coins", k: "app.coins", I: Coins },
];
const more: Item[] = [
  { h: "/achievements", k: "app.achievements", I: Award },
  { h: "/groups", k: "app.groups", I: Users },
  { h: "/schools", k: "app.schools", I: School },
  { h: "/explore", k: "app.explore", I: Map },
  { h: "/leaderboard", k: "app.leaderboard", I: Trophy },
  { h: "/notifications", k: "app.notifications", I: Bell },
];
const profile: Item = { h: "/profile", k: "app.profile", I: Users };

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { t, tr } = useI18n();
  const on = (h: string) => path.startsWith(h);

  return (
    <div className="lg:grid lg:grid-cols-[240px_1fr]">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line/10 bg-bg/90 px-4 backdrop-blur lg:hidden">
        <Link href="/" className="flex items-center gap-2 font-display font-semibold">
          <MapPin size={18} className="text-accent" />
          Tozalash
        </Link>
        <Toolbar />
      </header>

      <aside className="sticky top-0 hidden h-dvh flex-col justify-between overflow-y-auto border-r border-line/10 p-4 lg:flex">
        <div>
          <Link
            href="/"
            className="mb-4 flex h-10 items-center gap-2 px-3 font-display text-lg font-semibold"
          >
            <MapPin size={20} className="text-accent" />
            Tozalash
          </Link>
          <nav className="space-y-1">
            {[...main, ...more].map(({ h, k, I }) => (
              <Link
                key={h}
                href={h}
                aria-current={on(h) ? "page" : undefined}
                className={clsx(
                  "flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                  on(h)
                    ? "bg-raised font-medium text-fg"
                    : "text-muted hover:bg-raised/60 hover:text-fg",
                )}
              >
                <I size={18} strokeWidth={1.75} className={on(h) ? "text-accent" : ""} />
                {t(k)}
              </Link>
            ))}
          </nav>
        </div>
        <div className="space-y-2">
          <Toolbar />
          <Link
            href={profile.h}
            aria-current={on(profile.h) ? "page" : undefined}
            className={clsx(
              "block rounded-md p-3 hairline transition-colors hover:bg-raised/60",
              on(profile.h) && "bg-raised",
            )}
          >
            <span className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-accent font-display font-semibold text-accent-fg">
                A
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">Aziza Karimova</span>
                <span className="block text-xs text-muted">{t("app.profile")}</span>
              </span>
            </span>
            <span className="mt-3 flex items-center justify-between border-t border-line/10 pt-3 text-sm">
              <span className="text-muted">{t("app.balance")}</span>
              <Balance />
            </span>
          </Link>
        </div>
      </aside>

      <div className="min-w-0 pb-24 lg:pb-0">{children}</div>

      <nav
        aria-label={tr("Primary")}
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-6 border-t border-line/10 bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        {[...main, profile].map(({ h, k, I }) => (
          <Link
            key={h}
            href={h}
            aria-current={on(h) ? "page" : undefined}
            className={clsx(
              "flex h-16 flex-col items-center justify-center gap-1 text-[11px]",
              on(h) ? "text-accent" : "text-muted",
            )}
          >
            <I size={20} strokeWidth={1.75} />
            {t(k)}
          </Link>
        ))}
      </nav>
    </div>
  );
}
