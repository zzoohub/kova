"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { ROUTES } from "@/shared/config/routes";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Badge } from "@/shared/ui/badge";
import { mockReviewDetail } from "@/shared/mock/review-detail";

type ReviewDetailContentProps = {
  runId: string;
  stepId: string;
};

export function ReviewDetailPage(props: ReviewDetailContentProps) {
  // props.runId and props.stepId will be used for data fetching once connected
  void props;
  const detail = mockReviewDetail;

  const [expandedPreviousStep, setExpandedPreviousStep] = useState(false);
  const [editedPosts, setEditedPosts] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      for (const post of detail.generatedContent.thread) {
        initial[post.id] = post.text;
      }
      return initial;
    }
  );

  const previousStepPreview = detail.previousStepOutput.slice(0, 200);
  const hasPreviousStepOverflow = detail.previousStepOutput.length > 200;

  function handlePostChange(postId: string, value: string) {
    setEditedPosts((prev) => ({ ...prev, [postId]: value }));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <Link
        href={ROUTES.REVIEW}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring w-fit"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Review Queue
      </Link>

      {/* Header */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-foreground">
            {detail.pipelineName}
          </h1>
          <Badge variant="secondary">{detail.status}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{detail.stepName}</p>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Context Panel */}
        <div className="lg:w-[35%]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Context</CardTitle>
              <p className="text-sm text-muted-foreground" lang="ko">
                컨텍스트
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Source */}
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-muted-foreground">
                  Source
                </span>
                <Badge variant="outline" className="w-fit">
                  {detail.source.type}
                </Badge>
                <p className="text-sm line-clamp-3">{detail.source.content}</p>
              </div>

              {/* Style Profile */}
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-muted-foreground">
                  Style Profile
                </span>
                <div className="flex flex-col gap-2">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Name:{" "}
                    </span>
                    <span className="text-sm">{detail.styleProfile.name}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Tone:{" "}
                    </span>
                    <span className="text-sm">{detail.styleProfile.tone}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Hook pattern:{" "}
                    </span>
                    <span className="text-sm">
                      {detail.styleProfile.hookPattern}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Rhythm:{" "}
                    </span>
                    <span className="text-sm">
                      {detail.styleProfile.rhythm}
                    </span>
                  </div>
                </div>
              </div>

              {/* Previous Step Output */}
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-muted-foreground">
                  Previous Step Output
                </span>
                <p className="text-sm whitespace-pre-line">
                  {expandedPreviousStep
                    ? detail.previousStepOutput
                    : previousStepPreview}
                  {!expandedPreviousStep && hasPreviousStepOverflow && "..."}
                </p>
                {hasPreviousStepOverflow && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit"
                    onClick={() =>
                      setExpandedPreviousStep((prev) => !prev)
                    }
                  >
                    {expandedPreviousStep ? (
                      <>
                        <ChevronUp />
                        Collapse
                      </>
                    ) : (
                      <>
                        <ChevronDown />
                        Expand
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Panel */}
        <div className="flex-1 lg:w-[65%]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Generated Thread
              </h2>
              <p className="text-sm text-muted-foreground" lang="ko">
                생성된 스레드
              </p>
            </div>
            <span className="text-sm text-muted-foreground">
              {detail.generatedContent.thread.length} posts
            </span>
          </div>

          <div className="space-y-3">
            {detail.generatedContent.thread.map((post, index) => {
              const currentText = editedPosts[post.id] ?? post.text;
              const charCount = currentText.length;
              const isOverLimit = charCount > 280;

              return (
                <Card key={post.id} className="py-4">
                  <CardContent className="flex flex-col gap-2">
                    <span className="text-xs text-muted-foreground">
                      Post {index + 1}
                    </span>
                    <Textarea
                      value={currentText}
                      onChange={(e) =>
                        handlePostChange(post.id, e.target.value)
                      }
                      className="min-h-24 resize-none"
                    />
                    <span
                      className={`text-xs self-end ${
                        isOverLimit
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      {charCount} / 280
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="sticky bottom-0 z-10 -mx-6 border-t bg-background px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
            <span>Reject with Feedback</span>
            <span className="sr-only" lang="ko">피드백과 함께 거절</span>
          </Button>
          <Button variant="ghost">
            <span>Skip</span>
            <span className="sr-only" lang="ko">건너뛰기</span>
          </Button>
          <Button variant="default">
            <span>Approve & Continue</span>
            <span className="sr-only" lang="ko">승인 후 계속</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
