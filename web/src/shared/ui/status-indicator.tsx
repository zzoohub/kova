"use client";

import * as React from "react";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  FileEdit,
  Clock,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

const STATUS_CONFIG: Record<
  string,
  {
    icon: React.ElementType;
    colorClass: string;
    spin?: boolean;
  }
> = {
  running: {
    icon: Loader2,
    colorClass: "text-brand-500",
    spin: true,
  },
  completed: {
    icon: CheckCircle2,
    colorClass: "text-success",
  },
  failed: {
    icon: XCircle,
    colorClass: "text-error",
  },
  draft: {
    icon: FileEdit,
    colorClass: "text-muted-foreground",
  },
  scheduled: {
    icon: Clock,
    colorClass: "text-info",
  },
  pending: {
    icon: Clock,
    colorClass: "text-warning",
  },
  approved: {
    icon: CheckCircle2,
    colorClass: "text-success",
  },
  rejected: {
    icon: XCircle,
    colorClass: "text-error",
  },
};

const SIZE_MAP = {
  sm: { icon: "size-3.5", text: "text-xs" },
  md: { icon: "size-4", text: "text-sm" },
} as const;

type StatusIndicatorProps = {
  status: string;
  size?: "sm" | "md";
};

export function StatusIndicator({
  status,
  size = "sm",
}: StatusIndicatorProps) {
  const config = STATUS_CONFIG[status];
  const sizeClasses = SIZE_MAP[size];

  if (!config) {
    return (
      <span className={cn("capitalize", sizeClasses.text)}>{status}</span>
    );
  }

  const Icon = config.icon;

  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon
        className={cn(
          sizeClasses.icon,
          config.colorClass,
          config.spin && "animate-spin"
        )}
        aria-hidden="true"
      />
      <span
        className={cn("capitalize", sizeClasses.text, config.colorClass)}
      >
        {status}
      </span>
    </span>
  );
}
