"use client";
import { Photo } from "@/components/photo";
import { StageGallery } from "@/components/stage-gallery";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Calendar, MapPin, Building2, SearchX } from "lucide-react";
import { cleanups } from "@/lib/data";
import { Button, CoinAmount, Timeline, type Step } from "@/components/ui";
import { Dialog } from "@/components/dialog";
import { ErrorState } from "@/components/states";
import { useStore } from "@/components/store";
import { useI18n } from "@/lib/i18n";

export default function CleanupDetail() {
  const { tr } = useI18n();
  const { id } = useParams<{ id: string }>();
  const c = cleanups.find((x) => x.id === id);
  const { part, setPart, toast } = useStore();
  const [dlg, setDlg] = useState(false);
  if (!c)
    return (
      <main className="mx-auto max-w-xl px-4 py-16">
        <ErrorState
          title="Cleanup not found"
          text="It may have been removed or the link is wrong."
          action={
            <Link href="/cleanups">
              <Button>{tr("Browse cleanups")}</Button>
            </Link>
          }
        />
      </main>
    );
  const p = part[id],
    n = c.joined + (p ? 1 : 0),
    closed = c.status !== "open";
  const steps: Step[] = [
    { label: "Joined", state: p ? "done" : "current" },
    {
      label: "Checked in",
      note: p === "checked_in" ? "You’re at the site" : "Opens 30 min before start",
      state: p === "checked_in" ? "done" : p ? "current" : "todo",
    },
    { label: "Proof submitted", state: "todo" },
    { label: "Verified by city", state: "todo" },
    { label: "Rewarded", note: "Pool split between verified participants", state: "todo" },
  ];
  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-8 md:px-8 lg:grid-cols-[1fr_340px]">
      <div>
        <Link href="/cleanups" className="text-sm text-muted hover:text-fg">
          {tr("All cleanups")}
        </Link>
        <div className="mt-3 aspect-[16/7] overflow-hidden rounded-lg hairline">
          <Photo
            kind={c.status === "done" ? "after" : "before"}
            i={Number(c.id.slice(1))}
            label={tr(c.title)}
          />
        </div>
        <h1 className="t-h2 mt-2">{tr(c.title)}</h1>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          <li className="flex gap-2">
            <MapPin size={16} />
            {tr(c.place)}
          </li>
          <li className="flex gap-2">
            <Calendar size={16} />
            {tr(c.date)}, {c.time}
          </li>
          <li className="flex gap-2">
            <Building2 size={16} />
            {tr(c.org)}
          </li>
        </ul>
        <p className="t-body mt-6">{tr(c.about)}</p>
        <h2 className="mt-8 font-semibold">{tr("Cleanup stages")}</h2>
        <StageGallery
          className="mt-3"
          i={Number(c.id.slice(1))}
          pending={c.status === "done" ? [] : ["during", "after"]}
        />
        {c.need.length > 0 && (
          <>
            <h2 className="mt-8 font-semibold">{tr("What to bring")}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
              {c.need.map((x) => (
                <li key={x}>{tr(x)}</li>
              ))}
            </ul>
          </>
        )}
      </div>
      <aside className="h-fit rounded-lg hairline bg-surface p-5 lg:sticky lg:top-24">
        <p className="text-sm text-muted">{tr("Reward pool")}</p>
        <p className="font-display text-3xl font-semibold">
          <CoinAmount n={c.reward} />
        </p>
        <p className="mt-1 text-sm text-muted">
          {tr("{n} of {cap} joined · {each} each at current turnout", {
            n,
            cap: c.cap,
            each: Math.floor(c.reward / Math.max(n, 1)),
          })}
        </p>
        <div className="mt-5">
          {!p ? (
            <Button className="w-full" disabled={closed} onClick={() => setDlg(true)}>
              {c.status === "full"
                ? tr("Cleanup is full")
                : c.status === "done"
                  ? tr("Completed")
                  : tr("Join cleanup")}
            </Button>
          ) : p === "joined" ? (
            <Link href={`/cleanups/${id}/check-in`}>
              <Button className="w-full">{tr("Check in")}</Button>
            </Link>
          ) : (
            <div className="space-y-2">
              <p className="rounded-md bg-ok/15 p-3 text-center text-sm font-medium text-ok">
                {tr("Checked in")}
              </p>
              <Link href={`/cleanups/${id}/proof`}>
                <Button className="w-full">{tr("Submit proof")}</Button>
              </Link>
            </div>
          )}
        </div>
        {p && (
          <div className="mt-6 border-t border-line/10 pt-6">
            <Timeline steps={steps} />
          </div>
        )}
      </aside>
      <Dialog open={dlg} onClose={() => setDlg(false)} title={tr("Join this cleanup?")}>
        <p className="text-sm text-muted">
          {tr(
            "{date}, {time} at {place}. You can check in on the day. Reward is split between verified participants.",
            { date: tr(c.date), time: c.time, place: tr(c.place) },
          )}
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setDlg(false)}>
            {tr("Not now")}
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              setPart(id, "joined");
              setDlg(false);
              toast("You joined the cleanup");
            }}
          >
            {tr("Join cleanup")}
          </Button>
        </div>
      </Dialog>
    </main>
  );
}
