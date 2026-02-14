import {
  MessageSquare,
  FileText,
  Mail,
  Video,
  Image,
  Film,
  ExternalLink,
  Download,
  BarChart3,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { formatRelativeTime } from "@/shared/lib/format";
import type { MockContent } from "@/shared/mock/content";

const formatIconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  thread: MessageSquare,
  post: FileText,
  newsletter: Mail,
  video_script: Video,
  carousel: Image,
  short_video: Film,
};

const platformLabels: Record<string, string> = {
  x: "X",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  instagram: "Instagram",
  newsletter: "Newsletter",
  reddit: "Reddit",
};

const STATUS_DRAFT = { label: "Draft", className: "text-muted-foreground" } as const;

const statusConfig: Record<string, { label: string; className: string }> = {
  published: { label: "Published", className: "text-success" },
  draft: STATUS_DRAFT,
  scheduled: { label: "Scheduled", className: "text-info" },
};

function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function getFormatKey(format: string): string {
  const lower = format.toLowerCase();
  if (lower.includes("thread")) return "thread";
  if (lower.includes("newsletter")) return "newsletter";
  if (lower.includes("video script")) return "video_script";
  if (lower.includes("reel") || lower.includes("short")) return "short_video";
  if (lower.includes("carousel")) return "carousel";
  return "post";
}

type ContentCardProps = {
  item: MockContent;
};

export function ContentCard({ item }: ContentCardProps) {
  const formatKey = getFormatKey(item.format);
  const Icon = formatIconMap[formatKey] ?? FileText;
  const status = statusConfig[item.status] ?? STATUS_DRAFT;

  return (
    <Card className="py-4">
      <CardContent className="flex flex-col gap-3">
        {/* Format icon + label */}
        <div className="flex items-center gap-2">
          <Icon
            className="size-4 text-muted-foreground shrink-0"
            aria-hidden="true"
          />
          <span className="text-xs text-muted-foreground">{item.format}</span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium leading-tight line-clamp-1">
          {item.title}
        </h3>

        {/* Platform + Status */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {platformLabels[item.platform] ?? item.platform}
          </Badge>
          <span className={`text-xs font-medium ${status.className}`}>
            {status.label}
          </span>
        </div>

        {/* Published date */}
        {item.publishedAt && (
          <p className="text-xs text-muted-foreground">
            Published {formatRelativeTime(item.publishedAt)}
          </p>
        )}

        {/* Pipeline name */}
        <p className="text-xs text-muted-foreground">{item.pipelineName}</p>
      </CardContent>

      <CardFooter className="gap-2">
        <Button variant="ghost" size="xs">
          <ExternalLink className="size-3" />
          View
        </Button>
        <Button variant="outline" size="xs">
          <Download className="size-3" />
          Export
        </Button>
        {item.status === "published" && item.analyticsUrl && isSafeUrl(item.analyticsUrl) && (
          <Button variant="outline" size="xs" asChild>
            <a href={item.analyticsUrl} target="_blank" rel="noopener noreferrer">
              <BarChart3 className="size-3" />
              Analytics
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
