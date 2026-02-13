import { Activity } from "lucide-react";
import { SectionHeader } from "@/shared/ui/section-header";
import { EmptyState } from "@/shared/ui/empty-state";
import { PipelineCard } from "@/entities/pipeline";
import { mockPipelines } from "@/shared/mock/pipelines";
import { ROUTES } from "@/shared/config/routes";

export function RecentRuns() {
  const recentPipelines = mockPipelines
    .filter((p) => p.status !== "draft")
    .slice(0, 4);

  return (
    <section aria-label="Recent pipeline runs" className="flex flex-col gap-4">
      <SectionHeader
        title="Recent Runs"
        titleKo="최근 실행"
        href={ROUTES.PIPELINES}
      />

      {recentPipelines.length > 0 ? (
        <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2 snap-x snap-mandatory scrollbar-thin">
          {recentPipelines.map((pipeline) => (
            <div
              key={pipeline.id}
              className="min-w-[280px] shrink-0 snap-start"
            >
              <PipelineCard pipeline={pipeline} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Activity}
          title="No recent runs"
          titleKo="최근 실행 없음"
          description="Run a pipeline to see results here."
          descriptionKo="파이프라인을 실행하면 여기에 결과가 표시됩니다."
        />
      )}
    </section>
  );
}
