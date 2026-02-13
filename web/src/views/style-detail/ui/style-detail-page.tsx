"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  Trash2,
  ExternalLink,
  Pencil,
  Sparkles,
  Clock,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Textarea } from "@/shared/ui/textarea";
import { ROUTES } from "@/shared/config/routes";
import { mockStyleDetail } from "@/shared/mock/style-detail";
import { formatRelativeTime } from "@/shared/lib/format";

type StyleDetailContentProps = {
  id: string;
};

export function StyleDetailPage({ id }: StyleDetailContentProps) {
  // TODO: replace with real data fetching by id
  const style = { ...mockStyleDetail, id };

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedValue, setEditedValue] = useState("");

  function handleEditStart(index: number) {
    const attr = style.attributes[index];
    if (!attr) return;
    setEditingIndex(index);
    setEditedValue(attr.value);
  }

  function handleEditCancel() {
    setEditingIndex(null);
    setEditedValue("");
  }

  function handleEditSave() {
    // Placeholder: save logic would be wired by frontend developer
    setEditingIndex(null);
    setEditedValue("");
  }

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
          <h1 className="text-xl font-bold text-foreground">{style.name}</h1>
          <p className="text-sm text-muted-foreground" lang="ko">
            스타일 프로필 상세
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm">
            <Copy />
            Duplicate
          </Button>
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 />
            Delete
          </Button>
        </div>
      </div>

      {/* Profile Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                Source
              </span>
              <a
                href={style.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span className="truncate max-w-[200px]">
                  {style.sourceUrl}
                </span>
                <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
              </a>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                Created
              </span>
              <span className="text-sm">
                {style.createdAt.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                Usage Count
              </span>
              <span className="text-sm">
                {style.usageCount} times used in pipelines
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attributes Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-foreground">
          Style Attributes
        </h2>
        <p className="text-sm text-muted-foreground" lang="ko">
          스타일 속성
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {style.attributes.map((attr, index) => (
            <Card key={attr.label} className="py-4">
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {attr.label}
                  </span>
                  {editingIndex !== index && (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleEditStart(index)}
                    >
                      <Pencil />
                      Edit
                    </Button>
                  )}
                </div>

                {editingIndex === index ? (
                  <div className="flex flex-col gap-2">
                    <Textarea
                      value={editedValue}
                      onChange={(e) => setEditedValue(e.target.value)}
                      rows={3}
                      className="text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <Button size="xs" onClick={handleEditSave}>
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={handleEditCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{attr.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Style Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Generate a sample paragraph in this style to see how it sounds.
          </p>
          <div className="rounded-md border bg-muted/50 p-4 min-h-[80px]">
            <p className="text-sm text-muted-foreground italic">
              Click &quot;Generate Preview&quot; to see a sample output in this
              style.
            </p>
          </div>
          <div>
            <Button variant="outline">
              <Sparkles />
              Generate Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold text-foreground">
          Used in Pipelines
        </h2>
        <p className="text-sm text-muted-foreground" lang="ko">
          사용 중인 파이프라인
        </p>

        {style.pipelines.length > 0 ? (
          <div className="flex flex-col gap-2">
            {style.pipelines.map((pipeline) => (
              <div
                key={pipeline.name}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <span className="text-sm font-medium">{pipeline.name}</span>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3" aria-hidden="true" />
                  Last run {formatRelativeTime(pipeline.lastRunAt)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border p-6 text-center">
            <p className="text-sm text-muted-foreground">
              This style profile is not used in any pipelines yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
