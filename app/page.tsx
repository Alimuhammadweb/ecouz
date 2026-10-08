"use client";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Camera,
  Gift,
  Route,
  ShieldCheck,
  Sprout,
  Users,
  type LucideIcon,
} from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { HeroCase } from "@/components/hero-case";
import { StageGallery } from "@/components/stage-gallery";
import { Button, CoinAmount } from "@/components/ui";
import { useI18n, type TKey } from "@/lib/i18n";

const steps: { I: LucideIcon; t: TKey; d: TKey }[] = [
  { I: Camera, t: "s1t", d: "s1d" },
  { I: ShieldCheck, t: "s2t", d: "s2d" },
  { I: Route, t: "s3t", d: "s3d" },
  { I: Sprout, t: "s4t", d: "s4d" },
  { I: Gift, t: "s5t", d: "s5d" },
];
const paths: { I: LucideIcon; t: TKey; d: TKey }[] = [
  { I: Building2, t: "how.gov", d: "how.govd" },
  { I: Users, t: "how.com", d: "how.comd" },
];

export default function Home() {
  const { t } = useI18n();
  return (
    <>
      <SiteNav />
      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-12 md:px-8 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div>
            <h1 className="t-display max-w-[14ch]">{t("hero.title")}</h1>
            <p className="t-body mt-6">{t("hero.text")}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/report/new">
                <Button className="w-full">{t("hero.cta1")}</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full">
                  {t("hero.cta2")}
                </Button>
              </Link>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 text-sm">
              {(
                [
                  ["stat.closed", "1,284"],
                  ["stat.vol", "9,310"],
                ] as [TKey, string][]
              ).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-muted">{t(k)}</dt>
                  <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">{v}</dd>
                </div>
              ))}
              <div>
                <dt className="text-muted">{t("stat.coins")}</dt>
                <dd className="mt-1 font-display text-2xl font-semibold">
                  <CoinAmount n={412000} />
                </dd>
              </div>
            </dl>
          </div>
          <HeroCase />
        </section>

        <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 md:px-8">
          <h2 className="t-h2 max-w-[24ch]">{t("how.title")}</h2>
          <p className="t-body mt-4">{t("how.lead")}</p>
          <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {steps.map(({ I, t: title, d }, n) => (
              <li key={title} className="rounded-lg bg-surface p-5 hairline">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-full bg-accent text-accent-fg">
                    <I size={20} strokeWidth={1.75} />
                  </span>
                  <span className="font-display text-3xl font-semibold text-muted/40">{n + 1}</span>
                </div>
                <h3 className="mt-4 font-semibold">{t(title)}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{t(d)}</p>
              </li>
            ))}
          </ol>

          <h3 className="mt-16 text-xl font-semibold">{t("how.paths")}</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {paths.map(({ I, t: title, d }) => (
              <article key={title} className="rounded-lg bg-surface p-6 hairline md:p-8">
                <I size={24} strokeWidth={1.75} className="text-accent" />
                <h4 className="mt-4 text-xl font-semibold">{t(title)}</h4>
                <p className="mt-2 text-sm leading-6 text-muted">{t(d)}</p>
              </article>
            ))}
          </div>
          <Link
            href="/dashboard"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent"
          >
            {t("how.live")} <ArrowRight size={16} />
          </Link>
        </section>
        <section id="stages" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 md:px-8">
          <h2 className="t-h2 max-w-[24ch]">{t("stages.title")}</h2>
          <p className="t-body mt-4 max-w-[64ch]">{t("stages.lead")}</p>
          <StageGallery className="mt-8" i={0} />
          <StageGallery className="mt-8" i={1} />
        </section>
      </main>
    </>
  );
}
