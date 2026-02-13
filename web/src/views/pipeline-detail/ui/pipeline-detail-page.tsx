"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Play,
  Timer,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  Card,
  CardContent,
} from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { SectionHeader } from "@/shared/ui/section-header";
import { PipelineStatusBadge, RunStatusBadge } from "@/entities/pipeline";
import { mockPipelines } from "@/shared/mock/pipelines";
import { mockPipelineRuns } from "@/shared/mock/pipeline-runs";
import { formatRelativeTime } from "@/shared/lib/format";
import { ROUTES } from "@/shared/config/routes";

type PipelineDetailContentProps = {
  id: string;
};

export function PipelineDetailPage({ id }: PipelineDetailContentProps) {
  const pipeline = mockPipelines.find((p) => p.id === id);

  if (!pipeline) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <p className="text-muted-foreground">Pipeline not found</p>
        <p className="text-sm text-muted-foreground" lang="ko">
          파이프라인을 찾을 수 없습니다
        </p>
        <Button variant="outline" asChild>
          <Link href={ROUTES.PIPELINES}>
            <ArrowLeft />
            Back to Pipelines
          </Link>
        </Button>
      </div>
    );
  }

  const runs = mockPipelineRuns.filter((r) => r.pipelineId === id);

  return (
    <div className="flex flex-col gap-6">
      {/* Back navigation */}
      <Link
        href={ROUTES.PIPELINES}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring w-fit"
      >
        <ArrowLeft className="size-4" />
        <span>Pipelines</span>
        <span className="sr-only"> / </span>
        <span lang="ko" className="text-xs">
          파이프라인 목록
        </span>
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-foreground">
            {pipeline.name}
          </h1>
          <PipelineStatusBadge status={pipeline.status} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.PIPELINE_DETAIL(id)}>
              <Edit />
              Edit
            </Link>
          </Button>
          <Button size="sm">
            <Play />
            Run
          </Button>
        </div>
      </div>

      {/* Info section */}
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          {/* Description */}
          <div>
            <p className="text-sm text-muted-foreground">
              {pipeline.description}
            </p>
          </div>

          <Separator />

          {/* Template and metadata */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                Template
              </span>
              <span className="text-xs text-muted-foreground" lang="ko">
                템플릿
              </span>
              <Badge variant="secondary" className="w-fit">
                {pipeline.templateName}
              </Badge>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                Schedule
              </span>
              <span className="text-xs text-muted-foreground" lang="ko">
                스케줄
              </span>
              {pipeline.schedule ? (
                <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
                  <Clock className="size-3.5 text-muted-foreground" />
                  {pipeline.schedule}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">
                  Manual only
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                Created
              </span>
              <span className="text-xs text-muted-foreground" lang="ko">
                생성일
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
                <Calendar className="size-3.5 text-muted-foreground" />
                {pipeline.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <Separator />

          {/* Steps */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Steps ({pipeline.steps.length})
            </span>
            <span className="text-xs text-muted-foreground" lang="ko">
              단계
            </span>
            <ol className="flex flex-col gap-1">
              {pipeline.steps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Run History */}
      <section aria-label="Run History" className="flex flex-col gap-4">
        <SectionHeader title="Run History" titleKo="실행 이력" />

        {runs.length > 0 ? (
          <div className="flex flex-col gap-3">
            {runs.map((run) => {
              const completedSteps = run.steps.filter(
                (s) => s.status === "completed"
              ).length;
              const totalSteps = run.steps.length;
              const durationMs = run.completedAt
                ? run.completedAt.getTime() - run.startedAt.getTime()
                : null;
              const durationSeconds = durationMs
                ? Math.round(durationMs / 1000)
                : null;

              return (
                <Link
                  key={run.id}
                  href={ROUTES.PIPELINE_RUN(id, run.id)}
                  className="block rounded-lg transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <Card className="py-4">
                    <CardContent className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <RunStatusBadge status={run.status} />
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-sm font-medium text-foreground truncate">
                            {run.id}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(run.startedAt)}
                            {run.triggerType === "scheduled"
                              ? " (scheduled)"
                              : " (manual)"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        {durationSeconds !== null ? (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Timer className="size-3" />
                            {durationSeconds}s
                          </span>
                        ) : null}
                        <span className="text-xs text-muted-foreground">
                          {completedSteps}/{totalSteps} steps
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Play className="size-8 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground text-center">
                No runs yet. Click Run to start your first execution.
              </p>
              <p
                className="text-sm text-muted-foreground text-center"
                lang="ko"
              >
                아직 실행 이력이 없습니다. Run 버튼을 눌러 첫 실행을 시작하세요.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
