"use client";
import { useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui";
import { setShared, useShared } from "@/lib/shared";
import { useI18n } from "@/lib/i18n";

export default function Settings() {
  const { tr } = useI18n();
  const [s, setS] = useState({
    radius: useShared().radius,
    reward: 100,
    review: 3,
    auto: true,
    school: true,
  });
  const [saved, setSaved] = useState(true);
  const num = (k: "radius" | "reward" | "review", label: string, unit: string) => (
    <label className="flex items-center justify-between gap-4 p-4 text-sm">
      <span>{tr(label)}</span>
      <span className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={s[k]}
          onChange={(e) => {
            setS({ ...s, [k]: Math.max(1, +e.target.value) });
            setSaved(false);
          }}
          className="h-10 w-24 rounded-md bg-bg px-3 hairline"
        />
        <span className="w-10 text-muted">{tr(unit)}</span>
      </span>
    </label>
  );
  const sw = (k: "auto" | "school", label: string, d: string) => (
    <div className="flex items-center justify-between gap-4 p-4 text-sm">
      <span>
        <b className="font-medium">{tr(label)}</b>
        <br />
        <span className="text-muted">{tr(d)}</span>
      </span>
      <button
        role="switch"
        aria-checked={s[k]}
        aria-label={tr(label)}
        onClick={() => {
          setS({ ...s, [k]: !s[k] });
          setSaved(false);
        }}
        className={clsx(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          s[k] ? "bg-water" : "bg-raised",
        )}
      >
        <span
          className={clsx(
            "absolute top-1 size-5 rounded-full bg-white transition-all",
            s[k] ? "left-6" : "left-1",
          )}
        />
      </button>
    </div>
  );
  return (
    <main className="max-w-2xl space-y-4 p-4 md:p-6">
      <div className="divide-y divide-line/10 rounded-lg hairline bg-surface">
        {num("radius", "Check-in radius", "m")}
        {num("reward", "Default report reward", "coins")}
        {num("review", "Proof review window", "days")}
        {sw(
          "auto",
          "Notify participants on verification",
          "Sends a notification when proof is approved or rejected.",
        )}
        {sw(
          "school",
          "Allow new schools at registration",
          "Off means students can only pick existing schools.",
        )}
      </div>
      <div className="flex items-center gap-4">
        <Button
          disabled={saved}
          onClick={() => {
            setShared({ radius: s.radius });
            setSaved(true);
          }}
        >
          {tr("Save settings")}
        </Button>
        <p role="status" className="text-sm text-muted">
          {saved ? tr("All changes saved") : tr("Unsaved changes")}
        </p>
      </div>
    </main>
  );
}
