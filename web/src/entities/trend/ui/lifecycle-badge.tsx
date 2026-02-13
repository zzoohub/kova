import { cn } from "@/shared/lib/utils";
import type { TrendLifecycle } from "../model/types";

const lifecycleConfig: Record<
  TrendLifecycle,
  { label: string; dotClassName: string }
> = {
  emerging: {
    label: "Emerging",
    dotClassName: "bg-success",
  },
  rising: {
    label: "Rising",
    dotClassName: "bg-info",
  },
  peak: {
    label: "Peak",
    dotClassName: "bg-warning",
  },
  declining: {
    label: "Declining",
    dotClassName: "bg-muted-foreground",
  },
};

export function LifecycleBadge({ lifecycle }: { lifecycle: TrendLifecycle }) {
  const config = lifecycleConfig[lifecycle];

  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span
        className={cn("size-1.5 shrink-0 rounded-full", config.dotClassName)}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}
