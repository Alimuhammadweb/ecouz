"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin } from "lucide-react";
import clsx from "clsx";
import { useI18n, type TKey } from "@/lib/i18n";

type Group = { title?: TKey; items: [href: string, label: TKey][] };
const groups: Group[] = [
  { items: [["/admin", "ad.overview"]] },
  {
    title: "ad.g1",
    items: [
      ["/admin/reports", "ad.reports"],
      ["/admin/cleanups", "ad.cleanups"],
      ["/admin/participants", "ad.participants"],
    ],
  },
  {
    title: "ad.g2",
    items: [
      ["/admin/users", "ad.users"],
      ["/admin/groups", "ad.groups"],
      ["/admin/schools", "ad.schools"],
      ["/admin/classes", "ad.classes"],
    ],
  },
  {
    title: "ad.g3",
    items: [
      ["/admin/rewards", "ad.rewards"],
      ["/admin/coins", "ad.coins"],
      ["/admin/leaderboard", "ad.leaderboard"],
    ],
  },
  {
    title: "ad.g4",
    items: [
      ["/admin/notifications", "ad.notifications"],
      ["/admin/settings", "ad.settings"],
    ],
  },
];

function useActive() {
  const path = usePathname();
  return (h: string) => (h === "/admin" ? path === h : path.startsWith(h));
}

/** Desktop: grouped sidebar. */
export function AdminSidebar() {
  const { t } = useI18n();
  const on = useActive();
  return (
    <aside className="sticky top-0 hidden h-dvh overflow-y-auto border-r border-line/10 bg-surface p-4 lg:block">
      <Link
        href="/"
        className="mb-4 flex h-10 items-center gap-2 px-3 font-display text-lg font-semibold"
      >
        <MapPin size={20} className="text-accent" />
        Tozalash
      </Link>
      <nav aria-label={t("ad.title")} className="space-y-5">
        {groups.map((g, i) => (
          <div key={i}>
            {g.title && (
              <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wide text-muted">
                {t(g.title)}
              </p>
            )}
            {g.items.map(([h, k]) => (
              <Link
                key={h}
                href={h}
                aria-current={on(h) ? "page" : undefined}
                className={clsx(
                  "flex h-10 items-center rounded-md px-3 text-sm",
                  on(h) ? "bg-raised font-medium" : "text-muted hover:bg-raised/60 hover:text-fg",
                )}
              >
                {t(k)}
              </Link>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}

/** Mobile: one scrolling tab row. */
export function AdminTabs() {
  const { t } = useI18n();
  const on = useActive();
  return (
    <nav
      aria-label={t("ad.title")}
      className="flex gap-1 overflow-x-auto border-b border-line/10 bg-surface px-4 lg:hidden"
    >
      {groups
        .flatMap((g) => g.items)
        .map(([h, k]) => (
          <Link
            key={h}
            href={h}
            aria-current={on(h) ? "page" : undefined}
            className={clsx(
              "flex h-11 shrink-0 items-center border-b-2 px-3 text-sm",
              on(h) ? "border-water font-medium" : "border-transparent text-muted hover:text-fg",
            )}
          >
            {t(k)}
          </Link>
        ))}
    </nav>
  );
}
