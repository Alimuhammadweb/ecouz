"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import { AdminSidebar, AdminTabs } from "@/components/admin-nav";
import { Toolbar } from "@/components/toolbar";
import { isAdmin, setAdmin } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

/** Admin area: guarded by the admin login, with its own sidebar. Not linked from the public navbar. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { t } = useI18n();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isAdmin()) setReady(true);
    else router.replace("/login");
  }, [router]);

  if (!ready) return <div className="min-h-dvh" aria-busy />;

  return (
    <div className="min-h-dvh bg-raised/40 lg:grid lg:grid-cols-[240px_1fr]">
      <AdminSidebar />
      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line/10 bg-surface px-4 text-sm md:px-6">
          <span className="flex items-center gap-2 font-medium">
            <ShieldCheck size={16} className="text-water" />
            {t("ad.title")}
          </span>
          <div className="flex items-center gap-1">
            <Toolbar />
            <button
              onClick={() => {
                setAdmin(false);
                router.push("/login");
              }}
              className="flex h-10 items-center gap-2 rounded-md px-3 text-muted hover:bg-raised hover:text-fg"
            >
              <LogOut size={16} />
              {t("ad.logout")}
            </button>
          </div>
        </header>
        <AdminTabs />
        {children}
      </div>
    </div>
  );
}
