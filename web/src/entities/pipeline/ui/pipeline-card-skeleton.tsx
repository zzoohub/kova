import {
  Card,
  CardHeader,
  CardAction,
  CardContent,
  CardFooter,
} from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

export function PipelineCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <CardAction>
          <Skeleton className="h-5 w-20 rounded-full" />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24 mt-1" />
      </CardContent>

      <CardFooter>
        <Skeleton className="h-3 w-28" />
      </CardFooter>
    </Card>
  );
}
