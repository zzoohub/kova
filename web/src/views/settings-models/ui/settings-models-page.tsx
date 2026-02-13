"use client";

import * as React from "react";
import { Pen, Mic, AudioLines, ImageIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent } from "@/shared/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

type CostLevel = "free" | "$" | "$$" | "$$$";

type ModelOption = {
  value: string;
  label: string;
  cost: CostLevel;
};

type ModelRow = {
  id: string;
  label: string;
  labelKo: string;
  icon: React.ElementType;
  options: ModelOption[];
  defaultValue: string;
};

const MODEL_ROWS: ModelRow[] = [
  {
    id: "writing",
    label: "Writing AI",
    labelKo: "작문 AI",
    icon: Pen,
    options: [
      { value: "claude-sonnet", label: "Claude Sonnet (Recommended)", cost: "$$" },
      { value: "gpt-4o", label: "GPT-4o", cost: "$$" },
      { value: "gemini-pro", label: "Gemini Pro", cost: "$$" },
    ],
    defaultValue: "claude-sonnet",
  },
  {
    id: "transcription",
    label: "Transcription",
    labelKo: "음성 인식",
    icon: Mic,
    options: [
      { value: "faster-whisper", label: "faster-whisper (Free)", cost: "free" },
      { value: "openai-whisper", label: "OpenAI Whisper ($)", cost: "$" },
    ],
    defaultValue: "faster-whisper",
  },
  {
    id: "voice",
    label: "Voice Generation",
    labelKo: "음성 생성",
    icon: AudioLines,
    options: [
      { value: "kokoro", label: "Kokoro (Free)", cost: "free" },
      { value: "elevenlabs", label: "ElevenLabs ($$$)", cost: "$$$" },
    ],
    defaultValue: "kokoro",
  },
  {
    id: "image",
    label: "Image Generation",
    labelKo: "이미지 생성",
    icon: ImageIcon,
    options: [
      { value: "pollinations", label: "Pollinations (Free)", cost: "free" },
      { value: "dall-e", label: "DALL-E ($$)", cost: "$$" },
    ],
    defaultValue: "pollinations",
  },
];

const COST_STYLES: Record<CostLevel, string> = {
  free: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  $: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  $$: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  $$$: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const COST_LABELS: Record<CostLevel, string> = {
  free: "Free",
  $: "$",
  $$: "$$",
  $$$: "$$$",
};

function CostBadge({ cost }: { cost: CostLevel }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        COST_STYLES[cost]
      )}
    >
      {COST_LABELS[cost]}
    </span>
  );
}

function ModelSelectorRow({ row }: { row: ModelRow }) {
  const [value, setValue] = React.useState(row.defaultValue);

  const selectedOption = row.options.find((o) => o.value === value);

  return (
    <Card className="py-4">
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-3 sm:w-44 sm:shrink-0">
          <row.icon className="size-4 shrink-0 text-muted-foreground" />
          <div>
            <span className="text-sm font-medium text-foreground">
              {row.label}
            </span>
            <span
              className="ml-1 text-xs text-muted-foreground"
              lang="ko"
            >
              / {row.labelKo}
            </span>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-3">
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="w-full sm:max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {row.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedOption && <CostBadge cost={selectedOption.cost} />}
        </div>
      </CardContent>
    </Card>
  );
}

export function SettingsModelsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-sm font-semibold text-foreground">
          AI Models
          <span className="ml-1 text-xs text-muted-foreground" lang="ko">
            / AI 모델
          </span>
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Choose which AI models power each task. Changes apply to all future
          pipeline runs.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {MODEL_ROWS.map((row) => (
          <ModelSelectorRow key={row.id} row={row} />
        ))}
      </div>
    </div>
  );
}
