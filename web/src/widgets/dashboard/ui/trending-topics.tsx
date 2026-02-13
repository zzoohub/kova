import { TrendTopicPill } from "@/entities/trend";
import { SectionHeader } from "@/shared/ui/section-header";
import { mockTrends } from "@/shared/mock/trends";
import { ROUTES } from "@/shared/config/routes";

export function TrendingTopics() {
  const topics = mockTrends.slice(0, 6);

  return (
    <section aria-label="Trending topics" className="flex flex-col gap-4">
      <SectionHeader
        title="Trending in Your Niche"
        titleKo="내 니치의 트렌드"
        href={ROUTES.TRENDS}
      />

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
        {topics.map((topic) => (
          <div key={topic.id} className="shrink-0">
            <TrendTopicPill topic={topic} />
          </div>
        ))}
      </div>
    </section>
  );
}
