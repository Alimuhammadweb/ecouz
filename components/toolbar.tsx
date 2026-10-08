"use client";
import { Globe, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { LANGS, useI18n, type Lang } from "@/lib/i18n";

/** Language dropdown (uz / ru / en). */
export function LangSwitch() {
  const { lang, setLang, tr } = useI18n();
  return (
    <label className="inline-flex h-10 items-center gap-1.5 rounded-md px-2 text-sm text-muted hover:bg-raised">
      <Globe size={16} />
      <select
        aria-label={tr("Language")}
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        className="cursor-pointer bg-transparent font-medium text-fg outline-none"
      >
        {(Object.keys(LANGS) as Lang[]).map((k) => (
          <option key={k} value={k} className="bg-surface text-fg">
            {LANGS[k]}
          </option>
        ))}
      </select>
    </label>
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const { tr } = useI18n();
  return (
    <button
      aria-label={tr("Toggle theme")}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="grid size-10 place-items-center rounded-md text-muted hover:bg-raised"
    >
      <Sun size={18} className="hidden dark:block" />
      <Moon size={18} className="dark:hidden" />
    </button>
  );
}

export const Toolbar = () => (
  <div className="flex items-center">
    <LangSwitch />
    <ThemeToggle />
  </div>
);
