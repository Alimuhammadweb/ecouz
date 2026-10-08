"use client";
import { Photo } from "@/components/photo";
import { useState } from "react";
import { useShared } from "@/lib/shared";
import { Button, CoinAmount, StatusBadge } from "@/components/ui";
import { Dialog } from "@/components/dialog";
import { Balance, useStore } from "@/components/store";
import { useI18n, slot } from "@/lib/i18n";

export default function Rewards() {
  const { tr } = useI18n();
  const rewards = useShared().rewards.filter((x) => x.on);
  const { balance, spend, owned, own, toast } = useStore();
  const [sel, setSel] = useState<string | null>(null);
  const r = rewards.find((x) => x.id === sel);
  const short = r ? r.price - balance : 0;
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="t-h2">{tr("Rewards")}</h1>
        <a href="/rewards/my" className="text-sm text-accent">
          {tr("My rewards")}
        </a>
        <p className="text-sm text-muted">
          {tr("Your balance")}{" "}
          <span className="ml-2 text-base text-fg">
            <Balance />
          </span>
        </p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rewards.map((x) => {
          const have = owned.includes(x.id),
            out = x.stock === 0;
          return (
            <article key={x.id} className="flex flex-col rounded-lg hairline bg-surface p-5">
              <div className="aspect-[4/3] overflow-hidden rounded-md">
                <Photo kind="gift" i={parseInt(x.id.slice(1)) || 0} label={tr(x.name)} />
              </div>
              <h2 className="mt-4 font-semibold">
                <a href={`/rewards/${x.id}`} className="hover:text-accent">
                  {tr(x.name)}
                </a>
              </h2>
              <p className="mt-1 flex-1 text-sm text-muted">{tr(x.desc)}</p>
              <div className="mt-4 flex items-center justify-between">
                <CoinAmount n={x.price} />
                {out ? (
                  <StatusBadge s="rejected">{tr("Out of stock")}</StatusBadge>
                ) : x.stock < 10 ? (
                  <span className="text-xs text-muted">{tr("{n} left", { n: x.stock })}</span>
                ) : null}
              </div>
              <Button
                className="mt-4"
                variant={x.price > balance ? "ghost" : "primary"}
                disabled={out || have}
                onClick={() => setSel(x.id)}
              >
                {have ? tr("Requested") : out ? tr("Unavailable") : tr("Redeem")}
              </Button>
            </article>
          );
        })}
      </div>
      <Dialog
        open={!!r}
        onClose={() => setSel(null)}
        title={
          short > 0 ? tr("Not enough coins yet") : tr("Redeem {name}?", { name: tr(r?.name ?? "") })
        }
      >
        {r &&
          (short > 0 ? (
            <>
              <p className="text-sm text-muted">
                {slot(
                  tr(
                    "You need {coins} more. Joining a community cleanup is the fastest way to earn them.",
                  ),
                  "coins",
                  <CoinAmount n={short} />,
                )}
              </p>
              <a href="/cleanups">
                <Button className="mt-6 w-full">{tr("Find a cleanup")}</Button>
              </a>
            </>
          ) : (
            <>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">{tr("Price")}</dt>
                  <dd>
                    <CoinAmount n={r.price} />
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">{tr("Balance after")}</dt>
                  <dd>
                    <CoinAmount n={balance - r.price} />
                  </dd>
                </div>
              </dl>
              <div className="mt-6 flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setSel(null)}>
                  {tr("Cancel")}
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    spend(r.price);
                    own(r.id);
                    setSel(null);
                    toast(
                      tr("{name} requested. We’ll tell you when it’s ready.", {
                        name: tr(r.name),
                      }),
                    );
                  }}
                >
                  {tr("Confirm")}
                </Button>
              </div>
            </>
          ))}
      </Dialog>
    </main>
  );
}
