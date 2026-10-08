"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { Field } from "@/components/field";
import { useI18n } from "@/lib/i18n";

export default function AdminNotifications() {
  const { tr } = useI18n();
  const [sent, setSent] = useState([
    { t: "Cleanup this Saturday in Chust", a: "Everyone", w: "2 days ago" },
  ]);
  const [f, setF] = useState({ a: "Everyone", t: "", m: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const send = () => {
    const e: Record<string, string> = {};
    if (f.t.trim().length < 4) e.t = "Add a short title";
    if (f.m.trim().length < 10) e.m = "Write at least 10 characters";
    setErr(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    setTimeout(() => {
      setSent([{ t: f.t, a: f.a, w: "Just now" }, ...sent]);
      setF({ ...f, t: "", m: "" });
      setBusy(false);
    }, 800);
  };
  return (
    <main className="grid gap-4 p-4 md:p-6 lg:grid-cols-2">
      <section className="space-y-4 rounded-lg hairline bg-surface p-4 md:p-6">
        <h1 className="font-semibold">{tr("Send a notification")}</h1>
        <label className="block text-sm font-medium">
          {tr("Audience")}
          <select
            value={f.a}
            onChange={(e) => setF({ ...f, a: e.target.value })}
            className="mt-2 h-12 w-full rounded-md bg-bg px-3 hairline"
          >
            {["Everyone", "Students", "Teachers", "Volunteers", "School No. 110"].map((x) => (
              <option key={x} value={x}>
                {tr(x)}
              </option>
            ))}
          </select>
        </label>
        <Field
          id="nt"
          label={tr("Title")}
          value={f.t}
          onChange={(e) => setF({ ...f, t: e.target.value })}
          error={err.t}
        />
        <div>
          <label htmlFor="nm" className="text-sm font-medium">
            {tr("Message")}
          </label>
          <textarea
            id="nm"
            rows={4}
            value={f.m}
            onChange={(e) => setF({ ...f, m: e.target.value })}
            className="mt-2 w-full rounded-md bg-bg p-4 hairline"
          />
          {err.m && <p className="mt-1 text-sm text-bad">{tr(err.m)}</p>}
        </div>
        <Button disabled={busy} onClick={send}>
          {busy && <Loader2 size={16} className="animate-spin" />}
          {tr("Send to {who}", { who: tr(f.a).toLowerCase() })}
        </Button>
      </section>
      <section className="h-fit rounded-lg hairline bg-surface">
        <p className="border-b border-line/10 p-4 text-sm font-medium">{tr("Sent")}</p>
        <ul className="divide-y divide-line/10">
          {sent.map((s, i) => (
            <li key={i} className="p-4 text-sm">
              <p className="font-medium">{tr(s.t)}</p>
              <p className="text-muted">
                {tr(s.a)} · {tr(s.w)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
