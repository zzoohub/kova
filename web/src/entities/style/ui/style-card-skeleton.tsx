import {
  Card,
  CardHeader,
  CardAction,
  CardContent,
  CardFooter,
} from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";

export function StyleCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-5 w-36" />
        <CardAction>
          <Skeleton className="h-5 w-16 rounded-full" />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
        <Skeleton className="h-3 w-20" />
      </CardContent>

      <CardFooter className="gap-2">
        <Skeleton className="h-8 w-16 rounded-md" />
        <Skeleton className="h-8 w-14 rounded-md" />
      </CardFooter>
    </Card>
  );
}
