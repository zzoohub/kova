import Link from "next/link";
import { Clock } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from "@/shared/ui/card";
import { formatRelativeTime } from "@/shared/lib/format";
import { ROUTES } from "@/shared/config/routes";
import type { Pipeline } from "../model/types";
import { PipelineStatusBadge } from "./pipeline-status-badge";

export function PipelineCard({ pipeline }: { pipeline: Pipeline }) {
  return (
    <Link
      href={ROUTES.PIPELINE_DETAIL(pipeline.id)}
      className="block transition-shadow hover:shadow-md rounded-xl"
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="font-medium text-base">
            {pipeline.name}
          </CardTitle>
          <CardAction>
            <PipelineStatusBadge status={pipeline.status} />
          </CardAction>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {pipeline.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{pipeline.steps.length} steps</span>
            {pipeline.schedule ? (
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {pipeline.schedule}
              </span>
            ) : null}
          </div>
        </CardContent>

        <CardFooter>
          <span className="text-xs text-muted-foreground">
            {pipeline.lastRunAt
              ? `Last run: ${formatRelativeTime(pipeline.lastRunAt)}`
              : "Never run"}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
