"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { Field } from "@/components/field";
import { isAdminLogin, setAdmin } from "@/lib/auth";
import { useI18n, type TKey } from "@/lib/i18n";

const CONTACT = /^\S+@\S+\.\S+$|^\+?\d{9,13}$/;

export default function Login() {
  const router = useRouter();
  const { t } = useI18n();
  const [v, setV] = useState({ id: "", pw: "" });
  const [err, setErr] = useState<Partial<Record<"id" | "pw" | "form", TKey>>>({});
  const [busy, setBusy] = useState(false);
  const [reset, setReset] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const x: Partial<Record<"id" | "pw" | "form", TKey>> = {};
    if (!CONTACT.test(v.id)) x.id = "login.errId";
    if (v.pw.length < 8) x.pw = "login.errPw";
    setErr(x);
    if (Object.keys(x).length) return;

    setBusy(true);
    setTimeout(() => {
      if (isAdminLogin(v.id, v.pw)) {
        setAdmin(true);
        router.push("/admin");
        return;
      }
      if (v.pw === "wrongpass") {
        setBusy(false);
        setErr({ form: "login.errBad" });
        return;
      }
      setAdmin(false);
      router.push("/dashboard");
    }, 900);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <h1 className="t-h2">{t("login.title")}</h1>
      {err.form && (
        <p role="alert" className="rounded-md bg-bad/10 p-3 text-sm text-bad">
          {t(err.form)}
        </p>
      )}
      {reset && (
        <p role="status" className="rounded-md bg-ok/10 p-3 text-sm text-ok">
          {t("login.reset")}
        </p>
      )}
      <Field
        id="id"
        label={t("login.id")}
        autoComplete="username"
        value={v.id}
        onChange={(e) => setV({ ...v, id: e.target.value })}
        error={err.id && t(err.id)}
      />
      <Field
        id="pw"
        label={t("login.pw")}
        type="password"
        autoComplete="current-password"
        value={v.pw}
        onChange={(e) => setV({ ...v, pw: e.target.value })}
        error={err.pw && t(err.pw)}
      />
      <div className="flex items-center justify-between text-sm">
        <label className="flex min-h-10 items-center gap-2">
          <input type="checkbox" defaultChecked className="size-4 accent-[rgb(var(--accent))]" />
          {t("login.remember")}
        </label>
        <button type="button" onClick={() => setReset(true)} className="text-accent">
          {t("login.forgot")}
        </button>
      </div>
      <Button className="w-full" disabled={busy}>
        {busy && <Loader2 size={16} className="animate-spin" />}
        {t("login.title")}
      </Button>
      <p className="text-center text-sm text-muted">
        {t("login.new")}{" "}
        <Link href="/register" className="text-accent">
          {t("login.create")}
        </Link>
      </p>
    </form>
  );
}
