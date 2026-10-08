"use client";
import { motion, useReducedMotion } from "motion/react";
import { Timeline, StatusBadge, CoinAmount } from "./ui";
import { useI18n } from "@/lib/i18n";
const pins = [
  [18, 30],
  [44, 58],
  [70, 26],
  [62, 74],
  [30, 78],
];
/** The one orchestrated moment: pins drop onto the map, then the case card fills in. */
export function HeroCase() {
  const reduce = useReducedMotion();
  const { tr } = useI18n();
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg hairline bg-surface sm:aspect-[5/4]">
      <svg className="absolute inset-0 size-full text-fg/10" aria-hidden>
        <defs>
          <pattern id="g" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g)" />
        <path
          d="M-10 220 C 120 120, 240 300, 700 180"
          stroke="rgb(var(--water))"
          strokeOpacity=".35"
          strokeWidth="14"
          fill="none"
        />
      </svg>
      {pins.map(([x, y], i) => (
        <motion.span
          key={i}
          style={{ left: `${x}%`, top: `${y}%` }}
          className={
            "absolute size-3 rounded-full ring-4 " +
            (i === 1 ? "bg-accent ring-accent/25" : "bg-fg/50 ring-fg/10")
          }
          initial={reduce ? false : { y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 * i, type: "spring", stiffness: 380, damping: 22 }}
        />
      ))}
      <motion.div
        className="absolute inset-x-4 bottom-4 rounded-md bg-surface/95 p-4 hairline sm:inset-x-auto sm:right-4 sm:w-72"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-medium">{tr("Plastic dump, Chust")}</p>
            <p className="text-xs text-muted">{tr("Report R-2041")}</p>
          </div>
          <StatusBadge s="verified">Verified</StatusBadge>
        </div>
        <Timeline
          steps={[
            { label: "Reported", state: "done" },
            { label: "Verified by city", state: "done" },
            { label: "Community cleanup open", note: "12 of 20 joined", state: "current" },
            { label: "Proof reviewed", state: "todo" },
          ]}
        />
        <div className="mt-4 flex items-center justify-between border-t border-line/10 pt-3 text-sm text-muted">
          {tr("Reward pool")} <CoinAmount n={1000} />
        </div>
      </motion.div>
    </div>
  );
}
