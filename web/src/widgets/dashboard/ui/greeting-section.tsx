import Link from "next/link";
import { CheckSquare, GitBranch, FileText } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { getGreeting } from "@/shared/lib/greeting";
import { mockDashboardStats } from "@/shared/mock/dashboard";
import { ROUTES } from "@/shared/config/routes";

const stats = [
  {
    label: "Items to review",
    labelKo: "검토 대기 항목",
    value: mockDashboardStats.itemsToReview,
    icon: CheckSquare,
    href: ROUTES.REVIEW,
  },
  {
    label: "Pipelines today",
    labelKo: "오늘의 파이프라인",
    value: mockDashboardStats.pipelinesToday,
    icon: GitBranch,
    href: ROUTES.PIPELINES,
  },
  {
    label: "Published this week",
    labelKo: "이번 주 발행",
    value: mockDashboardStats.publishedThisWeek,
    icon: FileText,
    href: ROUTES.CONTENT,
  },
] as const;

export function GreetingSection() {
  const greeting = getGreeting();

  return (
    <section aria-label="Dashboard greeting and stats">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          {greeting.en}, Sarah
        </h1>
        <p className="text-sm text-muted-foreground" lang="ko">
          {greeting.ko}, Sarah
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="block rounded-xl transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Card className="h-full">
              <CardContent className="flex items-center gap-4">
                <stat.icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground" lang="ko">
                    {stat.labelKo}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
