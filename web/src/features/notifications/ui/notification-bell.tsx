"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  mockNotifications,
  type MockNotification,
} from "@/shared/mock/notifications";
import { formatRelativeTime } from "@/shared/lib/format";

function NotificationBell() {
  const [notifications, setNotifications] =
    useState<MockNotification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayedNotifications = notifications.slice(0, 5);

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleMarkRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={
            unreadCount > 0
              ? `Notifications, ${unreadCount} unread`
              : "Notifications"
          }
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span
              className="bg-destructive absolute top-0 right-0 size-2 rounded-full"
              aria-hidden="true"
            />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 && (
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground cursor-pointer text-xs transition-colors"
              onClick={handleMarkAllRead}
            >
              Mark all read
            </button>
          )}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <div className="max-h-[280px] overflow-y-auto">
            {displayedNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                asChild
                className="flex cursor-pointer flex-col items-start gap-1 px-3 py-2.5"
              >
                <Link
                  href={notification.linkPath}
                  onClick={() => handleMarkRead(notification.id)}
                >
                  <div className="flex w-full items-start gap-2">
                    {!notification.read && (
                      <span
                        className="bg-primary mt-1.5 size-1.5 shrink-0 rounded-full"
                        aria-label="Unread"
                      />
                    )}
                    <div
                      className={`flex flex-1 flex-col gap-0.5 ${notification.read ? "pl-3.5" : ""}`}
                    >
                      <span className="text-sm leading-snug">
                        {notification.message}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {formatRelativeTime(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="justify-center">
          <Link
            href="/notifications"
            className="text-muted-foreground hover:text-foreground w-full text-center text-xs"
          >
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { NotificationBell };
