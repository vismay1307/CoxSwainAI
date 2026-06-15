import type { ReactNode } from "react";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({
  children,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
