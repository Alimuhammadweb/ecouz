"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button, CoinAmount, StatusBadge } from "@/components/ui";
import { Dialog } from "@/components/dialog";
import { useI18n } from "@/lib/i18n";

type U = { n: string; role: string; school: string; coins: number; off: boolean };
const seed: U[] = (
  [
    ["Madina R.", "Student", "School No. 110", 6200],
    ["Timur S.", "Volunteer", "—", 5100],
    ["Aziza K.", "Student", "School No. 110", 1850],
    ["Jasur A.", "Citizen", "—", 940],
    ["Dilnoza M.", "Teacher", "School No. 45", 2300],
    ["Bekzod T.", "Student", "School No. 45", 720],
  ] as [string, string, string, number][]
).map(([n, role, school, coins]) => ({ n, role, school, coins, off: false }));
export default function Users() {
  const { tr } = useI18n();
  const [rows, setRows] = useState(seed);
  const [q, setQ] = useState("");
  const [role, setRole] = useState("All");
  const [sel, setSel] = useState<U | null>(null);
  const list = rows.filter(
    (u) => u.n.toLowerCase().includes(q.toLowerCase()) && (role === "All" || u.role === role),
  );
  const toggle = () => {
    setRows(rows.map((u) => (u.n === sel!.n ? { ...u, off: !u.off } : u)));
    setSel(null);
  };
  const act = (u: U) => (
    <Button variant="ghost" className="h-10" onClick={() => setSel(u)}>
      {u.off ? tr("Reinstate") : tr("Suspend")}
    </Button>
  );
  return (
    <main className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 sm:max-w-sm">
          <Search size={16} className="absolute left-4 top-4 text-muted" />
          <input
            aria-label={tr("Search users")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={tr("Search users")}
            className="h-12 w-full rounded-md bg-surface pl-11 pr-4 hairline"
          />
        </div>
        <select
          aria-label={tr("Role")}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="h-12 rounded-md bg-surface px-3 hairline"
        >
          {["All", "Student", "Teacher", "Volunteer", "Citizen"].map((r) => (
            <option key={r} value={r}>
              {tr(r)}
            </option>
          ))}
        </select>
      </div>
      {list.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line/15 p-10 text-center text-sm text-muted">
          {tr("No users match.")}
        </p>
      ) : (
        <>
          <table className="hidden w-full rounded-lg hairline bg-surface text-sm md:table">
            <thead className="text-left text-xs text-muted">
              <tr>
                {["Name", "Role", "School", "Coins", "Status", ""].map((h) => (
                  <th key={h} className="p-3 font-medium">
                    {tr(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.n} className="border-t border-line/10">
                  <td className="p-3 font-medium">{u.n}</td>
                  <td className="p-3">{tr(u.role)}</td>
                  <td className="p-3 text-muted">{tr(u.school)}</td>
                  <td className="p-3">
                    <CoinAmount n={u.coins} />
                  </td>
                  <td className="p-3">
                    <StatusBadge s={u.off ? "rejected" : "verified"}>
                      {u.off ? "Suspended" : "Active"}
                    </StatusBadge>
                  </td>
                  <td className="p-3 text-right">{act(u)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="space-y-2 md:hidden">
            {list.map((u) => (
              <li key={u.n} className="rounded-lg hairline bg-surface p-4 text-sm">
                <div className="flex justify-between">
                  <b className="font-medium">{u.n}</b>
                  <StatusBadge s={u.off ? "rejected" : "verified"}>
                    {u.off ? "Suspended" : "Active"}
                  </StatusBadge>
                </div>
                <p className="mt-1 text-muted">
                  {tr(u.role)} · {tr(u.school)}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <CoinAmount n={u.coins} />
                  {act(u)}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      <Dialog
        open={!!sel}
        onClose={() => setSel(null)}
        title={sel?.off ? tr("Reinstate user?") : tr("Suspend user?")}
      >
        <p className="text-sm text-muted">
          {sel?.off
            ? tr("{name} regains access to reports and cleanups.", { name: sel?.n ?? "" })
            : tr("{name} can no longer join cleanups or redeem rewards. Their coins are kept.", {
                name: sel?.n ?? "",
              })}
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => setSel(null)}>
            {tr("Cancel")}
          </Button>
          <Button className="flex-1" onClick={toggle}>
            {sel?.off ? tr("Reinstate") : tr("Suspend")}
          </Button>
        </div>
      </Dialog>
    </main>
  );
}
