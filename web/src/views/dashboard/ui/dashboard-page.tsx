import { mockPipelines } from "@/shared/mock/pipelines";
import { mockPipelineRuns } from "@/shared/mock/pipeline-runs";
import { mockReviews } from "@/shared/mock/reviews";
import { EmptyDashboard } from "@/widgets/dashboard/ui/empty-dashboard";
import { GreetingSection } from "@/widgets/dashboard/ui/greeting-section";
import { PendingReviews } from "@/widgets/dashboard/ui/pending-reviews";
import { QuickStart } from "@/widgets/dashboard/ui/quick-start";
import { RecentRuns } from "@/widgets/dashboard/ui/recent-runs";
import { TrendingTopics } from "@/widgets/dashboard/ui/trending-topics";

export function DashboardPage() {
  const isFirstUse =
    mockPipelines.length === 0 &&
    mockPipelineRuns.length === 0 &&
    mockReviews.length === 0;

  if (isFirstUse) {
    return <EmptyDashboard />;
  }

  return (
    <div className="flex flex-col">
      {/* Greeting + stat cards */}
      <div className="mb-8">
        <GreetingSection />
      </div>

      {/* Reviews + Quick start */}
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 min-w-0">
          <PendingReviews />
        </div>
        <div className="w-full lg:w-80 shrink-0">
          <QuickStart />
        </div>
      </div>

      {/* Recent runs */}
      <div className="mt-8">
        <RecentRuns />
      </div>

      {/* Trending topics */}
      <div className="mt-8">
        <TrendingTopics />
      </div>
    </div>
  );
}
