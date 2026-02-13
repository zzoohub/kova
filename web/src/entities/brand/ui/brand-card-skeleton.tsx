import {
  Card,
  CardHeader,
  CardAction,
  CardContent,
  CardFooter,
} from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

export function BrandCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-36" />
        </div>
        <CardAction>
          <Skeleton className="size-8 rounded-md" />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="size-4 rounded" />
            <Skeleton className="size-4 rounded" />
          </div>
          <Skeleton className="h-3 w-20" />
        </div>
      </CardContent>

      <CardFooter>
        <Skeleton className="h-8 w-14 rounded-md" />
      </CardFooter>
    </Card>
  );
}
