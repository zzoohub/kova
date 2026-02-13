"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Link2, Brain, SlidersHorizontal } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { PageHeader } from "@/shared/ui/page-header";
import { ROUTES } from "@/shared/config/routes";
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";

const NAV_ITEMS = [
  {
    label: "Platforms",
    labelKo: "플랫폼",
    href: ROUTES.SETTINGS_PLATFORMS,
    icon: Link2,
  },
  {
    label: "AI Models",
    labelKo: "AI 모델",
    href: ROUTES.SETTINGS_MODELS,
    icon: Brain,
  },
  {
    label: "Defaults",
    labelKo: "기본 설정",
    href: ROUTES.SETTINGS_DEFAULTS,
    icon: SlidersHorizontal,
  },
] as const;

type SettingsLayoutProps = {
  children: React.ReactNode;
};

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Settings" titleKo="설정" />

      {/* Mobile: horizontal scrollable tabs */}
      <div className="md:hidden">
        <ScrollArea className="w-full">
          <nav
            className="flex gap-1 pb-2"
            role="navigation"
            aria-label="Settings navigation"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    "hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Desktop: two-column layout */}
      <div className="flex gap-8">
        {/* Sub-navigation */}
        <nav
          className="hidden w-48 shrink-0 md:block"
          role="navigation"
          aria-label="Settings navigation"
        >
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      "hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content area */}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
