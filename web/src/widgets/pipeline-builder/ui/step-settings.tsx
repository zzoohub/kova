"use client";

import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { cn } from "@/shared/lib/utils";
import { mockBrands } from "@/shared/mock/brands";
import { useBuilderForm } from "../store/use-builder-form";
import type { ApprovalMode, TriggerType } from "../store/use-builder-form";

const STYLE_PROFILES = [
  { value: "none", label: "None" },
  { value: "sp_01", label: "Sarah's Tech Voice" },
  { value: "sp_02", label: "Viral Thread Voice" },
  { value: "sp_03", label: "Newsletter Formal" },
];

const SCHEDULE_FREQUENCIES = [
  { value: "daily", label: "Daily" },
  { value: "weekdays", label: "Weekdays" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom" },
];

const TRIGGER_OPTIONS: Array<{
  value: TriggerType;
  label: string;
  description: string;
}> = [
  {
    value: "once",
    label: "Run once",
    description: "Run this pipeline manually when you want.",
  },
  {
    value: "schedule",
    label: "Schedule",
    description: "Run this pipeline automatically on a recurring schedule.",
  },
];

const APPROVAL_OPTIONS: Array<{
  value: ApprovalMode;
  label: string;
  description: string;
}> = [
  {
    value: "autopilot",
    label: "Full autopilot",
    description:
      "Content is published automatically without review.",
  },
  {
    value: "review_before_publish",
    label: "Review before publish",
    description:
      "Pipeline pauses before publishing so you can review all content.",
  },
  {
    value: "per_platform",
    label: "Per-platform approval",
    description:
      "Approve or reject content individually for each platform.",
  },
];

const BRAND_OPTIONS = [
  { value: "none", label: "None" },
  ...mockBrands.map((b) => ({ value: b.id, label: b.name })),
];

export function StepSettings() {
  const brandId = useBuilderForm((s) => s.brandId);
  const setBrandId = useBuilderForm((s) => s.setBrandId);
  const styleProfileId = useBuilderForm((s) => s.styleProfileId);
  const trigger = useBuilderForm((s) => s.trigger);
  const scheduleFrequency = useBuilderForm((s) => s.scheduleFrequency);
  const scheduleTime = useBuilderForm((s) => s.scheduleTime);
  const approvalMode = useBuilderForm((s) => s.approvalMode);
  const setStyleProfileId = useBuilderForm((s) => s.setStyleProfileId);
  const setTrigger = useBuilderForm((s) => s.setTrigger);
  const setScheduleFrequency = useBuilderForm((s) => s.setScheduleFrequency);
  const setScheduleTime = useBuilderForm((s) => s.setScheduleTime);
  const setApprovalMode = useBuilderForm((s) => s.setApprovalMode);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          Brand
        </label>
        <p className="text-xs text-muted-foreground">
          Select which brand identity to use for this pipeline
        </p>
        <Select
          value={brandId || "none"}
          onValueChange={(v) => setBrandId(v === "none" ? "" : v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a brand" />
          </SelectTrigger>
          <SelectContent>
            {BRAND_OPTIONS.map((brand) => (
              <SelectItem key={brand.value} value={brand.value}>
                {brand.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          Style profile
        </label>
        <p className="text-xs text-muted-foreground">
          Apply a style profile to maintain a consistent voice
        </p>
        <Select
          value={styleProfileId || "none"}
          onValueChange={(v) =>
            setStyleProfileId(v === "none" ? "" : v)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a style profile" />
          </SelectTrigger>
          <SelectContent>
            {STYLE_PROFILES.map((profile) => (
              <SelectItem key={profile.value} value={profile.value}>
                {profile.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-foreground">
          Trigger
        </legend>
        <p className="text-xs text-muted-foreground">
          How should this pipeline be started?
        </p>
        <div className="flex flex-col gap-2">
          {TRIGGER_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50",
                trigger === option.value
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : "border-border"
              )}
            >
              <input
                type="radio"
                name="trigger"
                value={option.value}
                checked={trigger === option.value}
                onChange={() => setTrigger(option.value)}
                className="mt-0.5 size-4 accent-primary"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      {trigger === "schedule" ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Frequency
              </label>
              <Select
                value={scheduleFrequency}
                onValueChange={setScheduleFrequency}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCHEDULE_FREQUENCIES.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Time
              </label>
              <Input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </div>
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-medium text-foreground">
              Approval mode
            </legend>
            <p className="text-xs text-muted-foreground">
              How should content be reviewed before publishing?
            </p>
            <div className="flex flex-col gap-2">
              {APPROVAL_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50",
                    approvalMode === option.value
                      ? "border-primary bg-primary/5 ring-2 ring-primary"
                      : "border-border"
                  )}
                >
                  <input
                    type="radio"
                    name="approval-mode"
                    value={option.value}
                    checked={approvalMode === option.value}
                    onChange={() => setApprovalMode(option.value)}
                    className="mt-0.5 size-4 accent-primary"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">
                      {option.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      ) : null}
    </div>
  );
}
