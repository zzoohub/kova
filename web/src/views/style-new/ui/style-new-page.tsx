"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Link as LinkIcon,
  FileText,
  File,
  Check,
  Loader2,
  ExternalLink,
  Save,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { ROUTES } from "@/shared/config/routes";
import { mockStyleDetail } from "@/shared/mock/style-detail";

type Phase = "input" | "analyzing" | "result";
type TabValue = "url" | "text" | "file";

export function StyleNewPage() {
  const [phase, setPhase] = useState<Phase>("input");
  const [activeTab, setActiveTab] = useState<TabValue>("url");
  const [inputValue, setInputValue] = useState("");
  const [profileName, setProfileName] = useState("Sarah's Tech Voice");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  function handleAnalyze() {
    setPhase("analyzing");
    timerRef.current = setTimeout(() => {
      setPhase("result");
    }, 2000);
  }

  const isAnalyzeDisabled =
    (activeTab === "url" && !inputValue.trim()) ||
    (activeTab === "text" && !inputValue.trim());

  // Phase 1: Input
  if (phase === "input") {
    return (
      <div className="flex flex-col gap-6">
        {/* Back link */}
        <Link
          href={ROUTES.STYLES}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring w-fit"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Styles
        </Link>

        {/* Title */}
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground">
            Create Style Profile
          </h1>
          <p className="text-sm text-muted-foreground" lang="ko">
            스타일 프로필 만들기
          </p>
        </div>

        {/* Tab selector */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => {
            setActiveTab(v as TabValue);
            setInputValue("");
          }}
        >
          <TabsList>
            <TabsTrigger value="url">
              <LinkIcon className="size-4" />
              URL
            </TabsTrigger>
            <TabsTrigger value="text">
              <FileText className="size-4" />
              Text
            </TabsTrigger>
            <TabsTrigger value="file">
              <File className="size-4" />
              File
            </TabsTrigger>
          </TabsList>

          {/* URL Tab */}
          <TabsContent value="url">
            <div className="flex flex-col gap-3">
              <Input
                type="url"
                placeholder="https://..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Examples: an X/Twitter thread, a YouTube video, a blog post
              </p>
            </div>
          </TabsContent>

          {/* Text Tab */}
          <TabsContent value="text">
            <div className="flex flex-col gap-3">
              <Textarea
                placeholder="Paste the content you want to analyze..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                rows={8}
              />
            </div>
          </TabsContent>

          {/* File Tab */}
          <TabsContent value="file">
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 p-10 transition-colors hover:border-muted-foreground/50">
              <Upload
                className="size-10 text-muted-foreground"
                aria-hidden="true"
              />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Drop a file or click to upload
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Accepts .pdf, .docx, .txt, .mp4, .mp3
                </p>
              </div>
              <input
                type="file"
                accept=".pdf,.docx,.txt,.mp4,.mp3"
                className="absolute inset-0 cursor-pointer opacity-0"
                aria-label="Upload file"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Analyze button */}
        <div>
          <Button
            size="lg"
            onClick={handleAnalyze}
            disabled={isAnalyzeDisabled}
          >
            Analyze Style
          </Button>
        </div>
      </div>
    );
  }

  // Phase 2: Analyzing
  if (phase === "analyzing") {
    return (
      <div className="flex flex-col gap-6">
        {/* Back link */}
        <Link
          href={ROUTES.STYLES}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring w-fit"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Styles
        </Link>

        <div className="flex flex-col items-center justify-center gap-6 py-16">
          <Loader2
            className="size-10 animate-spin text-primary"
            aria-hidden="true"
          />
          <h2 className="text-lg font-semibold text-foreground">
            Analyzing style...
          </h2>
          <p className="text-sm text-muted-foreground" lang="ko">
            스타일 분석 중...
          </p>

          <div className="w-full max-w-md flex flex-col gap-4">
            {/* Step 1: Done */}
            <div className="flex items-center gap-3">
              <Check className="size-4 text-success shrink-0" aria-hidden="true" />
              <span className="text-sm text-foreground">
                Fetching content... done
              </span>
            </div>

            {/* Step 2: In progress */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Loader2
                  className="size-4 animate-spin text-primary shrink-0"
                  aria-hidden="true"
                />
                <span className="text-sm text-foreground">
                  Extracting patterns... 72%
                </span>
              </div>
              <Progress value={72} className="h-1.5" />
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            This usually takes 10-30 seconds
          </p>
        </div>
      </div>
    );
  }

  // Phase 3: Result
  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <Link
        href={ROUTES.STYLES}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring w-fit"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Styles
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-foreground">
            Style Extracted
          </h1>
          <p className="text-sm text-muted-foreground" lang="ko">
            스타일 추출 완료
          </p>
        </div>
        <Button asChild>
          <Link href={ROUTES.STYLES}>
            <Save />
            Save Profile
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Source Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Source Info</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                Source URL
              </span>
              <a
                href={mockStyleDetail.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span className="truncate max-w-[200px]">
                  {mockStyleDetail.sourceUrl}
                </span>
                <ExternalLink
                  className="size-3 shrink-0"
                  aria-hidden="true"
                />
              </a>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                Content Type Detected
              </span>
              <span className="text-sm capitalize">
                {mockStyleDetail.sourceType}
              </span>
            </div>

            {/* Name Input */}
            <div className="flex flex-col gap-2 pt-2">
              <label
                htmlFor="profile-name"
                className="text-xs font-medium text-muted-foreground"
              >
                Name this profile
              </label>
              <Input
                id="profile-name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Extracted Attributes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Extracted Attributes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {mockStyleDetail.attributes.map((attr) => (
                <div key={attr.label} className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    {attr.label}
                  </span>
                  <p className="text-sm leading-relaxed">{attr.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom save */}
      <div className="flex justify-end">
        <Button asChild>
          <Link href={ROUTES.STYLES}>
            <Save />
            Save Profile
          </Link>
        </Button>
      </div>
    </div>
  );
}
