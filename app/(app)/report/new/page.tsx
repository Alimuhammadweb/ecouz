"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { ImagePlus, X, LocateFixed, Check, Loader2 } from "lucide-react";
import clsx from "clsx";
import { Button, CoinAmount, Timeline } from "@/components/ui";
import { categories } from "@/lib/data";
import { useI18n, slot } from "@/lib/i18n";

const steps = ["Photos", "Location", "Category", "Details", "Review"];
export default function NewReport() {
  const { tr } = useI18n();
  const [i, setI] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [pin, setPin] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [cat, setCat] = useState("");
  const [desc, setDesc] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const ok = [photos.length >= 3, !!pin, !!cat, desc.trim().length >= 20, true][i];
  const hint = [
    tr("Add 3–4 photos"),
    tr("Drop a pin on the map"),
    tr("Choose a category"),
    tr("Describe the problem ({n} more characters)", { n: Math.max(0, 20 - desc.trim().length) }),
    "",
  ][i];
  const add = (f: FileList | null) =>
    f && setPhotos((p) => [...p, ...Array.from(f).map((x) => URL.createObjectURL(x))].slice(0, 4));
  const locate = () => {
    setLocating(true);
    setTimeout(() => {
      setPin([48, 52]);
      setLocating(false);
    }, 900);
  };
  const submit = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setDone(true);
    }, 1200);
  };
  if (done)
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center md:px-8">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="mx-auto grid size-16 place-items-center rounded-full bg-ok/15 text-ok"
        >
          <Check size={28} />
        </motion.div>
        <h1 className="t-h2 mt-6">{tr("Report R-2042 submitted")}</h1>
        <p className="t-body mx-auto mt-3">
          {slot(
            tr("City staff usually review within 48 hours. If it’s verified you earn {coins}."),
            "coins",
            <CoinAmount n={100} />,
          )}
        </p>
        <div className="mx-auto mt-8 max-w-xs rounded-lg hairline bg-surface p-6 text-left">
          <Timeline
            steps={[
              { label: "Reported", state: "done" },
              { label: "Under review", note: "Expected within 48 h", state: "current" },
              { label: "Verified or rejected", state: "todo" },
            ]}
          />
        </div>
        <a href="/dashboard" className="mt-8 inline-block">
          <Button>{tr("Back to dashboard")}</Button>
        </a>
      </main>
    );
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 md:px-8">
      <ol className="mb-8 flex gap-1" aria-label={tr("Progress")}>
        {steps.map((s, n) => (
          <li key={s} className="flex-1">
            <div
              className={clsx(
                "h-1 rounded-full transition-colors",
                n <= i ? "bg-accent" : "bg-line/10",
              )}
            />
            <p className={clsx("mt-2 hidden text-xs sm:block", n === i ? "text-fg" : "text-muted")}>
              {tr(s)}
            </p>
          </li>
        ))}
      </ol>
      <p className="text-sm text-muted sm:hidden">
        {tr("Step {n} of 5 · {name}", { n: i + 1, name: tr(steps[i]) })}
      </p>
      <motion.section
        key={i}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-2 min-h-[380px]"
      >
        {i === 0 && (
          <>
            <h1 className="t-h2">{tr("Show us what you found")}</h1>
            <p className="t-body mt-2">{tr("Add 3 or 4 clear photos from different angles.")}</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {photos.map((p, n) => (
                <div key={p} className="relative aspect-square overflow-hidden rounded-md hairline">
                  <img
                    src={p}
                    alt={tr("Photo {n}", { n: n + 1 })}
                    className="size-full object-cover"
                  />
                  <button
                    aria-label={tr("Remove photo")}
                    onClick={() => setPhotos(photos.filter((x) => x !== p))}
                    className="absolute right-1 top-1 grid size-8 place-items-center rounded-full bg-bg/90"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {photos.length < 4 && (
                <label className="grid aspect-square cursor-pointer place-items-center rounded-md border border-dashed border-line/25 text-center text-sm text-muted transition-colors hover:border-accent hover:text-fg">
                  <span>
                    <ImagePlus className="mx-auto mb-1" size={22} strokeWidth={1.75} />
                    {tr("Add photo")}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(e) => add(e.target.files)}
                  />
                </label>
              )}
            </div>
          </>
        )}
        {i === 1 && (
          <>
            <h1 className="t-h2">{tr("Where is it?")}</h1>
            <p className="t-body mt-2">
              {tr("Tap the map to drop a pin, or share your location if you’re standing there.")}
            </p>
            <div
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setPin([
                  Math.round(((e.clientX - r.left) / r.width) * 100),
                  Math.round(((e.clientY - r.top) / r.height) * 100),
                ]);
              }}
              className="relative mt-6 aspect-[4/3] cursor-crosshair overflow-hidden rounded-lg hairline bg-surface"
              style={{
                backgroundImage:
                  "linear-gradient(rgb(var(--line)/.08) 1px,transparent 1px),linear-gradient(90deg,rgb(var(--line)/.08) 1px,transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            >
              {pin && (
                <motion.span
                  key={pin.join()}
                  initial={{ y: -16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  style={{ left: `${pin[0]}%`, top: `${pin[1]}%` }}
                  className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent ring-8 ring-accent/20"
                />
              )}
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button variant="ghost" onClick={locate} disabled={locating}>
                {locating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <LocateFixed size={16} />
                )}
                {tr("Use my current location")}
              </Button>
              {pin && (
                <p className="text-sm text-muted">
                  {tr("Pinned at {lat}° N, {lng}° E", {
                    lat: (41.2 + pin[1] / 1000).toFixed(4),
                    lng: (69.2 + pin[0] / 1000).toFixed(4),
                  })}
                </p>
              )}
            </div>
          </>
        )}
        {i === 2 && (
          <>
            <h1 className="t-h2">{tr("What kind of pollution?")}</h1>
            <div className="mt-6 grid gap-2 sm:grid-cols-2" role="radiogroup">
              {categories.map((c) => (
                <button
                  key={c}
                  role="radio"
                  aria-checked={cat === c}
                  onClick={() => setCat(c)}
                  className={clsx(
                    "flex h-14 items-center justify-between rounded-md px-4 text-left text-sm hairline transition-colors",
                    cat === c ? "border-accent bg-accent/10 font-medium" : "hover:bg-raised",
                  )}
                >
                  {tr(c)}
                  {cat === c && <Check size={16} className="text-accent" />}
                </button>
              ))}
            </div>
          </>
        )}
        {i === 3 && (
          <>
            <h1 className="t-h2">{tr("Add details")}</h1>
            <label className="mt-6 block text-sm font-medium" htmlFor="d">
              {tr("What should the cleanup crew know?")}
            </label>
            <textarea
              id="d"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={6}
              className="mt-2 w-full rounded-md bg-surface p-4 text-base hairline placeholder:text-muted focus:border-accent"
              placeholder={tr("How big is it, how long has it been there, is access difficult?")}
            />
          </>
        )}
        {i === 4 && (
          <>
            <h1 className="t-h2">{tr("Check and submit")}</h1>
            <dl className="mt-6 divide-y divide-line/10 rounded-lg hairline bg-surface text-sm">
              {[
                [tr("Photos"), tr("{n} attached", { n: photos.length })],
                [tr("Category"), cat ? tr(cat) : ""],
                [tr("Location"), pin ? tr("{x}, {y} on map", { x: pin[0], y: pin[1] }) : ""],
                [tr("Details"), desc],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-1 p-4 sm:flex-row sm:gap-6">
                  <dt className="w-24 shrink-0 text-muted">{k}</dt>
                  <dd className="min-w-0 break-words">{v}</dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </motion.section>
      <div className="sticky bottom-20 mt-6 flex items-center justify-between gap-3 bg-bg/90 py-3 backdrop-blur lg:bottom-0">
        <Button variant="ghost" disabled={i === 0 || sending} onClick={() => setI(i - 1)}>
          {tr("Back")}
        </Button>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted sm:block">{!ok && hint}</span>
          {i < 4 ? (
            <Button disabled={!ok} onClick={() => setI(i + 1)}>
              {tr("Continue")}
            </Button>
          ) : (
            <Button disabled={sending} onClick={submit}>
              {sending && <Loader2 size={16} className="animate-spin" />}
              {tr("Submit report")}
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
