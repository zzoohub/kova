"use client";

import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { PRIMARY_NAV, SECONDARY_NAV } from "@/shared/config/navigation";
import { useSidebar } from "../store/use-sidebar";
import { SidebarNavItem } from "./sidebar-nav-item";

export function Sidebar() {
  const collapsed = useSidebar((s) => s.collapsed);
  const toggle = useSidebar((s) => s.toggle);

  return (
    <aside
      className="fixed top-[var(--topbar-height)] left-0 z-40 hidden h-[calc(100vh-var(--topbar-height))] flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-in-out md:flex"
      style={{
        width: collapsed
          ? "var(--sidebar-collapsed-width)"
          : "var(--sidebar-width)",
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo area */}
      <div className="flex h-14 shrink-0 items-center justify-center px-3">
        {collapsed ? (
          <div className="flex size-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
            K
          </div>
        ) : (
          <div className="flex w-full items-center gap-2 px-1">
            <div className="flex size-8 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
              K
            </div>
            <span className="text-lg font-semibold text-foreground">
              Kova
            </span>
          </div>
        )}
      </div>

      {/* New button */}
      <div className="px-3 pb-2">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="icon"
                className="w-full"
                aria-label="Create new pipeline"
              >
                <Plus className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8}>
              New
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button variant="default" className="w-full gap-2">
            <Plus className="size-4" />
            <span>New</span>
          </Button>
        )}
      </div>

      <Separator className="mx-3 w-auto" />

      {/* Primary navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-3">
        <div className="flex flex-col gap-1">
          {PRIMARY_NAV.map((item) => (
            <SidebarNavItem
              key={item.path}
              item={item}
              collapsed={collapsed}
            />
          ))}
        </div>

        <Separator className="my-2" />

        {/* Secondary navigation */}
        <div className="flex flex-col gap-1">
          {SECONDARY_NAV.map((item) => (
            <SidebarNavItem
              key={item.path}
              item={item}
              collapsed={collapsed}
            />
          ))}
        </div>
      </nav>

      {/* Collapse toggle */}
      <div className="shrink-0 border-t border-sidebar-border p-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={collapsed ? "icon" : "default"}
              className={collapsed ? "w-full" : "w-full justify-start gap-2"}
              onClick={toggle}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <>
                  <ChevronLeft className="size-4" />
                  <span className="text-sm text-muted-foreground">
                    Collapse
                  </span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" sideOffset={8}>
              Expand sidebar
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  );
}
