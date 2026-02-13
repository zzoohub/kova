"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/shared/ui/button";

const THEME_CYCLE = ["light", "dark", "system"] as const;

const THEME_META: Record<
  (typeof THEME_CYCLE)[number],
  { icon: typeof Sun; label: string }
> = {
  light: { icon: Sun, label: "Switch to dark mode" },
  dark: { icon: Moon, label: "Switch to system theme" },
  system: { icon: Monitor, label: "Switch to light mode" },
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const current = (theme ?? "system") as (typeof THEME_CYCLE)[number];
  const meta = THEME_META[current] ?? THEME_META.system;
  const Icon = meta.icon;

  const cycleTheme = () => {
    const currentIndex = THEME_CYCLE.indexOf(current);
    const nextIndex = (currentIndex + 1) % THEME_CYCLE.length;
    const next = THEME_CYCLE[nextIndex];
    if (next) setTheme(next);
  };

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={cycleTheme}
      aria-label={meta.label}
    >
      <Icon className="size-4" />
    </Button>
  );
}
