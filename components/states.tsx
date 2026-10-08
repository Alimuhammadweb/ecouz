"use client";
import { AlertTriangle, type LucideIcon } from "lucide-react";
import clsx from "clsx";
import { Button } from "./ui";
import { useI18n } from "@/lib/i18n";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={clsx("animate-pulse rounded-md bg-raised", className)} aria-hidden />
);
export function EmptyState({
  icon: I,
  title,
  text,
  action,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  const { tr } = useI18n();
  return (
    <div className="grid place-items-center rounded-lg border border-dashed border-line/15 px-6 py-16 text-center">
      <I size={24} strokeWidth={1.75} className="text-muted" />
      <p className="mt-4 font-medium">{tr(title)}</p>
      <p className="mt-1 max-w-sm text-sm text-muted">{tr(text)}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
export function ErrorState({
  title = "Couldn’t load this",
  text,
  retry,
  action,
}: {
  title?: string;
  text: string;
  retry?: () => void;
  action?: React.ReactNode;
}) {
  const { tr } = useI18n();
  return (
    <div
      role="alert"
      className="grid place-items-center rounded-lg bg-bad/10 px-6 py-12 text-center"
    >
      <AlertTriangle size={24} className="text-bad" />
      <p className="mt-4 font-medium">{tr(title)}</p>
      <p className="mt-1 max-w-sm text-sm text-muted">{tr(text)}</p>
      {retry && (
        <Button variant="ghost" className="mt-6" onClick={retry}>
          {tr("Try again")}
        </Button>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
