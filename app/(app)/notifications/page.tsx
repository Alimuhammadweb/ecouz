"use client";
import { useState } from "react";
import clsx from "clsx";
import { BellOff, CheckCircle2, XCircle, MapPin, Gift, Trophy, Users } from "lucide-react";
import { EmptyState } from "@/components/states";
import { Button } from "@/components/ui";
import { useI18n } from "@/lib/i18n";

const seed = [
  {
    id: 1,
    k: "Reports",
    I: CheckCircle2,
    t: "Report R-2036 was verified",
    d: "100 coins added to your balance.",
    w: "2 h ago",
    u: true,
  },
  {
    id: 2,
    k: "Cleanups",
    I: MapPin,
    t: "New cleanup 1.2 km away",
    d: "Chust riverbank, Sat 10 Oct, 09:00.",
    w: "5 h ago",
    u: true,
  },
  {
    id: 3,
    k: "Groups",
    I: Users,
    t: "Madina invited you to Chust Eco Team",
    d: "Accept to join their next cleanup together.",
    w: "Yesterday",
    u: true,
  },
  {
    id: 4,
    k: "Rewards",
    I: Gift,
    t: "Your water bottle is ready",
    d: "Collect it at the district office.",
    w: "Yesterday",
    u: false,
  },
  {
    id: 5,
    k: "Reports",
    I: XCircle,
    t: "Report R-2031 was rejected",
    d: "The photos didn’t show the location clearly.",
    w: "2 days ago",
    u: false,
  },
  {
    id: 6,
    k: "Schools",
    I: Trophy,
    t: "School No. 110 moved up to #2",
    d: "Your class added 420 coins this week.",
    w: "3 days ago",
    u: false,
  },
];
const cats = ["All", "Reports", "Cleanups", "Groups", "Rewards", "Schools"];
export default function Notifications() {
  const { tr } = useI18n();
  const [items, setItems] = useState(seed);
  const [cat, setCat] = useState("All");
  const list = items.filter((n) => cat === "All" || n.k === cat);
  const unread = items.filter((n) => n.u).length;
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <div className="flex items-end justify-between gap-4">
        <h1 className="t-h2">{tr("Notifications")}</h1>
        <Button
          variant="ghost"
          disabled={!unread}
          onClick={() => setItems(items.map((n) => ({ ...n, u: false })))}
        >
          {tr("Mark all read")}
        </Button>
      </div>
      <div role="tablist" className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {cats.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={clsx(
              "h-10 shrink-0 rounded-md px-4 text-sm hairline",
              cat === c ? "bg-raised font-medium" : "text-muted",
            )}
          >
            {tr(c)}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {list.length === 0 ? (
          <EmptyState
            icon={BellOff}
            title="Nothing in this category"
            text="We’ll notify you here when something changes."
          />
        ) : (
          <ul className="divide-y divide-line/10 rounded-lg hairline bg-surface">
            {list.map(({ id, I, t, d, w, u }) => (
              <li key={id}>
                <button
                  onClick={() => setItems(items.map((n) => (n.id === id ? { ...n, u: false } : n)))}
                  className={clsx("flex w-full gap-3 p-4 text-left", u && "bg-accent/[.05]")}
                >
                  <I
                    size={20}
                    strokeWidth={1.75}
                    className={clsx("mt-0.5 shrink-0", u ? "text-accent" : "text-muted")}
                  />
                  <div className="min-w-0 flex-1">
                    <p className={clsx("text-sm", u && "font-medium")}>{tr(t)}</p>
                    <p className="text-sm text-muted">{tr(d)}</p>
                    <p className="mt-1 text-xs text-muted">{tr(w)}</p>
                  </div>
                  {u && (
                    <span
                      className="mt-2 size-2 shrink-0 rounded-full bg-accent"
                      aria-label={tr("Unread")}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
