/** Demo admin credentials (frontend-only). Replace with a real backend before production. */
export const ADMIN = { email: "admin@gmail.com", password: "admin123" } as const;
const KEY = "tozalash-admin";

export const isAdmin = () => typeof window !== "undefined" && localStorage.getItem(KEY) === "1";
export const setAdmin = (on: boolean) =>
  on ? localStorage.setItem(KEY, "1") : localStorage.removeItem(KEY);
export const isAdminLogin = (id: string, pw: string) =>
  id.trim().toLowerCase() === ADMIN.email && pw === ADMIN.password;
