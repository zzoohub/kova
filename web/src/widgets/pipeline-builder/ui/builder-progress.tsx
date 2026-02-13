"use client";

import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useBuilderForm } from "../store/use-builder-form";

const STEPS = [
  { label: "Basics", labelKo: "기본" },
  { label: "Steps", labelKo: "단계" },
  { label: "Settings", labelKo: "설정" },
  { label: "Review", labelKo: "검토" },
];

export function BuilderProgress() {
  const currentStep = useBuilderForm((s) => s.currentStep);

  return (
    <nav aria-label="Pipeline builder progress" className="w-full">
      <ol className="flex items-center justify-between gap-2">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isFuture = index > currentStep;

          return (
            <li
              key={step.label}
              className="flex flex-1 items-center gap-0"
            >
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                    isCompleted &&
                      "bg-primary text-primary-foreground",
                    isCurrent &&
                      "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    isFuture &&
                      "bg-muted text-muted-foreground"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="size-4" aria-hidden="true" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="text-center">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      isCurrent
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </div>

              {index < STEPS.length - 1 ? (
                <div
                  className={cn(
                    "mx-2 h-px flex-1",
                    index < currentStep
                      ? "bg-primary"
                      : "bg-border"
                  )}
                  aria-hidden="true"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
