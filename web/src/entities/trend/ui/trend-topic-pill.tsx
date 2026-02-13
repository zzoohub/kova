import type { TrendTopic } from "../model/types";
import { LifecycleBadge } from "./lifecycle-badge";

export function TrendTopicPill({ topic }: { topic: TrendTopic }) {
  return (
    <div className="flex items-center gap-2 rounded-full border bg-secondary px-3 py-1.5 transition-colors hover:bg-accent">
      <span className="text-sm font-medium">{topic.name}</span>
      <LifecycleBadge lifecycle={topic.lifecycle} />
    </div>
  );
}
