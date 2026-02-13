import {
  MessageSquare,
  FileText,
  Mail,
  Video,
  Image,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { ReviewFormatType } from "../model/types";

const formatIcons: Record<ReviewFormatType, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  thread: MessageSquare,
  post: FileText,
  newsletter: Mail,
  video_script: Video,
  carousel: Image,
};

export function FormatIcon({
  format,
  className,
}: {
  format: ReviewFormatType;
  className?: string;
}) {
  const Icon = formatIcons[format];

  return <Icon className={cn("size-4", className)} />;
}
