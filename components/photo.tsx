import clsx from "clsx";

/** Real photos live in /public/photos as {stage}-{n}.webp. `gift` is still an inline SVG illustration. */
export const STAGES = ["before", "during", "after"] as const;
export type Stage = (typeof STAGES)[number];
export type PhotoKind = Stage | "gift";

const COUNT: Record<Stage, number> = { before: 5, during: 4, after: 4 };
/** Path of the i-th photo of a cleanup stage (wraps around when i is larger than the set). */
export const photoSrc = (stage: Stage, i = 0) => `/photos/${stage}-${(i % COUNT[stage]) + 1}.webp`;

const giftScene = (
  <g>
    <rect x="48" y="52" width="64" height="52" rx="5" fill="rgb(var(--accent))" />
    <rect x="76" y="52" width="8" height="52" fill="rgb(var(--accent-fg) / .55)" />
    <rect x="44" y="42" width="72" height="14" rx="4" fill="rgb(var(--accent) / .85)" />
    <path
      d="M80 42c-14-18-30-6-16 0zM80 42c14-18 30-6 16 0z"
      fill="none"
      stroke="rgb(var(--accent-fg) / .6)"
      strokeWidth="3"
    />
  </g>
);

/** A real photo for a cleanup stage, or the SVG illustration for rewards. `i` picks a different photo. */
export function Photo({
  kind,
  i = 0,
  label,
  className,
}: {
  kind: PhotoKind;
  i?: number;
  label: string;
  className?: string;
}) {
  if (kind !== "gift")
    return (
      <img
        src={photoSrc(kind, i)}
        alt={label}
        loading="lazy"
        decoding="async"
        className={clsx("size-full object-cover", className)}
      />
    );
  const sky = ["--water", "--accent", "--ok"][i % 3];
  return (
    <svg
      viewBox="0 0 160 120"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label}
      className={clsx("size-full", className)}
    >
      <rect width="160" height="120" fill={`rgb(var(${sky}) / .14)`} />
      <circle cx={120 - (i % 3) * 20} cy="26" r="10" fill="rgb(var(--accent) / .55)" />
      <path d="M0 78 Q40 58 80 74 T160 66 V120 H0Z" fill="rgb(var(--ok) / .26)" />
      <rect y="92" width="160" height="28" fill="rgb(var(--line) / .1)" />
      {giftScene}
    </svg>
  );
}
