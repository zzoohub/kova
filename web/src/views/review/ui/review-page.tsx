"use client";

import { useState, useMemo } from "react";
import { CheckSquare } from "lucide-react";
import { PageHeader } from "@/shared/ui/page-header";
import { EmptyState } from "@/shared/ui/empty-state";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
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

      <p className="text-sm text-muted-foreground">
        {filteredReviews.length} items
      </p>

      {filteredReviews.length > 0 ? (
        <div className="space-y-3">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
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
