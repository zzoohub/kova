"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitBranch,
  Plus,
  CheckSquare,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/config/routes";
import type { LucideIcon } from "lucide-react";

type BottomTab = {
  label: string;
  icon: LucideIcon;
  path: string;
  isCenter?: boolean;
};

const BOTTOM_TABS: BottomTab[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: ROUTES.DASHBOARD },
  { label: "Pipelines", icon: GitBranch, path: ROUTES.PIPELINES },
  { label: "New", icon: Plus, path: ROUTES.PIPELINE_NEW, isCenter: true },
  { label: "Review", icon: CheckSquare, path: ROUTES.REVIEW },
  { label: "More", icon: MoreHorizontal, path: ROUTES.SETTINGS },
];

export function MobileBottomBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 flex h-[var(--bottom-bar-height)] items-center justify-around border-t border-border bg-background md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      role="navigation"
      aria-label="Mobile navigation"
    >
      {BOTTOM_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          pathname === tab.path ||
          (tab.path !== "/" && pathname.startsWith(tab.path));

        if (tab.isCenter) {
          return (
            <Link
              key={tab.label}
              href={tab.path}
              className="flex flex-col items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full"
              aria-label={tab.label}
            >
              <div className="-mt-3 flex size-11 items-center justify-center rounded-full bg-brand-500 text-white shadow-md">
                <Icon className="size-5" />
              </div>
              <span className="mt-0.5 text-[10px] font-medium text-brand-500">
                {tab.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={tab.label}
            href={tab.path}
            className={cn(
              "flex min-w-[44px] flex-col items-center justify-center gap-0.5 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="size-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
