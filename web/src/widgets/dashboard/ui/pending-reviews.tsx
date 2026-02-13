import { CheckCircle2 } from "lucide-react";
import { SectionHeader } from "@/shared/ui/section-header";
import { mockReviews } from "@/shared/mock/reviews";
import { ReviewCard } from "@/entities/review";
import { ROUTES } from "@/shared/config/routes";

export function PendingReviews() {
  const pendingReviews = mockReviews.filter(
    (review) => review.status === "pending"
  );

  return (
    <section aria-label="Pending reviews" className="flex flex-col gap-4">
      <SectionHeader
        title="Pending Reviews"
        titleKo="대기 중인 리뷰"
        href={ROUTES.REVIEW}
        count={pendingReviews.length}
      />

      {pendingReviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {pendingReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
          <CheckCircle2
            className="mb-3 size-8 text-emerald-500"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-foreground">All caught up</p>
          <p className="text-sm text-muted-foreground" lang="ko">
            모두 완료되었습니다
          </p>
        </div>
      )}
    </section>
  );
}
