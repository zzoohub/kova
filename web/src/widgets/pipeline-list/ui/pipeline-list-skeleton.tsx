import { PipelineCardSkeleton } from "@/entities/pipeline";

export function PipelineListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <PipelineCardSkeleton key={i} />
      ))}
    </div>
  );
}
