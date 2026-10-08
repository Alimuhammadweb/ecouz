import { FileText, Sprout, Leaf, Users, Wrench, Trophy, type LucideIcon } from "lucide-react";
export const badges: {
  id: string;
  name: string;
  desc: string;
  I: LucideIcon;
  on: boolean;
  hint: string;
}[] = [
  {
    id: "a1",
    name: "First Report",
    desc: "Submit your first pollution report.",
    I: FileText,
    on: true,
    hint: "Earned 12 Sep",
  },
  {
    id: "a2",
    name: "First Cleanup",
    desc: "Complete a community cleanup.",
    I: Sprout,
    on: true,
    hint: "Earned 3 Oct",
  },
  {
    id: "a3",
    name: "Eco Starter",
    desc: "Earn 1,000 coins.",
    I: Leaf,
    on: true,
    hint: "Earned 5 Oct",
  },
  {
    id: "a4",
    name: "Community Hero",
    desc: "Join 5 cleanups with a group.",
    I: Users,
    on: false,
    hint: "2 of 5 done",
  },
  {
    id: "a5",
    name: "Cleanup Master",
    desc: "Complete 10 verified cleanups.",
    I: Wrench,
    on: false,
    hint: "1 of 10 done",
  },
  {
    id: "a6",
    name: "Eco Champion",
    desc: "Reach the monthly top 10.",
    I: Trophy,
    on: false,
    hint: "Rank 14 now",
  },
];
