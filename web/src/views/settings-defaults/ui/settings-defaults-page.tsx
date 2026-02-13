"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent } from "@/shared/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

/* ------------------------------------------------------------------
 * Toggle Switch
 * ----------------------------------------------------------------*/

type ToggleSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  label: string;
  labelKo: string;
};

function ToggleSwitch({
  checked,
  onCheckedChange,
  id,
  label,
  labelKo,
}: ToggleSwitchProps) {
  const generatedId = React.useId();
  const switchId = id ?? generatedId;
  return (
    <label
      htmlFor={switchId}
      className="flex cursor-pointer items-center justify-between gap-3 py-2"
    >
      <span className="text-sm text-foreground">
        {label}
        <span className="ml-1 text-xs text-muted-foreground" lang="ko">
          / {labelKo}
        </span>
      </span>
      <button
        id={switchId}
        role="switch"
        type="button"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          checked ? "bg-primary" : "bg-input"
        )}
      >
        <span
          className={cn(
            "pointer-events-none block size-4 rounded-full bg-background shadow-sm transition-transform",
            checked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </label>
  );
}

/* ------------------------------------------------------------------
 * Radio Option
 * ----------------------------------------------------------------*/

type RadioOptionProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  labelKo: string;
  description: string;
};

function RadioOption({
  name,
  value,
  checked,
  onChange,
  label,
  labelKo,
  description,
}: RadioOptionProps) {
  const id = React.useId();
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 py-1">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="mt-1 size-4 shrink-0 accent-primary"
      />
      <div className="min-w-0">
        <span className="text-sm font-medium text-foreground">
          {label}
          <span className="ml-1 text-xs text-muted-foreground" lang="ko">
            / {labelKo}
          </span>
        </span>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </label>
  );
}

/* ------------------------------------------------------------------
 * Checkbox Option
 * ----------------------------------------------------------------*/

type CheckboxOptionProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
};

function CheckboxOption({
  checked,
  onCheckedChange,
  label,
}: CheckboxOptionProps) {
  const id = React.useId();
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2 py-1">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="size-4 shrink-0 rounded accent-primary"
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}

/* ------------------------------------------------------------------
 * Defaults Content
 * ----------------------------------------------------------------*/

const BRAND_OPTIONS = [
  { value: "none", label: "None" },
  { value: "brn_01", label: "Sarah Creates" },
  { value: "brn_02", label: "Agency Client A" },
  { value: "brn_03", label: "Side Project Gaming" },
];

const STYLE_PROFILES = [
  { value: "none", label: "None" },
  { value: "sarah-tech", label: "Sarah's Tech Voice" },
  { value: "viral-thread", label: "Viral Thread Voice" },
  { value: "newsletter-formal", label: "Newsletter Formal" },
];

const APPROVAL_MODES = [
  {
    value: "autopilot",
    label: "Full autopilot",
    labelKo: "완전 자동",
    description:
      "Content is published automatically without review. Best for high-volume, low-risk content.",
  },
  {
    value: "review-before-publish",
    label: "Review before publish",
    labelKo: "게시 전 검토",
    description:
      "Pipeline pauses before publishing so you can review and approve. Recommended for most creators.",
  },
  {
    value: "per-platform",
    label: "Per-platform approval",
    labelKo: "플랫폼별 승인",
    description:
      "Review and approve content for each platform individually. Maximum control over each output.",
  },
];

const OUTPUT_FORMATS = [
  { key: "thread", label: "Thread" },
  { key: "linkedin", label: "LinkedIn Post" },
  { key: "newsletter", label: "Newsletter" },
  { key: "video-script", label: "Video Script" },
  { key: "carousel", label: "Carousel" },
  { key: "short-video", label: "Short Video" },
];

const DEFAULT_FORMATS = new Set(["thread", "linkedin"]);

const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "America/New_York (EST)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (PST)" },
  { value: "Europe/London", label: "Europe/London (GMT)" },
  { value: "Asia/Seoul", label: "Asia/Seoul (KST)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (JST)" },
];

export function SettingsDefaultsPage() {
  const [defaultBrand, setDefaultBrand] = React.useState("none");
  const [styleProfile, setStyleProfile] = React.useState("none");
  const [approvalMode, setApprovalMode] = React.useState(
    "review-before-publish"
  );
  const [selectedFormats, setSelectedFormats] =
    React.useState<Set<string>>(DEFAULT_FORMATS);
  const [timezone, setTimezone] = React.useState("UTC");
  const [pipelineComplete, setPipelineComplete] = React.useState(true);
  const [reviewNeeded, setReviewNeeded] = React.useState(true);
  const [dailyDigest, setDailyDigest] = React.useState(false);

  function toggleFormat(key: string) {
    setSelectedFormats((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-sm font-semibold text-foreground">
          Defaults
          <span className="ml-1 text-xs text-muted-foreground" lang="ko">
            / 기본 설정
          </span>
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Configure default settings for new pipeline runs.
        </p>
      </div>

      {/* Default Brand */}
      <Card className="py-4">
        <CardContent className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">
            Default Brand
            <span className="ml-1 text-xs text-muted-foreground" lang="ko">
              / 기본 브랜드
            </span>
          </span>
          <Select value={defaultBrand} onValueChange={setDefaultBrand}>
            <SelectTrigger className="w-full sm:max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BRAND_OPTIONS.map((brand) => (
                <SelectItem key={brand.value} value={brand.value}>
                  {brand.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Default Style Profile */}
      <Card className="py-4">
        <CardContent className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">
            Default Style Profile
            <span className="ml-1 text-xs text-muted-foreground" lang="ko">
              / 기본 스타일 프로필
            </span>
          </span>
          <Select value={styleProfile} onValueChange={setStyleProfile}>
            <SelectTrigger className="w-full sm:max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STYLE_PROFILES.map((profile) => (
                <SelectItem key={profile.value} value={profile.value}>
                  {profile.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Default Approval Mode */}
      <Card className="py-4">
        <CardContent className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">
            Default Approval Mode
            <span className="ml-1 text-xs text-muted-foreground" lang="ko">
              / 기본 승인 모드
            </span>
          </span>
          <div
            className="flex flex-col gap-2"
            role="radiogroup"
            aria-label="Approval mode"
          >
            {APPROVAL_MODES.map((mode) => (
              <RadioOption
                key={mode.value}
                name="approval-mode"
                value={mode.value}
                checked={approvalMode === mode.value}
                onChange={setApprovalMode}
                label={mode.label}
                labelKo={mode.labelKo}
                description={mode.description}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Default Output Formats */}
      <Card className="py-4">
        <CardContent className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">
            Default Output Formats
            <span className="ml-1 text-xs text-muted-foreground" lang="ko">
              / 기본 출력 형식
            </span>
          </span>
          <div className="flex flex-col gap-1">
            {OUTPUT_FORMATS.map((format) => (
              <CheckboxOption
                key={format.key}
                checked={selectedFormats.has(format.key)}
                onCheckedChange={() => toggleFormat(format.key)}
                label={format.label}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timezone */}
      <Card className="py-4">
        <CardContent className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">
            Timezone
            <span className="ml-1 text-xs text-muted-foreground" lang="ko">
              / 시간대
            </span>
          </span>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="w-full sm:max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="py-4">
        <CardContent className="flex flex-col gap-1">
          <span className="mb-1 text-sm font-medium text-foreground">
            Notification Preferences
            <span className="ml-1 text-xs text-muted-foreground" lang="ko">
              / 알림 설정
            </span>
          </span>
          <ToggleSwitch
            checked={pipelineComplete}
            onCheckedChange={setPipelineComplete}
            label="Pipeline complete"
            labelKo="파이프라인 완료"
          />
          <ToggleSwitch
            checked={reviewNeeded}
            onCheckedChange={setReviewNeeded}
            label="Review needed"
            labelKo="검토 필요"
          />
          <ToggleSwitch
            checked={dailyDigest}
            onCheckedChange={setDailyDigest}
            label="Daily digest"
            labelKo="일일 요약"
          />
        </CardContent>
      </Card>
    </div>
  );
}
