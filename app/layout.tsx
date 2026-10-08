import "./globals.css";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { I18nProvider } from "@/lib/i18n";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const body = Geist({ subsets: ["latin"], variable: "--font-body" });
export const metadata = { title: "Tozalash — report it, clean it, get verified" };

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
