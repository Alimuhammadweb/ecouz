"use client";
import { useSyncExternalStore } from "react";
import { rewards as seed } from "./data";
export type SharedReward = (typeof seed)[number] & { on: boolean };
type S = { radius: number; rewards: SharedReward[] };
let s: S = { radius: 100, rewards: seed.map((r) => ({ ...r, on: true })) };
const subs = new Set<() => void>();
export const setShared = (p: Partial<S>) => {
  s = { ...s, ...p };
  subs.forEach((f) => f());
};
export const useShared = () =>
  useSyncExternalStore(
    (f) => (
      subs.add(f),
      () => {
        subs.delete(f);
      }
    ),
    () => s,
    () => s,
  );
