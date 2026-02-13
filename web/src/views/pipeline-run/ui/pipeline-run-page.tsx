"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  GitBranch,
  Loader2,
  Pause,
  RefreshCcw,
  SkipForward,
  User,
  XCircle,
  X,
  Library,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import {
  Card,
  CardContent,
} from "@/shared/ui/card";
import { RunStatusBadge } from "@/entities/pipeline";
import { mockPipelineRuns } from "@/shared/mock/pipeline-runs";
import { ROUTES } from "@/shared/config/routes";

type PipelineRunContentProps = {
  pipelineId: string;
  runId: string;
};

const STEP_STATUS_CONFIG = {
  completed: {
    icon: CheckCircle2,
    colorClass: "text-success",
    spin: false,
  },
  running: {
    icon: Loader2,
    colorClass: "text-brand-500",
    spin: true,
  },
  waiting: {
    icon: Clock,
    colorClass: "text-muted-foreground",
    spin: false,
  },
  failed: {
    icon: XCircle,
    colorClass: "text-error",
    spin: false,
  },
  review: {
    icon: User,
    colorClass: "text-warning",
    spin: false,
  },
} as const;

const BRANCH_STATUS_CONFIG = {
  completed: {
    icon: CheckCircle2,
    colorClass: "text-success",
  },
  running: {
    icon: Loader2,
    colorClass: "text-brand-500",
    spin: true,
  },
  waiting: {
    icon: Clock,
    colorClass: "text-muted-foreground",
  },
  failed: {
    icon: XCircle,
    colorClass: "text-error",
  },
} as const;

export function PipelineRunPage({
  pipelineId,
  runId,
}: PipelineRunContentProps) {
  const run = mockPipelineRuns.find((r) => r.id === runId);

  if (!run) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <p className="text-muted-foreground">Run not found</p>
        <p className="text-sm text-muted-foreground" lang="ko">
          실행 기록을 찾을 수 없습니다
        </p>
        <Button variant="outline" asChild>
          <Link href={ROUTES.PIPELINE_DETAIL(pipelineId)}>
            <ArrowLeft />
            Back to Pipeline
          </Link>
        </Button>
      </div>
    );
  }

  const currentStepIndex =
    run.steps.findIndex(
      (s) => s.status === "running" || s.status === "review"
    ) + 1;
  const currentStep =
    currentStepIndex > 0
      ? currentStepIndex
      : run.status === "completed"
        ? run.steps.length
        : run.steps.filter((s) => s.status === "completed").length;
  const totalSteps = run.steps.length;
  const isRunning = run.status === "running";
  const isFailed = run.status === "failed";
  const isCompleted = run.status === "completed";
  const failedStep = run.steps.find((s) => s.status === "failed");

  return (
    <div className="flex flex-col gap-6">
      {/* Back navigation */}
      <Link
        href={ROUTES.PIPELINE_DETAIL(pipelineId)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring w-fit"
      >
        <ArrowLeft className="size-4" />
        <span>{run.pipelineName}</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-foreground">
              Run: {run.pipelineName}
            </h1>
            <RunStatusBadge status={run.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </p>
          <p className="text-sm text-muted-foreground" lang="ko">
            {totalSteps}단계 중 {currentStep}단계
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {isRunning ? (
            <>
              <Button variant="outline" size="sm">
                <Pause />
                Pause
              </Button>
              <Button variant="destructive" size="sm">
                <X />
                Cancel
              </Button>
            </>
          ) : null}
          {isFailed ? (
            <Button size="sm">
              <RefreshCcw />
              Retry
            </Button>
          ) : null}
        </div>
      </div>

      {/* Completed banner */}
      {isCompleted ? (
        <Card className="border-success/30 bg-success/5">
          <CardContent className="flex items-center justify-between gap-4 pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-5 text-success shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  All content generated.
                </p>
                <p className="text-sm text-muted-foreground" lang="ko">
                  모든 콘텐츠가 생성되었습니다.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.CONTENT}>
                <Library />
                Content Library
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {/* Failed banner */}
      {isFailed && failedStep ? (
        <Card className="border-error/30 bg-error/5">
          <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <XCircle className="size-5 text-error shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Failed at: {failedStep.name}
                </p>
                {failedStep.output ? (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {failedStep.output}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm">
                <SkipForward />
                Skip and continue
              </Button>
              <Button size="sm">
                <RefreshCcw />
                Retry this step
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Progress timeline */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            {run.steps.map((step, index) => {
              const isLast = index === run.steps.length - 1;
              const config = STEP_STATUS_CONFIG[step.status];
              const StepIcon = config.icon;

              return (
                <div key={step.id} className="relative flex gap-4">
                  {/* Vertical line */}
                  {!isLast ? (
                    <div
                      className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-border"
                      aria-hidden="true"
                    />
                  ) : null}

                  {/* Icon */}
                  <div className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-card">
                    <StepIcon
                      className={`size-5 ${config.colorClass} ${config.spin ? "animate-spin" : ""}`}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 pb-6 ${isLast ? "pb-0" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground">
                        {step.name}
                      </span>
                      {step.status === "completed" &&
                      step.duration !== null ? (
                        <span className="text-xs text-muted-foreground">
                          {step.duration}s
                        </span>
                      ) : null}
                    </div>

                    {/* Running: progress bar */}
                    {step.status === "running" &&
                    step.progress !== null ? (
                      <div className="mt-2 flex items-center gap-3">
                        <Progress
                          value={step.progress}
                          className="h-1.5 flex-1 max-w-xs"
                        />
                        <span className="text-xs text-muted-foreground shrink-0">
                          {step.progress}%
                        </span>
                      </div>
                    ) : null}

                    {/* Completed: output summary */}
                    {step.status === "completed" && step.output ? (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                        {step.output}
                      </p>
                    ) : null}

                    {/* Failed: output as error */}
                    {step.status === "failed" && step.output ? (
                      <p className="mt-1 text-sm text-error line-clamp-2">
                        {step.output}
                      </p>
                    ) : null}

                    {/* Branches (fan-out) */}
                    {step.branches && step.branches.length > 0 ? (
                      <div className="mt-2 flex flex-col gap-1.5 pl-2">
                        {step.branches.map((branch) => {
                          const branchConfig =
                            BRANCH_STATUS_CONFIG[branch.status];
                          const BranchIcon = branchConfig.icon;

                          return (
                            <div
                              key={branch.name}
                              className="flex items-center gap-2"
                            >
                              <GitBranch
                                className="size-3 text-muted-foreground"
                                aria-hidden="true"
                              />
                              <BranchIcon
                                className={`size-3.5 ${branchConfig.colorClass} ${"spin" in branchConfig && branchConfig.spin ? "animate-spin" : ""}`}
                                aria-hidden="true"
                              />
                              <span className="text-xs text-muted-foreground">
                                {branch.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
