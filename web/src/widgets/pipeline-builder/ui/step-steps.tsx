"use client";

import { useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  X,
  ArrowUp,
  ArrowDown,
  Plus,
  Sparkles,
  Pencil,
  Repeat2,
  Eye,
  Send,
  Layers,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { useBuilderForm, type BuilderStep } from "../store/use-builder-form";
import type { LucideIcon } from "lucide-react";

type AvailableStep = {
  id: string;
  name: string;
  description: string;
  category: string;
};

const AVAILABLE_STEPS: AvailableStep[] = [
  {
    id: "idea-generator",
    name: "Idea Generator",
    description: "Generate content ideas from your input",
    category: "Generate",
  },
  {
    id: "research-agent",
    name: "Research Agent",
    description: "Gather supporting data and references",
    category: "Generate",
  },
  {
    id: "script-writer",
    name: "Script Writer",
    description: "Write a full script or article draft",
    category: "Generate",
  },
  {
    id: "content-editor",
    name: "Content Editor",
    description: "Polish and refine generated content",
    category: "Refine",
  },
  {
    id: "seo-optimizer",
    name: "SEO Optimizer",
    description: "Optimize content for search engines",
    category: "Refine",
  },
  {
    id: "hashtag-generator",
    name: "Hashtag Generator",
    description: "Research and suggest relevant hashtags",
    category: "Refine",
  },
  {
    id: "multi-format-transform",
    name: "Multi-Format Transform",
    description: "Convert content into multiple formats",
    category: "Transform",
  },
  {
    id: "human-review-gate",
    name: "Human Review Gate",
    description: "Pause pipeline for manual review",
    category: "Review",
  },
  {
    id: "deploy-to-platforms",
    name: "Deploy to Platforms",
    description: "Publish content to connected platforms",
    category: "Publish",
  },
];

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Generate: Sparkles,
  Refine: Pencil,
  Transform: Repeat2,
  Review: Eye,
  Publish: Send,
};

const CATEGORY_ORDER = ["Generate", "Refine", "Transform", "Review", "Publish"];

function StepConfigFields({ step }: { step: BuilderStep }) {
  const setSteps = useBuilderForm((s) => s.setSteps);
  const steps = useBuilderForm((s) => s.steps);

  function updateConfig(key: string, value: string) {
    setSteps(
      steps.map((s) =>
        s.id === step.id
          ? { ...s, config: { ...s.config, [key]: value } }
          : s
      )
    );
  }

  if (step.category === "Generate") {
    return (
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Creativity level
          </label>
          <Select
            value={step.config["creativity"] ?? "balanced"}
            onValueChange={(v) => updateConfig("creativity", v)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conservative">Conservative</SelectItem>
              <SelectItem value="balanced">Balanced</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Target length (words)
          </label>
          <Input
            className="h-8 text-xs"
            placeholder="e.g. 1500"
            value={step.config["targetLength"] ?? ""}
            onChange={(e) => updateConfig("targetLength", e.target.value)}
          />
        </div>
      </div>
    );
  }

  if (step.category === "Refine") {
    return (
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Tone
          </label>
          <Select
            value={step.config["tone"] ?? "professional"}
            onValueChange={(v) => updateConfig("tone", v)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="witty">Witty</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  if (step.category === "Transform") {
    return (
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Output formats
          </label>
          <Input
            className="h-8 text-xs"
            placeholder="e.g. thread, post, clip"
            value={step.config["formats"] ?? ""}
            onChange={(e) => updateConfig("formats", e.target.value)}
          />
        </div>
      </div>
    );
  }

  if (step.category === "Publish") {
    return (
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Target platforms
          </label>
          <Select
            value={step.config["platforms"] ?? "all"}
            onValueChange={(v) => updateConfig("platforms", v)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All connected</SelectItem>
              <SelectItem value="twitter">X (Twitter)</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <p className="pt-2 text-xs text-muted-foreground">
      No configurable options for this step.
    </p>
  );
}

export function StepSteps() {
  const steps = useBuilderForm((s) => s.steps);
  const toggleStepExpanded = useBuilderForm((s) => s.toggleStepExpanded);
  const removeStep = useBuilderForm((s) => s.removeStep);
  const addStep = useBuilderForm((s) => s.addStep);
  const moveStepUp = useBuilderForm((s) => s.moveStepUp);
  const moveStepDown = useBuilderForm((s) => s.moveStepDown);
  const [addStepOpen, setAddStepOpen] = useState(false);
  const stepCounterRef = useRef(0);

  function handleAddStep(available: AvailableStep) {
    stepCounterRef.current += 1;
    const newStep: BuilderStep = {
      id: `${available.id}-${stepCounterRef.current}`,
      name: available.name,
      description: available.description,
      category: available.category,
      enabled: true,
      expanded: false,
      config: {},
    };
    addStep(newStep);
    setAddStepOpen(false);
  }

  const groupedSteps = CATEGORY_ORDER.map((category) => ({
    category,
    steps: AVAILABLE_STEPS.filter((s) => s.category === category),
  })).filter((g) => g.steps.length > 0);

  if (steps.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <Layers className="size-10 text-muted-foreground" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-foreground">
            Your pipeline has no steps yet
          </p>
          <p className="text-sm text-muted-foreground">
            Add your first step to get started.
          </p>
        </div>
        <Popover open={addStepOpen} onOpenChange={setAddStepOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Plus />
              Add Step
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="center">
            <div className="max-h-80 overflow-y-auto p-2">
              {groupedSteps.map((group) => {
                const CategoryIcon = CATEGORY_ICONS[group.category] ?? Sparkles;
                return (
                  <div key={group.category} className="mb-2 last:mb-0">
                    <div className="flex items-center gap-1.5 px-2 py-1.5">
                      <CategoryIcon
                        className="size-3.5 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="text-xs font-medium text-muted-foreground">
                        {group.category}
                      </span>
                    </div>
                    {group.steps.map((available) => (
                      <button
                        key={available.id}
                        type="button"
                        className="flex w-full flex-col gap-0.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-accent"
                        onClick={() => handleAddStep(available)}
                      >
                        <span className="text-sm font-medium">
                          {available.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {available.description}
                        </span>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {steps.map((step, index) => {
          const CategoryIcon = CATEGORY_ICONS[step.category] ?? Sparkles;
          return (
            <div
              key={step.id}
              className="rounded-lg border border-border bg-card"
            >
              <div className="flex items-center gap-2 p-3">
                <GripVertical
                  className="size-4 shrink-0 cursor-not-allowed text-muted-foreground/50"
                  aria-hidden="true"
                />
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                  <CategoryIcon
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-medium">{step.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {step.description}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    disabled={index === 0}
                    onClick={() => moveStepUp(step.id)}
                    aria-label={`Move ${step.name} up`}
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    disabled={index === steps.length - 1}
                    onClick={() => moveStepDown(step.id)}
                    aria-label={`Move ${step.name} down`}
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => toggleStepExpanded(step.id)}
                    aria-label={
                      step.expanded
                        ? `Collapse ${step.name}`
                        : `Expand ${step.name}`
                    }
                  >
                    {step.expanded ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => removeStep(step.id)}
                    aria-label={`Remove ${step.name}`}
                  >
                    <X />
                  </Button>
                </div>
              </div>

              {step.expanded ? (
                <div className="border-t border-border px-3 pb-3">
                  <StepConfigFields step={step} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <Popover open={addStepOpen} onOpenChange={setAddStepOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus />
            Add Step
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="center">
          <div className="max-h-80 overflow-y-auto p-2">
            {groupedSteps.map((group) => {
              const CategoryIcon = CATEGORY_ICONS[group.category] ?? Sparkles;
              return (
                <div key={group.category} className="mb-2 last:mb-0">
                  <div className="flex items-center gap-1.5 px-2 py-1.5">
                    <CategoryIcon
                      className="size-3.5 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="text-xs font-medium text-muted-foreground">
                      {group.category}
                    </span>
                  </div>
                  {group.steps.map((available) => (
                    <button
                      key={available.id}
                      type="button"
                      className="flex w-full flex-col gap-0.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-accent"
                      onClick={() => handleAddStep(available)}
                    >
                      <span className="text-sm font-medium">
                        {available.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {available.description}
                      </span>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
