import type { Metadata } from "next";
import "./globals.css";
import { DashboardProvider } from "@/components/dashboard-context";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "Tokoku — Admin Panel",
  description: "Dashboard toko digital modern, interaktif, dan responsif.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <DashboardProvider>
          <AppShell>{children}</AppShell>
        </DashboardProvider>
      </body>
    </html>
  );
}
