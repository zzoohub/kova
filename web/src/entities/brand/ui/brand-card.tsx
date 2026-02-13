import Link from "next/link";
import {
  MoreHorizontal,
  Pencil,
  Copy,
  Star,
  Trash2,
  AtSign,
  Youtube,
  Instagram,
  Linkedin,
  Globe,
  type LucideIcon,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { ROUTES } from "@/shared/config/routes";
import type { Brand } from "../model/types";

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  twitter: AtSign,
  youtube: Youtube,
  instagram: Instagram,
  linkedin: Linkedin,
  wordpress: Globe,
};

export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-col gap-1">
          {brand.isDefault && (
            <Badge variant="secondary" className="w-fit">
              Default
            </Badge>
          )}
          <CardTitle className="font-medium text-base">
            {brand.name}
          </CardTitle>
        </div>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={ROUTES.BRAND_DETAIL(brand.id)}>
                  <Pencil className="size-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="size-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Star className="size-4" />
                Set as Default
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {brand.description}
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {brand.connectedPlatforms.map((p) => {
              const Icon = PLATFORM_ICONS[p.platformId] ?? Globe;
              return (
                <Icon
                  key={p.platformId}
                  className="size-4 text-muted-foreground"
                />
              );
            })}
          </div>
          <span className="text-xs text-muted-foreground">
            {brand.pipelineCount} pipeline{brand.pipelineCount !== 1 ? "s" : ""}
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.BRAND_DETAIL(brand.id)}>Edit</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
