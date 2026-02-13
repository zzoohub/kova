import { BrandCardSkeleton } from "@/entities/brand";

export function BrandLibrarySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <BrandCardSkeleton key={i} />
      ))}
    </div>
  );
}
