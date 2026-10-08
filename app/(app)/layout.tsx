import { AppShell } from "@/components/app-shell";
import { StoreProvider } from "@/components/store";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AppShell>{children}</AppShell>
    </StoreProvider>
  );
}
