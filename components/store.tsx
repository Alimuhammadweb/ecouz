"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { CoinAmount } from "./ui";
import { useI18n } from "@/lib/i18n";
type Part = "joined" | "checked_in";
type Ctx = {
  balance: number;
  spend: (n: number) => void;
  part: Record<string, Part>;
  setPart: (id: string, s: Part) => void;
  toast: (m: string) => void;
  owned: string[];
  own: (id: string) => void;
  grp: string[];
  joinGrp: (id: string) => void;
};
const C = createContext<Ctx>(null!);
export const useStore = () => useContext(C);
export function Balance() {
  return <CoinAmount n={useStore().balance} />;
}
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { tr } = useI18n();
  const [balance, setBalance] = useState(1850);
  const [part, setP] = useState<Record<string, Part>>({});
  const [owned, setOwned] = useState<string[]>([]);
  const [grp, setGrp] = useState<string[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const toast = useCallback((m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(null), 2800);
  }, []);
  return (
    <C.Provider
      value={{
        balance,
        spend: (n) => setBalance((b) => b - n),
        part,
        setPart: (id, s) => setP((p) => ({ ...p, [id]: s })),
        toast,
        owned,
        own: (id) => setOwned((o) => [...o, id]),
        grp,
        joinGrp: (id) => setGrp((g) => [...g, id]),
      }}
    >
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex justify-center px-4 lg:bottom-6"
      >
        <AnimatePresence>
          {msg && (
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 rounded-md bg-fg px-4 py-3 text-sm text-bg"
            >
              <Check size={16} />
              {tr(msg)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </C.Provider>
  );
}
