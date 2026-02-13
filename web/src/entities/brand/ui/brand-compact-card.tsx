import {
  AtSign,
  Youtube,
  Instagram,
  Linkedin,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import type { Brand } from "../model/types";

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  twitter: AtSign,
  youtube: Youtube,
  instagram: Instagram,
  linkedin: Linkedin,
  wordpress: Globe,
};

type BrandCompactCardProps = {
  brand: Brand;
  selected?: boolean;
  onSelect?: () => void;
};

export function BrandCompactCard({
  brand,
  selected,
  onSelect,
}: BrandCompactCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent/50 data-[selected=true]:border-primary data-[selected=true]:bg-primary/5 data-[selected=true]:ring-2 data-[selected=true]:ring-primary"
      data-selected={selected}
    >
      <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-primary">
        {selected && (
          <div className="size-2.5 rounded-full bg-primary" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{brand.name}</span>
          {brand.isDefault && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              Default
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">
          {brand.description}
        </p>
        <div className="mt-1 flex items-center gap-1.5">
          {brand.connectedPlatforms.map((p) => {
            const Icon = PLATFORM_ICONS[p.platformId] ?? Globe;
            return (
              <Icon
                key={p.platformId}
                className="size-3.5 text-muted-foreground"
              />
            );
          })}
        </div>
      </div>
    </button>
  );
}
