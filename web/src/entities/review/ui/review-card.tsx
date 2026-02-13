import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/shared/ui/card";
import { formatRelativeTime } from "@/shared/lib/format";
import { ROUTES } from "@/shared/config/routes";
import type { ReviewItem } from "../model/types";
import { FormatIcon } from "./format-icon";

export function ReviewCard({ review }: { review: ReviewItem }) {
  return (
    <Link
      href={ROUTES.REVIEW_DETAIL(review.runId, review.stepId)}
      className="block"
    >
      <Card className="h-full border-l-2 border-l-warning">
        <CardHeader className="flex-row items-center gap-2">
          <FormatIcon format={review.formatType} className="text-muted-foreground" />
          <span className="font-medium text-sm">{review.stepName}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            {formatRelativeTime(review.waitingSince)}
          </span>
        </CardHeader>

        <CardContent>
          <p className="text-sm line-clamp-2">{review.contentPreview}</p>
        </CardContent>

        <CardFooter>
          <span className="text-xs text-muted-foreground">
            {review.pipelineName}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
