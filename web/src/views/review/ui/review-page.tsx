"use client";

import { useState, useMemo, useCallback } from "react";
import { CheckSquare, CheckCheck, X } from "lucide-react";
import { PageHeader } from "@/shared/ui/page-header";
import { EmptyState } from "@/shared/ui/empty-state";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { mockReviews } from "@/shared/mock/reviews";
import { ReviewCard } from "@/entities/review";
import type { ReviewItem } from "@/entities/review";

type StatusFilter = "all" | "pending" | "approved" | "rejected";
type SortOrder = "oldest" | "newest";

const STATUS_TABS: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const SORT_OPTIONS: Array<{ value: SortOrder; label: string }> = [
  { value: "oldest", label: "Oldest first" },
  { value: "newest", label: "Newest first" },
];

export function ReviewPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("oldest");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredReviews = useMemo(() => {
    const reviews: ReviewItem[] = mockReviews;
    let result = reviews;

    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    const sorted = [...result];
    sorted.sort((a, b) => {
      const aTime = a.waitingSince.getTime();
      const bTime = b.waitingSince.getTime();
      return sortOrder === "oldest" ? aTime - bTime : bTime - aTime;
    });

    return sorted;
  }, [statusFilter, sortOrder]);

  const pendingReviews = useMemo(
    () => filteredReviews.filter((r) => r.status === "pending"),
    [filteredReviews]
  );

  const handleToggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  function handleSelectAllPending() {
    setSelectedIds(new Set(pendingReviews.map((r) => r.id)));
  }

  function handleExitSelectionMode() {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }

  function handleBulkApprove() {
    // Placeholder: bulk approve logic would be wired by frontend developer
    handleExitSelectionMode();
  }

  function handleBulkReject() {
    // Placeholder: bulk reject logic would be wired by frontend developer
    handleExitSelectionMode();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Review Queue" titleKo="리뷰 대기열" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as StatusFilter)}
        >
          <TabsList>
            {STATUS_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          {!selectionMode && pendingReviews.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectionMode(true)}
            >
              <CheckSquare className="size-4" />
              Select
            </Button>
          )}
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as SortOrder)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
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

      {/* Bulk action toolbar */}
      {selectionMode && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {selectedIds.size} selected
            </span>
            <span className="text-sm text-muted-foreground" lang="ko">
              {selectedIds.size}개 선택됨
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleSelectAllPending}>
            Select All Pending
            <span className="sr-only" lang="ko">대기 중인 항목 모두 선택</span>
          </Button>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={handleBulkApprove}
              disabled={selectedIds.size === 0}
            >
              <CheckCheck className="size-4" />
              Approve Selected
              <span className="sr-only" lang="ko">선택 항목 승인</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkReject}
              disabled={selectedIds.size === 0}
            >
              <X className="size-4" />
              Reject Selected
              <span className="sr-only" lang="ko">선택 항목 거절</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExitSelectionMode}
            >
              Cancel
              <span className="sr-only" lang="ko">취소</span>
            </Button>
          </div>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {filteredReviews.length} items
      </p>

      {filteredReviews.length > 0 ? (
        <div className="space-y-3">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              selectable={selectionMode}
              selected={selectedIds.has(review.id)}
              onToggle={handleToggle}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CheckSquare}
          title="No items to review"
          titleKo="리뷰할 항목이 없습니다"
          description="When your pipelines need approval, items will appear here."
          descriptionKo="파이프라인에 승인이 필요하면 여기에 항목이 표시됩니다."
        />
      )}
    </div>
  );
}
