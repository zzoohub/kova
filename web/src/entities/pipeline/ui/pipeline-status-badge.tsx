import { Badge } from "@/shared/ui/badge";
import type { PipelineStatus } from "../model/types";

const statusConfig: Record<
  PipelineStatus,
  { label: string; className: string; variant: "default" | "secondary" | "destructive" }
> = {
  running: {
    label: "Running",
    className: "bg-brand-500 text-white hover:bg-brand-500/90",
    variant: "default",
  },
  completed: {
    label: "Completed",
    className: "bg-success text-white hover:bg-success/90",
    variant: "default",
  },
  failed: {
    label: "Failed",
    className: "bg-error text-white hover:bg-error/90",
    variant: "destructive",
  },
  draft: {
    label: "Draft",
    className: "",
    variant: "secondary",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-info text-white hover:bg-info/90",
    variant: "default",
  },
};

export function PipelineStatusBadge({ status }: { status: PipelineStatus }) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
