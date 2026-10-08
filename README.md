# Tozalash

    npm install
    npm run dev      # http://localhost:3000

Admin kirish (demo): **admin@gmail.com** / **admin123** — oddiy "Kirish" sahifasidan kiriladi.
Tillar: uz / ru / en — `lib/i18n.tsx` ichida (yangi matn qo‘shish uchun shu faylga kalit qo‘shing).

## Struktura

- `app/` — sahifalar (`(auth)` kirish/ro‘yxat, `(app)` foydalanuvchi, `admin` admin paneli)
- `components/` — umumiy komponentlar (`ui`, `toolbar`, `app-shell`, `admin-nav`, `photo`, ...)
- `lib/` — `data.ts` (demo ma’lumot), `i18n.tsx` + `phrases.ts` (tarjimalar), `auth.ts`, `shared.ts`

Buyruqlar: `npm run typecheck`, `npm run format`.
