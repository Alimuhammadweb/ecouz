export type Report = {
  id: string;
  title: string;
  place: string;
  category: string;
  by: string;
  when: string;
  status: "review" | "verified" | "rejected";
  path?: "government" | "community";
  coins?: number;
  x: number;
  y: number;
  note: string;
};
export const reports: Report[] = [
  {
    id: "R-2041",
    title: "Plastic dump by riverbank",
    place: "Chust, Namangan",
    category: "Plastic waste",
    by: "Aziza K.",
    when: "Today, 09:14",
    status: "review",
    x: 44,
    y: 58,
    note: "Bags and bottles spread along ~30 m of the bank. Smell after rain.",
  },
  {
    id: "R-2040",
    title: "Construction debris on footpath",
    place: "Pop",
    category: "Construction waste",
    by: "Timur S.",
    when: "Today, 08:02",
    status: "review",
    x: 66,
    y: 30,
    note: "Concrete and rebar left after roadworks, blocking half the pavement.",
  },
  {
    id: "R-2036",
    title: "Burning waste behind market",
    place: "Kosonsoy",
    category: "Air pollution",
    by: "Madina R.",
    when: "Yesterday",
    status: "verified",
    path: "government",
    coins: 100,
    x: 30,
    y: 76,
    note: "Daily burning of packaging waste.",
  },
  {
    id: "R-2031",
    title: "Blurred photo, no visible waste",
    place: "Uychi",
    category: "Other",
    by: "Jasur A.",
    when: "2 days ago",
    status: "rejected",
    x: 20,
    y: 28,
    note: "Could not identify the location.",
  },
];
export const categories = [
  "General waste",
  "Plastic waste",
  "Water pollution",
  "Air pollution",
  "Construction waste",
  "Illegal dumping",
  "Other",
];
export type Cleanup = {
  id: string;
  title: string;
  place: string;
  date: string;
  time: string;
  reward: number;
  joined: number;
  cap: number;
  km: number;
  status: "open" | "full" | "done";
  org: string;
  about: string;
  need: string[];
};
export const cleanups: Cleanup[] = [
  {
    id: "c1",
    title: "Chust riverbank cleanup",
    place: "Chust, Namangan",
    date: "Sat 10 Oct",
    time: "09:00–12:00",
    reward: 1000,
    joined: 12,
    cap: 20,
    km: 1.2,
    status: "open",
    org: "Namangan Regional Hokimiyat",
    about:
      "Clear plastic and bagged waste along 300 m of riverbank. Gloves and bags are provided on site.",
    need: ["Closed shoes", "Water bottle", "Photo ID for check-in"],
  },
  {
    id: "c2",
    title: "Pop footpath debris",
    place: "Pop",
    date: "Sun 11 Oct",
    time: "10:00–13:00",
    reward: 600,
    joined: 8,
    cap: 8,
    km: 4.8,
    status: "full",
    org: "Pop District Office",
    about: "Remove construction debris left after roadworks and sweep the footpath.",
    need: ["Work gloves", "Closed shoes"],
  },
  {
    id: "c3",
    title: "Kosonsoy market perimeter",
    place: "Kosonsoy",
    date: "Sat 17 Oct",
    time: "08:00–11:00",
    reward: 1500,
    joined: 21,
    cap: 40,
    km: 9.3,
    status: "open",
    org: "Kosonsoy Eco Team",
    about: "Collect burnt packaging waste and bag it for municipal pickup.",
    need: ["Mask", "Gloves"],
  },
  {
    id: "c4",
    title: "Uychi canal",
    place: "Uychi",
    date: "Sat 3 Oct",
    time: "09:00–12:00",
    reward: 800,
    joined: 25,
    cap: 25,
    km: 6.1,
    status: "done",
    org: "School No. 110",
    about: "Completed. Proof verified and coins distributed to 25 participants.",
    need: [],
  },
];
export const rewards = [
  {
    id: "r1",
    name: "Reusable water bottle",
    desc: "Steel, 750 ml, laser-engraved city map.",
    price: 400,
    stock: 34,
  },
  {
    id: "r2",
    name: "Mobile top-up",
    desc: "20,000 UZS credit on your phone balance.",
    price: 800,
    stock: 120,
  },
  {
    id: "r3",
    name: "Cinema ticket pair",
    desc: "Two tickets at any partner cinema.",
    price: 1500,
    stock: 6,
  },
  {
    id: "r4",
    name: "Planted tree in your name",
    desc: "Planted by city parks; location sent to you.",
    price: 500,
    stock: 0,
  },
];
export const txs: { id: string; label: string; n: number; when: string; pending?: boolean }[] = [
  { id: "t1", label: "Report verified · R-2036", n: 100, when: "Yesterday" },
  { id: "t2", label: "Cleanup completed · Canal", n: 250, when: "3 Oct" },
  { id: "t3", label: "Community bonus", n: 50, when: "1 Oct" },
  { id: "t4", label: "Reward redeemed · Bottle", n: -400, when: "28 Sep" },
  { id: "t5", label: "Cleanup proof in review", n: 100, when: "Today", pending: true },
];
export type Group = {
  id: string;
  name: string;
  leader: string;
  members: string[];
  cap: number;
  cleanup: string;
  progress: number;
  proofs: number;
};
export const groups: Group[] = [
  {
    id: "g1",
    name: "Chust Eco Team",
    leader: "Madina R.",
    members: ["Madina R.", "Timur S.", "Dilnoza M.", "Bekzod T.", "Nodira Y."],
    cap: 8,
    cleanup: "c1",
    progress: 60,
    proofs: 3,
  },
  {
    id: "g2",
    name: "School 110 Volunteers",
    leader: "Sardor U.",
    members: ["Sardor U.", "Malika H.", "Otabek N."],
    cap: 10,
    cleanup: "c3",
    progress: 20,
    proofs: 0,
  },
  {
    id: "g3",
    name: "Canal Crew",
    leader: "Zarina F.",
    members: ["Zarina F.", "Rustam B."],
    cap: 2,
    cleanup: "c4",
    progress: 100,
    proofs: 8,
  },
];
export type School = {
  id: string;
  name: string;
  district: string;
  students: number;
  coins: number;
  cleanups: number;
  classes: { n: string; students: number; coins: number }[];
};
export const schools: School[] = [
  {
    id: "s1",
    name: "School No. 110",
    district: "Uychi",
    students: 214,
    coins: 48200,
    cleanups: 31,
    classes: [
      { n: "9A", students: 28, coins: 9400 },
      { n: "9B", students: 26, coins: 7100 },
      { n: "10A", students: 24, coins: 6800 },
      { n: "11C", students: 22, coins: 3900 },
    ],
  },
  {
    id: "s2",
    name: "School No. 45",
    district: "Chust",
    students: 168,
    coins: 39600,
    cleanups: 24,
    classes: [
      { n: "8B", students: 25, coins: 8800 },
      { n: "10D", students: 27, coins: 7200 },
      { n: "11A", students: 21, coins: 5100 },
    ],
  },
  {
    id: "s3",
    name: "School No. 21",
    district: "Pop",
    students: 97,
    coins: 18300,
    cleanups: 12,
    classes: [
      { n: "7A", students: 24, coins: 5200 },
      { n: "9C", students: 23, coins: 4400 },
    ],
  },
];
