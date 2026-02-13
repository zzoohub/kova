"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { Badge } from "@/shared/ui/badge";
import { PageHeader } from "@/shared/ui/page-header";
import { ROUTES } from "@/shared/config/routes";
import { mockTrends } from "@/shared/mock/trends";
import { LifecycleBadge } from "@/entities/trend";

type NicheFilter = "all" | "saas" | "ai_ml" | "dev_tools" | "content_marketing";
type TimeRange = "24h" | "3d" | "1w";

const nicheOptions: { value: NicheFilter; label: string }[] = [
  { value: "all", label: "All Niches" },
  { value: "saas", label: "SaaS & Startups" },
  { value: "ai_ml", label: "AI & Machine Learning" },
  { value: "dev_tools", label: "Developer Tools" },
  { value: "content_marketing", label: "Content Marketing" },
];

const timeRangeOptions: { value: TimeRange; label: string }[] = [
  { value: "24h", label: "Last 24h" },
  { value: "3d", label: "Last 3 days" },
  { value: "1w", label: "Last week" },
];

const sourceLabels: Record<string, string> = {
  reddit: "Reddit",
  youtube: "YouTube",
  google_trends: "Google Trends",
};

function matchesNiche(niche: string, filter: NicheFilter): boolean {
  if (filter === "all") return true;
  const lower = niche.toLowerCase();
  switch (filter) {
    case "saas":
      return lower.includes("saas") || lower.includes("startup");
    case "ai_ml":
      return lower.includes("ai") || lower.includes("ml") || lower.includes("machine learning");
    case "dev_tools":
      return lower.includes("developer") || lower.includes("dev tool") || lower.includes("software");
    case "content_marketing":
      return lower.includes("content") || lower.includes("marketing") || lower.includes("creator");
    default:
      return true;
  }
}

export function TrendsPage() {
  const [nicheFilter, setNicheFilter] = useState<NicheFilter>("all");
  const [timeRange, setTimeRange] = useState<TimeRange>("1w");

  const trends = mockTrends;

  const filteredTrends = useMemo(() => {
    let result = [...trends];

    if (nicheFilter !== "all") {
      result = result.filter((t) => matchesNiche(t.niche, nicheFilter));
    }

    // Sort by score descending
    result.sort((a, b) => b.score - a.score);

    return result;
  }, [trends, nicheFilter]);

  return (
    <div className="flex flex-col">
      <PageHeader title="Trend Explorer" titleKo="트렌드 탐색기" />

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3 mb-6">
        <Select
          value={nicheFilter}
          onValueChange={(v) => setNicheFilter(v as NicheFilter)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select niche" />
          </SelectTrigger>
          <SelectContent>
            {nicheOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={timeRange}
          onValueChange={(v) => setTimeRange(v as TimeRange)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            {timeRangeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Trending topics list */}
      {filteredTrends.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredTrends.map((topic, index) => (
            <Card key={topic.id} className="py-3">
              <CardContent className="flex items-center gap-4">
                {/* Rank */}
                <span className="text-xl font-bold text-muted-foreground w-8 shrink-0 text-center">
                  {index + 1}
                </span>

                {/* Topic info */}
                <div className="flex flex-1 flex-col gap-2 min-w-0 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center gap-2 min-w-0 sm:w-[200px] shrink-0">
                    <span className="text-sm font-medium truncate">
                      {topic.name}
                    </span>
                    <LifecycleBadge lifecycle={topic.lifecycle} />
                  </div>

                  {/* Source badge */}
                  <Badge variant="outline" className="w-fit text-xs">
                    {sourceLabels[topic.source] ?? topic.source}
                  </Badge>

                  {/* Score bar */}
                  <div className="flex flex-1 items-center gap-2 min-w-[100px]">
                    <Progress value={topic.score} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground w-8 shrink-0 text-right">
                      {topic.score}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button size="xs" asChild>
                      <Link href={ROUTES.PIPELINE_NEW}>Create Content</Link>
                    </Button>
                    <Button variant="outline" size="xs">
                      <Bookmark className="size-3" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search
            className="mb-4 size-12 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="text-base font-semibold text-foreground">
            No trending topics found for this niche
          </p>
          <p className="text-sm text-muted-foreground" lang="ko">
            이 틈새 시장에 대한 트렌드 주제를 찾을 수 없습니다
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting the niche or time range filters.
          </p>
        </div>
      )}

      {/* Lifecycle Legend */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-sm">Lifecycle Stages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-2">
              <span
                className="mt-1.5 size-2 shrink-0 rounded-full bg-success"
                aria-hidden="true"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Emerging</span>
                <span className="text-xs text-muted-foreground">
                  Early signal, 1-2 platforms
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span
                className="mt-1.5 size-2 shrink-0 rounded-full bg-info"
                aria-hidden="true"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Rising</span>
                <span className="text-xs text-muted-foreground">
                  Growing on 3+ platforms
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span
                className="mt-1.5 size-2 shrink-0 rounded-full bg-warning"
                aria-hidden="true"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Peak</span>
                <span className="text-xs text-muted-foreground">
                  High engagement, growth flattening
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span
                className="mt-1.5 size-2 shrink-0 rounded-full bg-muted-foreground"
                aria-hidden="true"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Declining</span>
                <span className="text-xs text-muted-foreground">
                  Engagement decreasing
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
