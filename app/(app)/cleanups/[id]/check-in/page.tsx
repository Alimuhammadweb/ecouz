"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, LocateFixed } from "lucide-react";
import { cleanups } from "@/lib/data";
import { Button } from "@/components/ui";
import { useStore } from "@/components/store";
import { useShared } from "@/lib/shared";
import { useI18n } from "@/lib/i18n";

export default function CheckIn() {
  const { tr } = useI18n();
  const { id } = useParams<{ id: string }>();
  const c = cleanups.find((x) => x.id === id);
  const { part, setPart, toast } = useStore();
  const LIMIT = useShared().radius;
  const [dist, setDist] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [tries, setTries] = useState(0);
  if (!c)
    return (
      <main className="px-4 py-16 text-center text-sm text-muted">
        {tr("Cleanup not found.")}{" "}
        <Link href="/cleanups" className="text-accent">
          {tr("Browse cleanups")}
        </Link>
      </main>
    );
  if (!part[id])
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="font-medium">{tr("Join this cleanup first")}</p>
        <p className="mt-1 text-sm text-muted">{tr("Check-in is only open to participants.")}</p>
        <Link href={`/cleanups/${id}`}>
          <Button className="mt-6">{tr("Go to cleanup")}</Button>
        </Link>
      </main>
    );
  const done = part[id] === "checked_in",
    near = dist !== null && dist <= LIMIT;
  const locate = () => {
    setBusy(true);
    setTimeout(() => {
      setDist(tries === 0 ? 480 : 38);
      setTries(tries + 1);
      setBusy(false);
    }, 900);
  };
  return (
    <main className="mx-auto max-w-md px-4 py-8">
      {done ? (
        <div className="text-center">
          <CheckCircle2 size={48} className="mx-auto text-ok" />
          <h1 className="t-h2 mt-4">{tr("You’re checked in")}</h1>
          <p className="t-body mx-auto mt-2">
            {tr("Your attendance is recorded. Take before, during and after photos as you work.")}
          </p>
          <Link href={`/cleanups/${id}`}>
            <Button className="mt-8">{tr("Back to cleanup")}</Button>
          </Link>
        </div>
      ) : (
        <>
          <h1 className="t-h2">{tr("Check in")}</h1>
          <p className="mt-1 text-sm text-muted">
            {tr(c.title)} · {tr(c.place)}
          </p>
          <div
            className="relative mt-6 aspect-square rounded-lg hairline bg-surface"
            style={{
              backgroundImage:
                "linear-gradient(rgb(var(--line)/.07) 1px,transparent 1px),linear-gradient(90deg,rgb(var(--line)/.07) 1px,transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          >
            <span
              className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-accent/60 bg-accent/10"
              aria-hidden
            />
            <span className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
            {dist !== null && (
              <span
                style={{ transform: `translate(${near ? 20 : 110}px, ${near ? -16 : 90}px)` }}
                className="absolute left-1/2 top-1/2 size-3 rounded-full bg-water ring-8 ring-water/20 transition-transform duration-700"
              />
            )}
          </div>
          {dist !== null &&
            (near ? (
              <p role="status" className="mt-4 rounded-md bg-ok/10 p-3 text-sm text-ok">
                {tr("You’re {dist} m from the site. Check-in is open.", { dist })}
              </p>
            ) : (
              <p role="alert" className="mt-4 flex gap-2 rounded-md bg-bad/10 p-3 text-sm text-bad">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                {tr("You’re {dist} m away. Move within {limit} m of the site to check in.", {
                  dist,
                  limit: LIMIT,
                })}
              </p>
            ))}
          <div className="mt-6 grid gap-3">
            <Button variant="ghost" onClick={locate} disabled={busy}>
              {busy ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />}
              {dist === null ? tr("Find my location") : tr("Refresh location")}
            </Button>
            <Button
              disabled={!near}
              onClick={() => {
                setPart(id, "checked_in");
                toast("Checked in");
              }}
            >
              {tr("Check in")}
            </Button>
          </div>
        </>
      )}
    </main>
  );
}
