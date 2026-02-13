"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Palette, Plus, Search } from "lucide-react";
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
import { mockStyles } from "@/shared/mock/styles";
import { StyleCard } from "@/entities/style";
import type { StyleProfile, StyleSourceType } from "@/entities/style";

type SourceFilter = "all" | StyleSourceType;
type SortOption = "recent" | "most_used" | "alphabetical";

export function StylesPage() {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [sort, setSort] = useState<SortOption>("recent");

  const styles: StyleProfile[] = mockStyles;

  const filteredStyles = useMemo(() => {
    let result = [...styles];

    // Search filter
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(query));
    }

    // Source type filter
    if (sourceFilter !== "all") {
      result = result.filter((s) => s.sourceType === sourceFilter);
    }

    // Sort
    switch (sort) {
      case "recent":
        result.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        break;
      case "most_used":
        result.sort((a, b) => b.usageCount - a.usageCount);
        break;
      case "alphabetical":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [styles, search, sourceFilter, sort]);

  // No styles at all
  if (styles.length === 0) {
    return (
      <div className="flex flex-col">
        <PageHeader
          title="Style Library"
          titleKo="스타일 라이브러리"
          action={
            <Button asChild>
              <Link href={ROUTES.STYLE_NEW}>
                <Plus />
                Create New Style
              </Link>
            </Button>
          }
        />
        <EmptyState
          icon={Palette}
          title="No style profiles yet"
          titleKo="아직 스타일 프로필이 없습니다"
          description="Style profiles capture how content sounds — the tone, rhythm, hooks, and structure. Paste a URL to content you admire, and Kova will extract the style automatically."
          descriptionKo="스타일 프로필은 콘텐츠의 톤, 리듬, 훅, 구조 등 사운드를 캡처합니다. 좋아하는 콘텐츠의 URL을 붙여넣으면 Kova가 자동으로 스타일을 추출합니다."
          action={
            <Button asChild>
              <Link href={ROUTES.STYLE_NEW}>Create Your First Style</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Style Library"
        titleKo="스타일 라이브러리"
        action={
          <Button asChild>
            <Link href={ROUTES.STYLE_NEW}>
              <Plus />
              Create New Style
            </Link>
          </Button>
        }
      />

      {/* Filter bar */}
      <div className="mt-6 flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search styles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={sourceFilter}
          onValueChange={(v) => setSourceFilter(v as SourceFilter)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Source Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="url">URL</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="image">Image</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(v) => setSort(v as SortOption)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recent</SelectItem>
            <SelectItem value="most_used">Most Used</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Card grid or empty results */}
      {filteredStyles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredStyles.map((style) => (
            <StyleCard key={style.id} style={style} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search
            className="mb-4 size-12 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="text-base font-semibold text-foreground">
            No styles found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}
