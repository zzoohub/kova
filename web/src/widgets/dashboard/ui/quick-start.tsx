import Link from "next/link";
import { Plus, Play, Palette } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/shared/config/routes";

export function QuickStart() {
  return (
    <section aria-label="Quick start actions">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild>
            <Link href={ROUTES.PIPELINE_NEW}>
              <Plus aria-hidden="true" />
              New Pipeline
            </Link>
          </Button>
          <Button variant="outline">
            <Play aria-hidden="true" />
            Quick Run
          </Button>
          <Button variant="outline" asChild>
            <Link href={ROUTES.STYLE_NEW}>
              <Palette aria-hidden="true" />
              New Style
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
