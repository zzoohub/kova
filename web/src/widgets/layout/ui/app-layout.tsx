"use client";

import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { MobileBottomBar } from "./mobile-bottom-bar";
import { useSidebar } from "../store/use-sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const collapsed = useSidebar((s) => s.collapsed);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      <main
        className="pt-[var(--topbar-height)] pb-[var(--bottom-bar-height)] md:pb-0 transition-[margin] duration-200 ease-in-out"
        style={{
          marginLeft: "var(--sidebar-collapsed-width)",
        }}
      >
        <div
          className="hidden md:block transition-[margin] duration-200 ease-in-out"
          style={{
            marginLeft: collapsed
              ? "0px"
              : "calc(var(--sidebar-width) - var(--sidebar-collapsed-width))",
          }}
        >
          <div className="mx-auto max-w-[1200px] p-6">{children}</div>
        </div>
        <div className="md:hidden">
          <div className="p-4">{children}</div>
        </div>
      </main>
      <MobileBottomBar />
    </div>
  );
}
