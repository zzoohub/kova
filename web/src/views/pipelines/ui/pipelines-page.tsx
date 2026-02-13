"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, GitBranch } from "lucide-react";
import { PageHeader } from "@/shared/ui/page-header";
import { EmptyState } from "@/shared/ui/empty-state";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { ROUTES } from "@/shared/config/routes";
import { mockPipelines } from "@/shared/mock/pipelines";
import { PipelineCard } from "@/entities/pipeline";

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "running", label: "Running" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
];

const SORT_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "recent", label: "Recent" },
  { value: "name", label: "Name" },
  { value: "status", label: "Status" },
];

export function PipelinesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const filteredPipelines = useMemo(() => {
    let result = mockPipelines;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    const sorted = [...result];
    switch (sortBy) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "status":
        sorted.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case "recent":
      default:
        sorted.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        break;
    }

    return sorted;
  }, [searchQuery, statusFilter, sortBy]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pipelines"
        titleKo="파이프라인"
        action={
          <Button asChild>
            <Link href={ROUTES.PIPELINE_NEW}>
              <Plus />
              New Pipeline
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search pipelines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredPipelines.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredPipelines.map((pipeline) => (
            <PipelineCard key={pipeline.id} pipeline={pipeline} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={GitBranch}
          title="No pipelines found"
          titleKo="파이프라인을 찾을 수 없습니다"
          description="Create your first pipeline to start generating content automatically."
          descriptionKo="콘텐츠를 자동으로 생성하려면 첫 번째 파이프라인을 만드세요."
          action={
            <Button asChild>
              <Link href={ROUTES.PIPELINE_NEW}>
                <Plus />
                New Pipeline
              </Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
