"use client";

import { Play, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { useBuilderForm } from "../store/use-builder-form";

const TEMPLATE_NAMES: Record<string, string> = {
  "topic-to-everything": "Topic to Everything",
  "url-to-everything": "URL to Everything",
  "youtube-to-clips": "YouTube to Clips",
  "blog-to-social": "Blog to Social",
  "trend-powered-daily": "Trend-Powered Daily",
  blank: "Blank",
};

const SOURCE_TYPE_LABELS: Record<string, string> = {
  topic: "Topic / Idea",
  url: "URL",
  file: "Uploaded file",
  text: "Pasted text",
};

const BRAND_NAMES: Record<string, string> = {
  brn_01: "Sarah Creates",
  brn_02: "Agency Client A",
  brn_03: "Side Project Gaming",
};

const STYLE_PROFILE_NAMES: Record<string, string> = {
  sp_01: "Sarah's Tech Voice",
  sp_02: "Viral Thread Voice",
  sp_03: "Newsletter Formal",
};

const APPROVAL_MODE_LABELS: Record<string, string> = {
  autopilot: "Full autopilot",
  review_before_publish: "Review before publish",
  per_platform: "Per-platform approval",
};

export function StepReview() {
  const name = useBuilderForm((s) => s.name);
  const templateId = useBuilderForm((s) => s.templateId);
  const sourceType = useBuilderForm((s) => s.sourceType);
  const sourceInput = useBuilderForm((s) => s.sourceInput);
  const steps = useBuilderForm((s) => s.steps);
  const brandId = useBuilderForm((s) => s.brandId);
  const styleProfileId = useBuilderForm((s) => s.styleProfileId);
  const trigger = useBuilderForm((s) => s.trigger);
  const scheduleFrequency = useBuilderForm((s) => s.scheduleFrequency);
  const scheduleTime = useBuilderForm((s) => s.scheduleTime);
  const approvalMode = useBuilderForm((s) => s.approvalMode);

  const displayName = name.trim() || "Untitled Pipeline";
  const templateName = TEMPLATE_NAMES[templateId] ?? "None selected";
  const sourceLabel = SOURCE_TYPE_LABELS[sourceType] ?? sourceType;
  const brandLabel = brandId
    ? BRAND_NAMES[brandId] ?? brandId
    : "None";
  const styleLabel = styleProfileId
    ? STYLE_PROFILE_NAMES[styleProfileId] ?? styleProfileId
    : "None";

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pipeline Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <SummaryRow label="Name" value={displayName} />
          <SummaryRow label="Template" value={templateName} />
          <SummaryRow label="Brand" value={brandLabel} />
          <SummaryRow
            label="Source"
            value={
              sourceInput.trim()
                ? `${sourceLabel}: ${sourceInput.length > 80 ? `${sourceInput.slice(0, 80)}...` : sourceInput}`
                : sourceLabel
            }
          />

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Steps ({steps.length})
            </span>
            {steps.length > 0 ? (
              <ol className="flex flex-col gap-1">
                {steps.map((step, index) => (
                  <li
                    key={step.id}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {index + 1}
                    </span>
                    {step.name}
                  </li>
                ))}
              </ol>
            ) : (
              <span className="text-sm text-muted-foreground">
                No steps configured
              </span>
            )}
          </div>

          <SummaryRow label="Style profile" value={styleLabel} />
          <SummaryRow
            label="Trigger"
            value={
              trigger === "schedule"
                ? `Scheduled (${scheduleFrequency} at ${scheduleTime})`
                : "Run once"
            }
          />
          {trigger === "schedule" ? (
            <SummaryRow
              label="Approval mode"
              value={APPROVAL_MODE_LABELS[approvalMode] ?? approvalMode}
            />
          ) : null}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" size="lg">
          <Save />
          Save as Draft
        </Button>
        <Button size="lg">
          <Play />
          Save & Run
        </Button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}
