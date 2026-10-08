"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Loader2, Plus } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui";
import { Field } from "@/components/field";
import { useI18n } from "@/lib/i18n";

const roles = ["Student", "Teacher", "Volunteer", "Citizen", "Other"];
const schools = [
  { n: "School No. 110", d: "Uychi", s: 214 },
  { n: "School No. 45", d: "Chust", s: 168 },
  { n: "School No. 21", d: "Pop", s: 97 },
  { n: "Presidential School", d: "Kosonsoy", s: 63 },
];
export default function Register() {
  const { tr } = useI18n();
  const r = useRouter();
  const [i, setI] = useState(0);
  const [f, setF] = useState({
    name: "",
    contact: "",
    role: "",
    school: "",
    cls: "",
    grp: "",
    pw: "",
  });
  const [q, setQ] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const student = f.role === "Student";
  const order = student ? [0, 1, 2, 3] : [0, 1, 3];
  const pos = order.indexOf(i);
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const check = () => {
    const x: Record<string, string> = {};
    if (i === 0) {
      if (f.name.trim().length < 2) x.name = "Enter your full name";
      if (!/^\S+@\S+\.\S+$|^\+?\d{9,13}$/.test(f.contact))
        x.contact = "Enter a valid email or phone number";
    }
    if (i === 1 && !f.role) x.role = "Choose how you’ll take part";
    if (i === 2) {
      if (!f.school) x.school = "Select your school";
      else if (!f.cls || !f.grp) x.cls = "Choose your class and group";
    }
    if (i === 3 && f.pw.length < 8) x.pw = "Use at least 8 characters";
    setErr(x);
    return !Object.keys(x).length;
  };
  const next = () => {
    if (!check()) return;
    if (i === 3) {
      setBusy(true);
      setTimeout(() => r.push("/dashboard"), 1000);
    } else setI(order[pos + 1]);
  };
  const hits = schools.filter((s) => s.n.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div
        className="flex gap-1"
        aria-label={tr("Step {n} of {total}", { n: pos + 1, total: order.length })}
      >
        {order.map((n, k) => (
          <div
            key={n}
            className={clsx("h-1 flex-1 rounded-full", k <= pos ? "bg-accent" : "bg-line/10")}
          />
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">
        {tr("Step {n} of {total}", { n: pos + 1, total: order.length })}
      </p>
      <div className="mt-2 min-h-[320px] space-y-5">
        {i === 0 && (
          <>
            <h1 className="t-h2">{tr("Create your account")}</h1>
            <Field
              id="n"
              label={tr("Full name")}
              value={f.name}
              onChange={(e) => set("name", e.target.value)}
              error={err.name}
            />
            <Field
              id="c"
              label={tr("Email or phone")}
              value={f.contact}
              onChange={(e) => set("contact", e.target.value)}
              error={err.contact}
            />
          </>
        )}
        {i === 1 && (
          <>
            <h1 className="t-h2">{tr("How will you take part?")}</h1>
            <div className="grid gap-2" role="radiogroup">
              {roles.map((x) => (
                <button
                  key={x}
                  role="radio"
                  aria-checked={f.role === x}
                  onClick={() => set("role", x)}
                  className={clsx(
                    "flex h-14 items-center justify-between rounded-md px-4 text-left hairline",
                    f.role === x && "border-accent bg-accent/10 font-medium",
                  )}
                >
                  {tr(x)}
                  {f.role === x && <Check size={16} className="text-accent" />}
                </button>
              ))}
            </div>
            {err.role && <p className="text-sm text-bad">{tr(err.role)}</p>}
          </>
        )}
        {i === 2 && (
          <>
            <h1 className="t-h2">{tr("Find your school")}</h1>
            <input
              aria-label={tr("Search schools")}
              placeholder={tr("Search schools")}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-12 w-full rounded-md bg-surface px-4 hairline"
            />
            <ul className="space-y-2">
              {hits.map((s) => (
                <li key={s.n}>
                  <button
                    onClick={() => set("school", s.n)}
                    aria-pressed={f.school === s.n}
                    className={clsx(
                      "flex w-full items-center justify-between rounded-md p-3 text-left text-sm hairline",
                      f.school === s.n && "border-accent bg-accent/10",
                    )}
                  >
                    <span>
                      <span className="font-medium">{tr(s.n)}</span>
                      <br />
                      <span className="text-muted">{tr(s.d)}</span>
                    </span>
                    <span className="text-xs text-ok">
                      {tr("{n} students already joined", { n: s.s })}
                    </span>
                  </button>
                </li>
              ))}
              {hits.length === 0 && q && (
                <li>
                  <button
                    onClick={() => set("school", q)}
                    className="flex h-12 w-full items-center gap-2 rounded-md px-3 text-sm text-accent hairline"
                  >
                    <Plus size={16} />
                    {tr("Add “{q}” as a new school", { q })}
                  </button>
                </li>
              )}
            </ul>
            {f.school && (
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm font-medium">
                  {tr("Class")}
                  <select
                    value={f.cls}
                    onChange={(e) => set("cls", e.target.value)}
                    className="mt-2 h-12 w-full rounded-md bg-surface px-3 hairline"
                  >
                    {["", ...Array.from({ length: 11 }, (_, k) => String(k + 1))].map((x) => (
                      <option key={x} value={x}>
                        {x || tr("Select")}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium">
                  {tr("Group")}
                  <select
                    value={f.grp}
                    onChange={(e) => set("grp", e.target.value)}
                    className="mt-2 h-12 w-full rounded-md bg-surface px-3 hairline"
                  >
                    {["", "A", "B", "C", "D", "E"].map((x) => (
                      <option key={x} value={x}>
                        {x || tr("Select")}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            {(err.school || err.cls) && (
              <p className="text-sm text-bad">{tr(err.school || err.cls)}</p>
            )}
          </>
        )}
        {i === 3 && (
          <>
            <h1 className="t-h2">{tr("Set a password")}</h1>
            <Field
              id="p"
              label={tr("Password")}
              type="password"
              autoComplete="new-password"
              value={f.pw}
              onChange={(e) => set("pw", e.target.value)}
              error={err.pw}
            />
            <p className="text-sm text-muted">
              {tr("Joining as {role}", { role: tr(f.role) })}
              {student && f.school ? ` · ${tr(f.school)}, ${f.cls}${f.grp}` : ""}.
            </p>
          </>
        )}
      </div>
      <div className="mt-6 flex justify-between gap-3">
        <Button variant="ghost" disabled={pos === 0 || busy} onClick={() => setI(order[pos - 1])}>
          {tr("Back")}
        </Button>
        <Button disabled={busy} onClick={next}>
          {busy && <Loader2 size={16} className="animate-spin" />}
          {i === 3 ? tr("Create account") : tr("Continue")}
        </Button>
      </div>
      <p className="mt-8 text-center text-sm text-muted">
        {tr("Already registered?")}{" "}
        <Link href="/login" className="text-accent">
          {tr("Log in")}
        </Link>
      </p>
    </div>
  );
}
