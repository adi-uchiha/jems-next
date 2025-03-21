'use client'

import { Providers } from "@/components/providers";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </Providers>
  );
}