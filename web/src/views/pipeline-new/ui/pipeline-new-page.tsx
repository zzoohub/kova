"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/shared/config/routes";
import { useBuilderForm } from "@/widgets/pipeline-builder/store/use-builder-form";
import { BuilderProgress } from "@/widgets/pipeline-builder/ui/builder-progress";
import { StepBasics } from "@/widgets/pipeline-builder/ui/step-basics";
import { StepSteps } from "@/widgets/pipeline-builder/ui/step-steps";
import { StepSettings } from "@/widgets/pipeline-builder/ui/step-settings";
import { StepReview } from "@/widgets/pipeline-builder/ui/step-review";

const STEP_COMPONENTS = [StepBasics, StepSteps, StepSettings, StepReview];
const TOTAL_STEPS = STEP_COMPONENTS.length;

export function PipelineNewPage() {
  const currentStep = useBuilderForm((s) => s.currentStep);
  const nextStep = useBuilderForm((s) => s.nextStep);
  const prevStep = useBuilderForm((s) => s.prevStep);

  const StepComponent = STEP_COMPONENTS[currentStep] ?? StepBasics;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOTAL_STEPS - 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={ROUTES.PIPELINES}>
            <ArrowLeft />
            Back
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Pipeline Builder
        </h1>
        <p className="text-sm text-muted-foreground" lang="ko">
          파이프라인 빌더
        </p>
      </div>

      <div className="mx-auto w-full max-w-md">
        <BuilderProgress />
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <StepComponent />
      </div>

      <div className="mx-auto flex w-full max-w-2xl items-center justify-between border-t border-border pt-4">
        <Button
          variant="outline"
          disabled={isFirstStep}
          onClick={prevStep}
        >
          <ArrowLeft />
          Back
        </Button>

        {isLastStep ? null : (
          <Button onClick={nextStep}>
            Continue
            <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
}
