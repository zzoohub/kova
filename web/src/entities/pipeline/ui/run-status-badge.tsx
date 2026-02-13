import { Badge } from "@/shared/ui/badge";

type RunStatus =
  | "pending"
  | "running"
  | "waiting_for_approval"
  | "completed"
  | "failed"
  | "cancelled";

const runStatusConfig: Record<
  RunStatus,
  {
    label: string;
    className: string;
    variant: "default" | "secondary" | "destructive";
  }
> = {
  pending: {
    label: "Pending",
    className: "bg-warning text-white hover:bg-warning/90",
    variant: "default",
  },
  running: {
    label: "Running",
    className: "bg-brand-500 text-white hover:bg-brand-500/90",
    variant: "default",
  },
  waiting_for_approval: {
    label: "Awaiting Approval",
    className: "bg-warning text-white hover:bg-warning/90",
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
  cancelled: {
    label: "Cancelled",
    className: "",
    variant: "secondary",
  },
};

export function RunStatusBadge({ status }: { status: RunStatus }) {
  const config = runStatusConfig[status];

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
