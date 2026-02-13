"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Library, Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { PageHeader } from "@/shared/ui/page-header";
import { EmptyState } from "@/shared/ui/empty-state";
import { ROUTES } from "@/shared/config/routes";
import { mockContent } from "@/shared/mock/content";
import { ContentCard } from "@/widgets/content-library/ui/content-card";

type FormatFilter = "all" | "thread" | "post" | "newsletter" | "video_script" | "carousel";
type PlatformFilter = "all" | "x" | "linkedin" | "youtube" | "instagram" | "newsletter";
type StatusFilter = "all" | "published" | "draft" | "scheduled";

function matchesFormat(format: string, filter: FormatFilter): boolean {
  if (filter === "all") return true;
  const lower = format.toLowerCase();
  switch (filter) {
    case "thread":
      return lower.includes("thread");
    case "post":
      return lower.includes("post") && !lower.includes("thread");
    case "newsletter":
      return lower.includes("newsletter");
    case "video_script":
      return lower.includes("video script") || lower.includes("video");
    case "carousel":
      return lower.includes("carousel") || lower.includes("reel");
    default:
      return true;
  }
}

export function ContentPage() {
  const [search, setSearch] = useState("");
  const [formatFilter, setFormatFilter] = useState<FormatFilter>("all");
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const content = mockContent;

  const filteredContent = useMemo(() => {
    let result = [...content];

    // Search by title
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(query));
    }

    // Format filter
    if (formatFilter !== "all") {
      result = result.filter((c) => matchesFormat(c.format, formatFilter));
    }

    // Platform filter
    if (platformFilter !== "all") {
      result = result.filter((c) => c.platform === platformFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    return result;
  }, [content, search, formatFilter, platformFilter, statusFilter]);

  // Empty state when no content at all
  if (content.length === 0) {
    return (
      <div className="flex flex-col">
        <PageHeader title="Content Library" titleKo="콘텐츠 라이브러리" />
        <EmptyState
          icon={Library}
          title="No content yet"
          titleKo="아직 콘텐츠가 없습니다"
          description="Content appears here after your pipelines generate it. Run your first pipeline to see results."
          descriptionKo="파이프라인이 콘텐츠를 생성한 후 여기에 표시됩니다. 첫 번째 파이프라인을 실행하여 결과를 확인하세요."
          action={
            <Button asChild>
              <Link href={ROUTES.PIPELINES}>Go to Pipelines</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <PageHeader title="Content Library" titleKo="콘텐츠 라이브러리" />

      {/* Filter bar */}
      <div className="mt-6 flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={formatFilter}
          onValueChange={(v) => setFormatFilter(v as FormatFilter)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Formats</SelectItem>
            <SelectItem value="thread">Thread</SelectItem>
            <SelectItem value="post">Post</SelectItem>
            <SelectItem value="newsletter">Newsletter</SelectItem>
            <SelectItem value="video_script">Video Script</SelectItem>
            <SelectItem value="carousel">Carousel</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={platformFilter}
          onValueChange={(v) => setPlatformFilter(v as PlatformFilter)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="x">X</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="newsletter">Newsletter</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content grid or empty results */}
      {filteredContent.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredContent.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search
            className="mb-4 size-12 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="text-base font-semibold text-foreground">
            No content found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}
