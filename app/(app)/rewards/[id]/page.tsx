"use client";
import { Photo } from "@/components/photo";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useShared } from "@/lib/shared";
import { Button, CoinAmount } from "@/components/ui";
import { Dialog } from "@/components/dialog";
import { useStore } from "@/components/store";
import { useI18n, slot, slots } from "@/lib/i18n";

export default function RewardDetail() {
  const { tr } = useI18n();
  const { id } = useParams<{ id: string }>();
  const r = useShared().rewards.find((x) => x.id === id && x.on);
  const { balance, spend, owned, own, toast } = useStore();
  const [open, setOpen] = useState(false);
  if (!r)
    return (
      <main className="px-4 py-16 text-center text-sm text-muted">
        {tr("Reward not found.")}{" "}
        <Link href="/rewards" className="text-accent">
          {tr("Back to rewards")}
        </Link>
      </main>
    );
  const have = owned.includes(r.id),
    out = r.stock === 0,
    short = r.price - balance;
  return (
    <main className="mx-auto grid max-w-4xl gap-8 px-4 py-8 md:grid-cols-2 md:px-8">
      <div className="aspect-square overflow-hidden rounded-lg hairline">
        <Photo kind="gift" i={parseInt(r.id.slice(1)) || 0} label={tr(r.name)} />
      </div>
      <div>
        <Link href="/rewards" className="text-sm text-muted hover:text-fg">
          {tr("All rewards")}
        </Link>
        <h1 className="t-h2 mt-2">{tr(r.name)}</h1>
        <p className="t-body mt-3">{tr(r.desc)}</p>
        <dl className="mt-6 divide-y divide-line/10 rounded-lg hairline bg-surface text-sm">
          <div className="flex justify-between p-4">
            <dt className="text-muted">{tr("Price")}</dt>
            <dd>
              <CoinAmount n={r.price} />
            </dd>
          </div>
          <div className="flex justify-between p-4">
            <dt className="text-muted">{tr("Stock")}</dt>
            <dd>{out ? tr("Out of stock") : tr("{n} left", { n: r.stock })}</dd>
          </div>
          <div className="flex justify-between p-4">
            <dt className="text-muted">{tr("Your balance")}</dt>
            <dd>
              <CoinAmount n={balance} />
            </dd>
          </div>
        </dl>
        {!out && !have && short > 0 && (
          <p className="mt-4 rounded-md bg-accent/10 p-3 text-sm">
            {slot(tr("You need {coins} more."), "coins", <CoinAmount n={short} />)}{" "}
            <Link href="/cleanups" className="text-accent">
              {tr("Find a cleanup")}
            </Link>
          </p>
        )}
        <Button
          className="mt-6 w-full"
          disabled={out || have || short > 0}
          onClick={() => setOpen(true)}
        >
          {have ? tr("Requested") : out ? tr("Unavailable") : tr("Redeem")}
        </Button>
      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={tr("Redeem {name}?", { name: tr(r.name) })}
      >
        <p className="text-sm text-muted">
          {slots(tr("This costs {price}. You’ll have {left} left."), {
            price: <CoinAmount n={r.price} />,
            left: <CoinAmount n={balance - r.price} />,
          })}
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setOpen(false)}>
            {tr("Cancel")}
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              spend(r.price);
              own(r.id);
              setOpen(false);
              toast("Reward requested");
            }}
          >
            {tr("Confirm")}
          </Button>
        </div>
      </Dialog>
    </main>
  );
}
