"use client";
import clsx from "clsx";
import { useI18n } from "@/lib/i18n";
import type { ComponentProps } from "react";
export function Field({
  label,
  error,
  ...p
}: ComponentProps<"input"> & { label: string; error?: string }) {
  const { tr } = useI18n();
  return (
    <div>
      <label htmlFor={p.id} className="text-sm font-medium">
        {tr(label)}
      </label>
      <input
        {...p}
        placeholder={p.placeholder ? tr(p.placeholder) : undefined}
        aria-invalid={!!error}
        aria-describedby={error ? `${p.id}-e` : undefined}
        className={clsx(
          "mt-2 h-12 w-full rounded-md bg-surface px-4 text-base hairline placeholder:text-muted",
          error && "border-bad",
        )}
      />
      {error && (
        <p id={`${p.id}-e`} className="mt-1 text-sm text-bad">
          {tr(error)}
        </p>
      )}
    </div>
  );
}
