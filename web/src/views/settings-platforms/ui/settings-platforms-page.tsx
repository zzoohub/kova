"use client";

import {
  AtSign,
  Youtube,
  Instagram,
  Linkedin,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { mockPlatforms, type MockPlatform } from "@/shared/mock/platforms";

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  twitter: AtSign,
  youtube: Youtube,
  instagram: Instagram,
  linkedin: Linkedin,
  wordpress: Globe,
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PlatformIcon({
  iconKey,
  color,
}: {
  iconKey: string;
  color: string;
}) {
  const Icon = PLATFORM_ICONS[iconKey] ?? Globe;
  return (
    <div
      className="flex size-10 items-center justify-center rounded-lg"
      style={{ backgroundColor: `${color}10` }}
    >
      <Icon className="size-5" style={{ color }} />
    </div>
  );
}

function ConnectedPlatformCard({ platform }: { platform: MockPlatform }) {
  return (
    <Card className="py-4">
      <CardContent className="flex items-start gap-4">
        <PlatformIcon iconKey={platform.icon} color={platform.color} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {platform.name}
            </span>
            <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
          </div>
          {platform.account && (
            <p className="text-sm text-muted-foreground">{platform.account}</p>
          )}
          {platform.connectedAt && (
            <p className="text-xs text-muted-foreground">
              Connected {formatDate(platform.connectedAt)}
            </p>
          )}
          {platform.permissions && platform.permissions.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              {platform.permissions.join(", ")}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30">
          Disconnect
        </Button>
      </CardContent>
    </Card>
  );
}

function AvailablePlatformCard({ platform }: { platform: MockPlatform }) {
  return (
    <Card className="py-4">
      <CardContent className="flex items-start gap-4">
        <PlatformIcon iconKey={platform.icon} color={platform.color} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {platform.name}
            </span>
            <span className="size-2 shrink-0 rounded-full bg-muted-foreground/30" />
          </div>
          <p className="text-sm text-muted-foreground">
            {platform.description}
          </p>
        </div>
        <div className="shrink-0">
          {platform.comingSoon ? (
            <Badge variant="secondary">Coming Soon</Badge>
          ) : (
            <Button variant="default" size="sm">
              Connect
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function SettingsPlatformsPage() {
  const connectedPlatforms = mockPlatforms.filter((p) => p.connected);
  const availablePlatforms = mockPlatforms.filter((p) => !p.connected);

  return (
    <div className="flex flex-col gap-6">
      {/* Connected Platforms */}
      {connectedPlatforms.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Connected Platforms
            <span
              className="ml-1 text-xs text-muted-foreground"
              lang="ko"
            >
              / 연결된 플랫폼
            </span>
          </h2>
          <div className="flex flex-col gap-3">
            {connectedPlatforms.map((platform) => (
              <ConnectedPlatformCard key={platform.id} platform={platform} />
            ))}
          </div>
        </section>
      )}

      <Separator />

      {/* Available Platforms */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">
          Available Platforms
          <span
            className="ml-1 text-xs text-muted-foreground"
            lang="ko"
          >
            / 사용 가능한 플랫폼
          </span>
        </h2>
        <div className="flex flex-col gap-3">
          {availablePlatforms.map((platform) => (
            <AvailablePlatformCard key={platform.id} platform={platform} />
          ))}
        </div>
      </section>
    </div>
  );
}
