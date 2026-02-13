import Link from "next/link";
import { Link2, Type, Mic, Video, ImageIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/shared/config/routes";
import type { StyleProfile, StyleSourceType } from "../model/types";
import { StyleAttributeBadge } from "./style-attribute-badge";

const sourceTypeIcons: Record<StyleSourceType, React.ReactNode> = {
  url: <Link2 className="size-3" />,
  text: <Type className="size-3" />,
  audio: <Mic className="size-3" />,
  video: <Video className="size-3" />,
  image: <ImageIcon className="size-3" />,
};

export function StyleCard({ style }: { style: StyleProfile }) {
  const topThree = style.topAttributes.slice(0, 3);

  return (
    <Card className="h-full">
      <Link href={ROUTES.STYLE_DETAIL(style.id)} className="block">
        <CardHeader>
          <CardTitle className="font-medium text-base">
            {style.name}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="gap-1">
              {sourceTypeIcons[style.sourceType]}
              {style.sourceType}
            </Badge>
          </CardAction>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-1.5">
            {topThree.map((attr) => (
              <StyleAttributeBadge
                key={attr.label}
                label={attr.label}
                value={attr.value}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            Used {style.usageCount} times
          </span>
        </CardContent>
      </Link>

      <CardFooter className="gap-2">
        <Button variant="outline" size="sm">
          Apply
        </Button>
        <Button variant="ghost" size="sm">
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
