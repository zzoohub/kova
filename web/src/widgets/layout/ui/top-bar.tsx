"use client";

import { Search, PanelLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { NotificationBell } from "@/features/notifications";
import { SearchTrigger } from "@/features/search";
import { ThemeToggle } from "@/features/theme-toggle";

export function TopBar() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex h-[var(--topbar-height)] items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm"
      role="banner"
    >
      {/* Left section */}
      <div className="flex items-center gap-2">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          aria-label="Open menu"
        >
          <PanelLeft className="size-5" />
        </Button>

        {/* Mobile logo */}
        <div className="flex items-center md:hidden">
          <div className="flex size-7 items-center justify-center rounded-md bg-brand-500 text-xs font-bold text-white">
            K
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1">
        {/* Search trigger (desktop) */}
        <div className="hidden md:block">
          <SearchTrigger />
        </div>

        {/* Mobile search */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          aria-label="Search"
        >
          <Search className="size-5" />
        </Button>

        <ThemeToggle />
        <NotificationBell />

        {/* User avatar */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          aria-label="User menu"
        >
          <Avatar size="sm">
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  );
}
