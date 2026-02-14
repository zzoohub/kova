export type ContentFormat = "thread" | "post" | "newsletter" | "video_script" | "carousel" | "short_video";
export type ContentPlatform = "x" | "linkedin" | "youtube" | "instagram" | "newsletter" | "reddit";
export type ContentStatus = "draft" | "published" | "scheduled";

export type ContentItem = {
  id: string;
  title: string;
  format: ContentFormat;
  platform: ContentPlatform;
  status: ContentStatus;
  publishedAt: Date | null;
  pipelineName: string;
  analyticsUrl?: string;
};
