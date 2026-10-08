"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Camera, X, Loader2 } from "lucide-react";
import { Button, Timeline } from "@/components/ui";
import { useStore } from "@/components/store";
import { useI18n } from "@/lib/i18n";

const slots = ["Before", "During", "After", "Group"];
export default function Proof() {
  const { tr } = useI18n();
  const { id } = useParams<{ id: string }>();
  const { part, toast } = useStore();
  const [img, setImg] = useState<Record<string, { url: string; pct: number }>>({});
  const [desc, setDesc] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  if (part[id] !== "checked_in")
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="font-medium">{tr("Check in first")}</p>
        <p className="mt-1 text-sm text-muted">
          {tr("Proof can only be submitted after you check in.")}
        </p>
        <Link href={`/cleanups/${id}/check-in`}>
          <Button className="mt-6">{tr("Go to check-in")}</Button>
        </Link>
      </main>
    );
  const pick = (s: string, f?: File) => {
    if (!f) return;
    setImg((p) => ({ ...p, [s]: { url: URL.createObjectURL(f), pct: 0 } }));
    let n = 0;
    const t = setInterval(() => {
      n += 25;
      setImg((p) => ({ ...p, [s]: { ...p[s], pct: Math.min(n, 100) } }));
      if (n >= 100) clearInterval(t);
    }, 250);
  };
  const ready = ["Before", "After"].every((s) => img[s]?.pct === 100) && desc.trim().length >= 10;
  if (sent)
    return (
      <main className="mx-auto max-w-md px-4 py-10">
        <h1 className="t-h2">{tr("Waiting for verification")}</h1>
        <p className="t-body mt-2">
          {tr("City staff review proof within 3 days. Your coins are paid once it’s approved.")}
        </p>
        <div className="mt-8 rounded-lg hairline bg-surface p-5">
          <Timeline
            steps={[
              { label: "Checked in", state: "done" },
              { label: "Proof submitted", state: "done" },
              {
                label: "Under verification",
                note: tr("{n} photos attached", { n: Object.keys(img).length }),
                state: "current",
              },
              { label: "Rewarded", state: "todo" },
            ]}
          />
        </div>
        <Link href={`/cleanups/${id}`}>
          <Button variant="ghost" className="mt-6 w-full">
            {tr("Back to cleanup")}
          </Button>
        </Link>
      </main>
    );
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <h1 className="t-h2">{tr("Submit proof")}</h1>
      <p className="t-body mt-2">
        {tr("Before and after photos are required. During and group photos help the review.")}
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {slots.map((s) => {
          const x = img[s];
          return (
            <div
              key={s}
              className="relative aspect-square overflow-hidden rounded-lg hairline bg-surface"
            >
              {x ? (
                <>
                  <img
                    src={x.url}
                    alt={tr("{stage} photo", { stage: tr(s) })}
                    className="size-full object-cover"
                  />
                  {x.pct < 100 && (
                    <div className="absolute inset-x-0 bottom-0 bg-bg/90 p-2">
                      <div className="h-1 rounded-full bg-line/10">
                        <div
                          className="h-1 rounded-full bg-accent transition-all"
                          style={{ width: `${x.pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                  <button
                    aria-label={tr("Remove {stage} photo", { stage: tr(s) })}
                    onClick={() => setImg(({ [s]: _, ...r }) => r)}
                    className="absolute right-1 top-1 grid size-8 place-items-center rounded-full bg-bg/90"
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <label className="grid size-full cursor-pointer place-items-center text-center text-sm text-muted hover:text-fg">
                  <span>
                    <Camera className="mx-auto mb-1" size={22} strokeWidth={1.75} />
                    {tr(s)}
                    {["Before", "After"].includes(s) && " *"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => pick(s, e.target.files?.[0])}
                  />
                </label>
              )}
              <span className="absolute left-2 top-2 rounded-sm bg-bg/90 px-2 py-0.5 text-xs">
                {tr(s)}
              </span>
            </div>
          );
        })}
      </div>
      <label htmlFor="d" className="mt-6 block text-sm font-medium">
        {tr("What did you clean up?")}
      </label>
      <textarea
        id="d"
        rows={4}
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="mt-2 w-full rounded-md bg-surface p-4 hairline"
        placeholder={tr("e.g. 14 bags of plastic cleared along the bank")}
      />
      <Button
        className="mt-6 w-full"
        disabled={!ready || busy}
        onClick={() => {
          setBusy(true);
          setTimeout(() => {
            setSent(true);
            toast("Proof submitted");
          }, 1000);
        }}
      >
        {busy && <Loader2 size={16} className="animate-spin" />}
        {tr("Submit proof")}
      </Button>
      {!ready && (
        <p className="mt-2 text-center text-xs text-muted">
          {tr("Add before and after photos and a short description.")}
        </p>
      )}
    </main>
  );
}
