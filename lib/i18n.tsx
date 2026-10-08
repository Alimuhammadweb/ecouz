"use client";
import { phrases } from "./phrases";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const LANGS = { uz: "O‘zbekcha", ru: "Русский", en: "English" } as const;
export type Lang = keyof typeof LANGS;
const ORDER: Lang[] = ["en", "ru", "uz"];

/** Each key: [English, Русский, O‘zbekcha]. Add a key here and it is available everywhere via t(). */
const dict = {
  "nav.how": ["How it works", "Как это работает", "Qanday ishlaydi"],
  "nav.explore": ["Explore", "Карта", "Xarita"],
  "nav.leaderboard": ["Leaderboard", "Рейтинг", "Reyting"],
  "nav.report": ["Report", "Сообщить", "Xabar berish"],
  "nav.dashboard": ["Dashboard", "Кабинет", "Kabinet"],
  "nav.login": ["Log in", "Войти", "Kirish"],
  "nav.start": ["Get started", "Начать", "Boshlash"],
  "hero.title": [
    "Every dump site gets a case number.",
    "У каждой свалки есть номер дела.",
    "Har bir axlat joyining o‘z raqami bor.",
  ],
  "hero.text": [
    "Photograph pollution, pin it on the map, and follow it until it’s gone. Staff verify each report, and neighbours who clean it up earn coins for proven work.",
    "Сфотографируйте загрязнение, отметьте на карте и следите, пока его не уберут. Сотрудники проверяют каждое сообщение, а соседи, которые убирают, получают монеты за подтверждённую работу.",
    "Ifloslikni suratga oling, xaritada belgilang va u tozalanguncha kuzating. Xodimlar har bir xabarni tekshiradi, tozalagan qo‘shnilar esa tasdiqlangan ish uchun tanga oladi.",
  ],
  "hero.cta1": ["Report pollution", "Сообщить о загрязнении", "Ifloslik haqida xabar berish"],
  "hero.cta2": ["Open dashboard", "Открыть кабинет", "Kabinetni ochish"],
  "stat.closed": ["Reports closed", "Закрыто обращений", "Yopilgan xabarlar"],
  "stat.vol": ["Volunteers", "Волонтёры", "Ko‘ngillilar"],
  "stat.coins": ["Coins paid", "Выплачено монет", "To‘langan tangalar"],
  "how.title": [
    "How Tozalash works, step by step",
    "Как работает Tozalash, шаг за шагом",
    "Tozalash qanday ishlaydi, bosqichma-bosqich",
  ],
  "how.lead": [
    "From a photo on your phone to coins in your balance — the whole journey.",
    "От фото в телефоне до монет на балансе — весь путь.",
    "Telefondagi suratdan balansdagi tangalargacha — butun yo‘l.",
  ],
  s1t: ["Photograph and report", "Сфотографируйте и сообщите", "Suratga oling va xabar bering"],
  s1d: [
    "Take 3–4 photos of the dump site, drop a pin on the map and choose a category. It takes about two minutes.",
    "Сделайте 3–4 фото свалки, поставьте метку на карте и выберите категорию. Это займёт около двух минут.",
    "Axlat joyining 3–4 ta suratini oling, xaritada belgi qo‘ying va turini tanlang. Taxminan ikki daqiqa oladi.",
  ],
  s2t: ["Staff verify it", "Сотрудники проверяют", "Xodimlar tekshiradi"],
  s2d: [
    "A moderator checks the photos and location within 48 hours. Verified reports get a case number and coins; unclear ones are rejected with a reason.",
    "Модератор проверяет фото и место в течение 48 часов. Подтверждённое обращение получает номер и монеты; неясное отклоняется с причиной.",
    "Moderator 48 soat ichida surat va joyni tekshiradi. Tasdiqlangan xabar raqam va tanga oladi; noaniq xabar sabab bilan rad etiladi.",
  ],
  s3t: ["The region picks a path", "Область выбирает путь", "Viloyat yo‘lni tanlaydi"],
  s3d: [
    "Each verified site goes either to a government crew or opens to community volunteers.",
    "Каждое проверенное место передаётся государственной бригаде или открывается для волонтёров.",
    "Tasdiqlangan joy davlat brigadasiga beriladi yoki ko‘ngillilar uchun ochiladi.",
  ],
  s4t: ["Clean up and prove it", "Уберите и подтвердите", "Tozalang va isbotlang"],
  s4d: [
    "Join a cleanup, check in on site (GPS within 100 m) and upload before and after photos as proof.",
    "Присоединитесь к уборке, отметьтесь на месте (GPS в пределах 100 м) и загрузите фото «до» и «после».",
    "Tozalashga qo‘shiling, joyda belgilaning (GPS 100 m ichida) va «oldin» hamda «keyin» suratlarini yuklang.",
  ],
  s5t: ["Earn coins, spend them", "Получите монеты и потратьте", "Tanga yig‘ing va sarflang"],
  s5d: [
    "When proof is approved the reward pool is split between verified participants. Spend coins on rewards, climb the leaderboard and collect badges.",
    "После одобрения фото призовой фонд делится между подтверждёнными участниками. Тратьте монеты на награды, поднимайтесь в рейтинге и собирайте значки.",
    "Isbot tasdiqlangach, mukofot fondi tasdiqlangan ishtirokchilar o‘rtasida bo‘linadi. Tangani sovg‘alarga sarflang, reytingda ko‘tariling va nishonlar yig‘ing.",
  ],
  "how.paths": [
    "Once a report is verified, the region picks one of two paths.",
    "После проверки область выбирает один из двух путей.",
    "Xabar tasdiqlangach, viloyat ikki yo‘ldan birini tanlaydi.",
  ],
  "how.gov": ["Government cleanup", "Уборка силами государства", "Davlat tozalashi"],
  "how.govd": [
    "Regional crews take it on. You’re notified at each step.",
    "Бригады области берут работу на себя. Вы получаете уведомление на каждом шаге.",
    "Viloyat brigadalari o‘zi bajaradi. Har bir bosqichda sizga xabar keladi.",
  ],
  "how.com": ["Community cleanup", "Уборка волонтёрами", "Jamoaviy tozalash"],
  "how.comd": [
    "The site opens to volunteers and school groups. Proof photos decide the payout.",
    "Место открывается для волонтёров и школьных групп. Выплату определяют фото-доказательства.",
    "Joy ko‘ngillilar va maktab guruhlari uchun ochiladi. To‘lovni isbot suratlari hal qiladi.",
  ],
  "how.live": ["See a live dashboard", "Посмотреть кабинет", "Jonli kabinetni ko‘rish"],
  "stages.title": [
    "From a dump site to a clean street",
    "От свалки до чистой улицы",
    "Axlat uyumidan toza ko‘chagacha",
  ],
  "stages.lead": [
    "Every cleanup is documented in three steps: the site before, volunteers at work, and the same place afterwards. Staff compare these photos before any coins are paid.",
    "Каждая уборка фиксируется в три шага: место до, работа волонтёров и то же место после. Сотрудники сравнивают эти фото, прежде чем выплатить монеты.",
    "Har bir tozalash uch bosqichda suratga olinadi: joyning oldingi holati, ko‘ngillilar ishi va xuddi shu joyning keyingi holati. Tanga to‘lanishidan oldin xodimlar suratlarni solishtiradi.",
  ],
  "app.home": ["Home", "Главная", "Bosh sahifa"],
  "app.cleanups": ["Cleanups", "Уборки", "Tozalashlar"],
  "app.report": ["Report", "Сообщить", "Xabar"],
  "app.rewards": ["Rewards", "Награды", "Sovg‘alar"],
  "app.coins": ["Coins", "Монеты", "Tangalar"],
  "app.profile": ["Profile", "Профиль", "Profil"],
  "app.achievements": ["Achievements", "Достижения", "Yutuqlar"],
  "app.groups": ["Groups", "Группы", "Guruhlar"],
  "app.schools": ["Schools", "Школы", "Maktablar"],
  "app.explore": ["Explore", "Карта", "Xarita"],
  "app.leaderboard": ["Leaderboard", "Рейтинг", "Reyting"],
  "app.notifications": ["Notifications", "Уведомления", "Bildirishnomalar"],
  "app.balance": ["Balance", "Баланс", "Balans"],
  "auth.tag": [
    "A cleaner street starts with one report.",
    "Чистая улица начинается с одного сообщения.",
    "Toza ko‘cha bitta xabardan boshlanadi.",
  ],
  "auth.text": [
    "Join 9,310 neighbours, students and teachers turning verified reports into finished cleanups.",
    "Присоединяйтесь к 9 310 соседям, школьникам и учителям, которые превращают проверенные сообщения в чистые места.",
    "9 310 qo‘shni, o‘quvchi va o‘qituvchiga qo‘shiling — tasdiqlangan xabarlar toza joylarga aylanmoqda.",
  ],
  "auth.org": [
    "Namangan Regional Hokimiyat",
    "Хокимият Наманганской области",
    "Namangan viloyat hokimligi",
  ],
  "login.title": ["Log in", "Вход", "Kirish"],
  "login.id": ["Email or phone", "Эл. почта или телефон", "Email yoki telefon"],
  "login.pw": ["Password", "Пароль", "Parol"],
  "login.remember": ["Remember me", "Запомнить меня", "Meni eslab qol"],
  "login.forgot": ["Forgot password?", "Забыли пароль?", "Parolni unutdingizmi?"],
  "login.new": ["New here?", "Впервые здесь?", "Yangimisiz?"],
  "login.create": ["Create an account", "Создать аккаунт", "Hisob yaratish"],
  "login.errId": [
    "Enter a valid email or phone number",
    "Введите верные почту или телефон",
    "To‘g‘ri email yoki telefon kiriting",
  ],
  "login.errPw": [
    "Password must be at least 8 characters",
    "Пароль — минимум 8 символов",
    "Parol kamida 8 belgi bo‘lsin",
  ],
  "login.errBad": [
    "Email or password is incorrect.",
    "Неверная почта или пароль.",
    "Email yoki parol noto‘g‘ri.",
  ],
  "login.reset": [
    "If that account exists, a reset link is on its way.",
    "Если аккаунт существует, ссылка для сброса отправлена.",
    "Agar hisob mavjud bo‘lsa, tiklash havolasi yuborildi.",
  ],
  "ad.title": ["Admin panel", "Панель администратора", "Admin paneli"],
  "ad.logout": ["Log out", "Выйти", "Chiqish"],
  "ad.overview": ["Overview", "Обзор", "Umumiy ko‘rinish"],
  "ad.g1": ["Moderation", "Модерация", "Moderatsiya"],
  "ad.reports": ["Reports", "Жалобы", "Xabarlar"],
  "ad.cleanups": ["Cleanups", "Уборки", "Tozalashlar"],
  "ad.participants": ["Participants", "Участники", "Ishtirokchilar"],
  "ad.g2": ["People", "Люди", "Odamlar"],
  "ad.users": ["Users", "Пользователи", "Foydalanuvchilar"],
  "ad.groups": ["Groups", "Группы", "Guruhlar"],
  "ad.schools": ["Schools", "Школы", "Maktablar"],
  "ad.classes": ["Classes", "Классы", "Sinflar"],
  "ad.g3": ["Rewards & coins", "Награды и монеты", "Sovg‘a va tangalar"],
  "ad.rewards": ["Rewards", "Награды", "Sovg‘alar"],
  "ad.coins": ["Coins", "Монеты", "Tangalar"],
  "ad.leaderboard": ["Leaderboard", "Рейтинг", "Reyting"],
  "ad.g4": ["System", "Система", "Tizim"],
  "ad.notifications": ["Notifications", "Уведомления", "Bildirishnomalar"],
  "ad.settings": ["Settings", "Настройки", "Sozlamalar"],
} as const satisfies Record<string, readonly [string, string, string]>;

export type TKey = keyof typeof dict;
type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: TKey) => string;
  /** Translate an English phrase. Supports {name} placeholders: tr("{n} of {cap} joined", { n: 3, cap: 8 }). */
  tr: (phrase: string, vars?: Vars) => string;
};
type Vars = Record<string, string | number>;
const fill = (s: string, v?: Vars) =>
  v ? s.replace(/\{(\w+)\}/g, (m, k) => String(v[k] ?? m)) : s;

const I18n = createContext<Ctx>({
  lang: "uz",
  setLang: () => {},
  t: (k) => dict[k][2],
  tr: (p, v) => fill(phrases[p]?.[1] ?? p, v),
});
const STORE = "tozalash-lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, set] = useState<Lang>("uz");
  useEffect(() => {
    const saved = localStorage.getItem(STORE);
    if (saved && saved in LANGS) set(saved as Lang);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = (l: Lang) => {
    set(l);
    localStorage.setItem(STORE, l);
  };
  const t = (k: TKey) => dict[k][ORDER.indexOf(lang)];
  /** Translate a free-text English phrase from lib/phrases.ts (falls back to the English text). */
  const tr = (p: string, v?: Vars) =>
    fill(lang === "en" ? p : (phrases[p]?.[lang === "ru" ? 0 : 1] ?? p), v);
  return <I18n.Provider value={{ lang, setLang, t, tr }}>{children}</I18n.Provider>;
}

export const useI18n = () => useContext(I18n);
/** Put a React node (e.g. a coin amount) inside a translated sentence at its {key} marker. */
export const slots = (text: string, nodes: Record<string, ReactNode>): ReactNode =>
  text.split(/(\{\w+\})/g).map((part, n) => {
    const k = /^\{(\w+)\}$/.exec(part)?.[1];
    return k && k in nodes ? <span key={n}>{nodes[k]}</span> : part;
  });
export const slot = (text: string, key: string, node: ReactNode): ReactNode =>
  slots(text, { [key]: node });
