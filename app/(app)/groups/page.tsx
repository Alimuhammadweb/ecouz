"use client";
import { useState } from "react";
import Link from "next/link";
import { Users, Plus } from "lucide-react";
import { groups as seed, cleanups, type Group } from "@/lib/data";
import { Button } from "@/components/ui";
import { Dialog } from "@/components/dialog";
import { Field } from "@/components/field";
import { useStore } from "@/components/store";
import { useI18n } from "@/lib/i18n";

function GroupCard({ g }: { g: Group }) {
  const { tr } = useI18n();
  const { grp, joinGrp, toast } = useStore();
  const mine = grp.includes(g.id),
    n = g.members.length + (mine ? 1 : 0),
    full = n >= g.cap;
  return (
    <article className="rounded-lg hairline bg-surface p-5">
      <Link href={`/groups/${g.id}`} className="font-semibold hover:text-accent">
        {tr(g.name)}
      </Link>
      <p className="mt-1 text-sm text-muted">
        {tr("Led by {name}", { name: g.leader })} ·{" "}
        {tr(cleanups.find((c) => c.id === g.cleanup)?.place ?? "")}
      </p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="flex items-center gap-1 text-muted">
          <Users size={16} />
          {tr("{n} of {cap}", { n, cap: g.cap })}
        </span>
        <span>{tr("{p}% done", { p: g.progress })}</span>
      </div>
      <div className="mt-2 h-1 rounded-full bg-line/10">
        <div className="h-1 rounded-full bg-accent" style={{ width: `${g.progress}%` }} />
      </div>
      <Button
        className="mt-4 w-full"
        variant={mine ? "ghost" : "primary"}
        disabled={mine || full}
        onClick={() => {
          joinGrp(g.id);
          toast(tr("Joined {name}", { name: tr(g.name) }));
        }}
      >
        {mine ? tr("Joined") : full ? tr("Group full") : tr("Join group")}
      </Button>
    </article>
  );
}
export default function Groups() {
  const { tr } = useI18n();
  const [list, setList] = useState<Group[]>(seed);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [cl, setCl] = useState("c1");
  const [err, setErr] = useState("");
  const { toast } = useStore();
  const create = () => {
    if (name.trim().length < 3) return setErr("Give your group a name of at least 3 characters");
    setList([
      {
        id: `g${list.length + 1}`,
        name: name.trim(),
        leader: "You",
        members: ["You"],
        cap: 10,
        cleanup: cl,
        progress: 0,
        proofs: 0,
      },
      ...list,
    ]);
    setOpen(false);
    setName("");
    setErr("");
    toast("Group created");
  };
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="t-h2">{tr("Groups")}</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus size={16} />
          {tr("Create group")}
        </Button>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((g) => (
          <GroupCard key={g.id} g={g} />
        ))}
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} title={tr("Create a group")}>
        <div className="space-y-4">
          <Field
            id="gn"
            label={tr("Group name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={err}
          />
          <label className="block text-sm font-medium">
            {tr("Cleanup")}
            <select
              value={cl}
              onChange={(e) => setCl(e.target.value)}
              className="mt-2 h-12 w-full rounded-md bg-bg px-3 hairline"
            >
              {cleanups
                .filter((c) => c.status === "open")
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {tr(c.title)}
                  </option>
                ))}
            </select>
          </label>
          <Button className="w-full" onClick={create}>
            {tr("Create group")}
          </Button>
        </div>
      </Dialog>
    </main>
  );
}
