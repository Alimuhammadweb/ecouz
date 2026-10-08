"use client";
import clsx from "clsx";
import { ArrowRight, ImageOff } from "lucide-react";
import { Photo, STAGES, type Stage } from "./photo";
import { useI18n } from "@/lib/i18n";

const caption: Record<Stage, string> = {
  before: "The site before cleanup",
  during: "Volunteers at work",
  after: "The same place, cleaned",
};

/**
 * Before → During → After strip. Stages listed in `pending` have no photo yet and show a dashed placeholder.
 * `i` shifts which photo of each stage is shown, so neighbouring galleries do not look identical.
 */
export function StageGallery({
  pending = [],
  i = 0,
  className,
}: {
  pending?: Stage[];
  i?: number;
  className?: string;
}) {
  const { tr } = useI18n();
  return (
    <ol className={clsx("grid gap-3 sm:grid-cols-3", className)}>
      {STAGES.map((s, n) => (
        <li key={s} className="relative">
          <figure>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg hairline bg-raised">
              {pending.includes(s) ? (
                <div className="grid size-full place-items-center p-4 text-center text-xs text-muted">
                  <span>
                    <ImageOff className="mx-auto mb-1" size={20} strokeWidth={1.75} />
                    {tr("Photo appears after the cleanup")}
                  </span>
                </div>
              ) : (
                <Photo kind={s} i={i} label={tr(caption[s])} />
              )}
              <span className="absolute left-2 top-2 rounded-sm bg-bg/90 px-2 py-0.5 text-xs font-medium">
                {n + 1}. {tr(s === "before" ? "Before" : s === "during" ? "During" : "After")}
              </span>
            </div>
            <figcaption className="mt-2 text-sm text-muted">{tr(caption[s])}</figcaption>
          </figure>
          {n < STAGES.length - 1 && (
            <ArrowRight
              size={18}
              aria-hidden
              className="absolute -right-[14px] top-[38%] z-10 hidden rounded-full bg-bg p-0.5 text-accent sm:block"
            />
          )}
        </li>
      ))}
    </ol>
  );
}
