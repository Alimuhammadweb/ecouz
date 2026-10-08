import type { Config } from "tailwindcss";
const v = (n: string) => `rgb(var(--${n}) / <alpha-value>)`;
export default {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: v("bg"),
        surface: v("surface"),
        raised: v("raised"),
        line: v("line"),
        fg: v("fg"),
        muted: v("muted"),
        accent: v("accent"),
        "accent-fg": v("accent-fg"),
        water: v("water"),
        ok: v("ok"),
        bad: v("bad"),
      },
      fontFamily: { display: ["var(--font-display)"], sans: ["var(--font-body)"] },
      borderRadius: { sm: "8px", md: "12px", lg: "16px" },
      transitionTimingFunction: { out: "cubic-bezier(.2,.8,.2,1)" },
    },
  },
} satisfies Config;
