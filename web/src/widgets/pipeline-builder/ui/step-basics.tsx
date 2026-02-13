"use client";

import {
  Lightbulb,
  Link as LinkIcon,
  Youtube,
  BookOpen,
  TrendingUp,
  FileQuestion,
  MessageSquare,
  Globe,
  Upload,
  FileText,
} from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { cn } from "@/shared/lib/utils";
import { useBuilderForm, type BuilderStep } from "../store/use-builder-form";
import type { LucideIcon } from "lucide-react";

type Template = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  stepCount: number;
  defaultSteps: BuilderStep[];
};

const TEMPLATES: Template[] = [
  {
    id: "topic-to-everything",
    name: "Topic to Everything",
    description: "Generate multi-format content from a single topic.",
    icon: Lightbulb,
    stepCount: 6,
    defaultSteps: [
      {
        id: "s1",
        name: "Idea Generator",
        description: "Generate content ideas from your topic",
        category: "Generate",
        enabled: true,
        expanded: false,
        config: { creativity: "balanced" },
      },
      {
        id: "s2",
        name: "Research Agent",
        description: "Gather supporting data and references",
        category: "Generate",
        enabled: true,
        expanded: false,
        config: { depth: "standard" },
      },
      {
        id: "s3",
        name: "Script Writer",
        description: "Write a long-form script from research",
        category: "Generate",
        enabled: true,
        expanded: false,
        config: { targetLength: "1500" },
      },
      {
        id: "s4",
        name: "Multi-Format Transform",
        description: "Convert to threads, posts, and clips",
        category: "Transform",
        enabled: true,
        expanded: false,
        config: { formats: "thread,post,clip" },
      },
      {
        id: "s5",
        name: "Human Review Gate",
        description: "Pause for your review before publishing",
        category: "Review",
        enabled: true,
        expanded: false,
        config: {},
      },
      {
        id: "s6",
        name: "Deploy to Platforms",
        description: "Publish to your connected platforms",
        category: "Publish",
        enabled: true,
        expanded: false,
        config: { platforms: "all" },
      },
    ],
  },
  {
    id: "url-to-everything",
    name: "URL to Everything",
    description: "Repurpose any web content into multiple formats.",
    icon: LinkIcon,
    stepCount: 5,
    defaultSteps: [
      {
        id: "s1",
        name: "Content Extraction",
        description: "Extract and parse content from the URL",
        category: "Generate",
        enabled: true,
        expanded: false,
        config: {},
      },
      {
        id: "s2",
        name: "Content Editor",
        description: "Refine extracted content for quality",
        category: "Refine",
        enabled: true,
        expanded: false,
        config: { tone: "professional" },
      },
      {
        id: "s3",
        name: "Multi-Format Transform",
        description: "Convert to threads, posts, and clips",
        category: "Transform",
        enabled: true,
        expanded: false,
        config: { formats: "thread,post" },
      },
      {
        id: "s4",
        name: "Human Review Gate",
        description: "Pause for your review before publishing",
        category: "Review",
        enabled: true,
        expanded: false,
        config: {},
      },
      {
        id: "s5",
        name: "Deploy to Platforms",
        description: "Publish to your connected platforms",
        category: "Publish",
        enabled: true,
        expanded: false,
        config: { platforms: "all" },
      },
    ],
  },
  {
    id: "youtube-to-clips",
    name: "YouTube to Clips",
    description: "Extract highlight clips from YouTube videos.",
    icon: Youtube,
    stepCount: 5,
    defaultSteps: [
      {
        id: "s1",
        name: "Transcription",
        description: "Transcribe video audio with timestamps",
        category: "Generate",
        enabled: true,
        expanded: false,
        config: {},
      },
      {
        id: "s2",
        name: "Highlight Detection",
        description: "Identify the most engaging moments",
        category: "Generate",
        enabled: true,
        expanded: false,
        config: { maxClips: "5" },
      },
      {
        id: "s3",
        name: "Caption Generation",
        description: "Generate social captions for each clip",
        category: "Refine",
        enabled: true,
        expanded: false,
        config: {},
      },
      {
        id: "s4",
        name: "Human Review Gate",
        description: "Pause for your review before publishing",
        category: "Review",
        enabled: true,
        expanded: false,
        config: {},
      },
      {
        id: "s5",
        name: "Deploy to Platforms",
        description: "Publish clips to your platforms",
        category: "Publish",
        enabled: true,
        expanded: false,
        config: { platforms: "youtube,instagram,tiktok" },
      },
    ],
  },
  {
    id: "blog-to-social",
    name: "Blog to Social",
    description: "Turn blog posts into a week of social content.",
    icon: BookOpen,
    stepCount: 5,
    defaultSteps: [
      {
        id: "s1",
        name: "Content Extraction",
        description: "Parse blog post content and structure",
        category: "Generate",
        enabled: true,
        expanded: false,
        config: {},
      },
      {
        id: "s2",
        name: "SEO Optimizer",
        description: "Optimize for social discovery",
        category: "Refine",
        enabled: true,
        expanded: false,
        config: {},
      },
      {
        id: "s3",
        name: "Multi-Format Transform",
        description: "Generate threads, carousels, and posts",
        category: "Transform",
        enabled: true,
        expanded: false,
        config: { formats: "thread,carousel,post" },
      },
      {
        id: "s4",
        name: "Hashtag Generator",
        description: "Research and add relevant hashtags",
        category: "Refine",
        enabled: true,
        expanded: false,
        config: { maxHashtags: "10" },
      },
      {
        id: "s5",
        name: "Deploy to Platforms",
        description: "Publish to your social accounts",
        category: "Publish",
        enabled: true,
        expanded: false,
        config: { platforms: "twitter,linkedin,instagram" },
      },
    ],
  },
  {
    id: "trend-powered-daily",
    name: "Trend-Powered Daily",
    description: "Daily content based on trending topics in your niche.",
    icon: TrendingUp,
    stepCount: 6,
    defaultSteps: [
      {
        id: "s1",
        name: "Trend Research",
        description: "Scan trending topics in your niche",
        category: "Generate",
        enabled: true,
        expanded: false,
        config: { sources: "reddit,youtube,google" },
      },
      {
        id: "s2",
        name: "Idea Generator",
        description: "Create content angles from trends",
        category: "Generate",
        enabled: true,
        expanded: false,
        config: { creativity: "high" },
      },
      {
        id: "s3",
        name: "Script Writer",
        description: "Write content from selected angle",
        category: "Generate",
        enabled: true,
        expanded: false,
        config: { targetLength: "800" },
      },
      {
        id: "s4",
        name: "Multi-Format Transform",
        description: "Convert to multiple formats",
        category: "Transform",
        enabled: true,
        expanded: false,
        config: { formats: "thread,post,short" },
      },
      {
        id: "s5",
        name: "Human Review Gate",
        description: "Pause for your review",
        category: "Review",
        enabled: true,
        expanded: false,
        config: {},
      },
      {
        id: "s6",
        name: "Deploy to Platforms",
        description: "Publish to your connected platforms",
        category: "Publish",
        enabled: true,
        expanded: false,
        config: { platforms: "all" },
      },
    ],
  },
  {
    id: "blank",
    name: "Blank",
    description: "Start from scratch with an empty pipeline.",
    icon: FileQuestion,
    stepCount: 0,
    defaultSteps: [],
  },
];

const SOURCE_TYPES = [
  {
    value: "topic" as const,
    label: "Topic / Idea",
    labelKo: "주제 / 아이디어",
    icon: MessageSquare,
  },
  {
    value: "url" as const,
    label: "URL",
    labelKo: "URL",
    icon: Globe,
  },
  {
    value: "file" as const,
    label: "Upload file",
    labelKo: "파일 업로드",
    icon: Upload,
  },
  {
    value: "text" as const,
    label: "Paste text",
    labelKo: "텍스트 붙여넣기",
    icon: FileText,
  },
];

export function StepBasics() {
  const name = useBuilderForm((s) => s.name);
  const templateId = useBuilderForm((s) => s.templateId);
  const sourceType = useBuilderForm((s) => s.sourceType);
  const sourceInput = useBuilderForm((s) => s.sourceInput);
  const setName = useBuilderForm((s) => s.setName);
  const setTemplateId = useBuilderForm((s) => s.setTemplateId);
  const setSourceType = useBuilderForm((s) => s.setSourceType);
  const setSourceInput = useBuilderForm((s) => s.setSourceInput);
  const setSteps = useBuilderForm((s) => s.setSteps);

  function handleTemplateSelect(template: Template) {
    setTemplateId(template.id);
    setSteps(template.defaultSteps);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="pipeline-name"
          className="text-sm font-medium text-foreground"
        >
          Pipeline name
        </label>
        <Input
          id="pipeline-name"
          placeholder="My content pipeline"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-medium text-foreground">Template</h3>
          <p className="text-xs text-muted-foreground">
            Choose a starting template for your pipeline
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {TEMPLATES.map((template) => {
            const Icon = template.icon;
            const isSelected = templateId === template.id;

            return (
              <button
                key={template.id}
                type="button"
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors hover:bg-accent/50",
                  isSelected
                    ? "border-primary ring-2 ring-primary"
                    : "border-border"
                )}
                onClick={() => handleTemplateSelect(template)}
                aria-pressed={isSelected}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className={cn(
                      "size-4 shrink-0",
                      isSelected
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium">
                    {template.name}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
                {template.stepCount > 0 ? (
                  <span className="text-xs text-muted-foreground">
                    {template.stepCount} steps
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-sm font-medium text-foreground">Source type</h3>
          <p className="text-xs text-muted-foreground">
            What kind of input will this pipeline use?
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SOURCE_TYPES.map((source) => {
            const Icon = source.icon;
            const isSelected = sourceType === source.value;

            return (
              <button
                key={source.value}
                type="button"
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-colors hover:bg-accent/50",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary"
                    : "border-border"
                )}
                onClick={() => setSourceType(source.value)}
                aria-pressed={isSelected}
              >
                <Icon
                  className={cn(
                    "size-5",
                    isSelected
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  aria-hidden="true"
                />
                <span className="text-xs font-medium">{source.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-1">
          {sourceType === "topic" ? (
            <Input
              placeholder="What topic should this pipeline cover?"
              value={sourceInput}
              onChange={(e) => setSourceInput(e.target.value)}
            />
          ) : null}

          {sourceType === "url" ? (
            <Input
              type="url"
              placeholder="https://..."
              value={sourceInput}
              onChange={(e) => setSourceInput(e.target.value)}
            />
          ) : null}

          {sourceType === "file" ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:border-muted-foreground/50">
              <Upload
                className="size-8 text-muted-foreground"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Drop a file or click to upload
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, DOCX, TXT, or MP4
                </p>
              </div>
            </div>
          ) : null}

          {sourceType === "text" ? (
            <Textarea
              placeholder="Paste your content here..."
              value={sourceInput}
              onChange={(e) => setSourceInput(e.target.value)}
              className="min-h-28"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
