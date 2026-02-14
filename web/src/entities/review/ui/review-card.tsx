import Link from "next/link";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import { formatRelativeTime } from "@/shared/lib/format";
import { ROUTES } from "@/shared/config/routes";
import type { ReviewItem } from "../model/types";
import { FormatIcon } from "./format-icon";

type ReviewCardProps = {
  review: ReviewItem;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: (id: string) => void;
};

export function ReviewCard({ review, selectable, selected, onToggle }: ReviewCardProps) {
  const cardContent = (
    <Card className="h-full border-l-2 border-l-warning">
      <CardHeader className="flex-row items-center gap-2">
        {selectable && (
          <Checkbox
            checked={selected ?? false}
            onCheckedChange={() => onToggle?.(review.id)}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select ${review.stepName}`}
          />
        )}
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
  );

  if (selectable) {
    return (
      <div
        className="block cursor-pointer"
        onClick={() => onToggle?.(review.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle?.(review.id);
          }
        }}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={ROUTES.REVIEW_DETAIL(review.runId, review.stepId)}
      className="block"
    >
      {cardContent}
    </Link>
  );
}
