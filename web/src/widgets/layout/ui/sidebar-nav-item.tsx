"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import type { NavItem } from "@/shared/config/navigation";

type SidebarNavItemProps = {
  item: NavItem;
  collapsed: boolean;
};

export function SidebarNavItem({ item, collapsed }: SidebarNavItemProps) {
  const pathname = usePathname();
  const Icon = item.icon;

  const isActive =
    pathname === item.path ||
    (item.path !== "/" && pathname.startsWith(item.path));

  const linkContent = (
    <Link
      href={item.path}
      className={cn(
        "group relative flex items-center rounded-md transition-colors duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        collapsed ? "justify-center p-2" : "gap-3 px-3 py-2",
        isActive
          ? "bg-accent text-accent-foreground font-medium"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && (
        <span
          className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-primary"
          aria-hidden="true"
        />
      )}
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      {!collapsed && (
        <span className="truncate text-sm">{item.label}</span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return linkContent;
}
