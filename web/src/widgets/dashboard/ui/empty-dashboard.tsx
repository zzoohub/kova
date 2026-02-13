import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/shared/config/routes";

const steps = [
  {
    number: 1,
    title: "Create your voice",
    titleKo: "나만의 스타일 만들기",
    description: "Paste a link to content you admire.",
    descriptionKo: "좋아하는 콘텐츠 링크를 붙여넣으세요.",
    action: { label: "Start", href: ROUTES.STYLE_NEW },
  },
  {
    number: 2,
    title: "Build a pipeline",
    titleKo: "파이프라인 만들기",
    description: "Choose a workflow template.",
    descriptionKo: "워크플로우 템플릿을 선택하세요.",
    action: { label: "Browse Templates", href: ROUTES.PIPELINE_NEW },
  },
  {
    number: 3,
    title: "Run it",
    titleKo: "실행하기",
    description: "Type a topic and go.",
    descriptionKo: "주제를 입력하고 시작하세요.",
    action: { label: "Skip to Quick Run", href: undefined },
  },
] as const;

export function EmptyDashboard() {
  return (
    <section aria-label="Welcome to Kova">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Welcome to Kova</CardTitle>
          <CardDescription>
            Create content that sounds like you, published everywhere,
            automatically.
          </CardDescription>
          <CardDescription lang="ko">
            나만의 스타일로 콘텐츠를 만들고, 모든 곳에 자동으로 발행하세요.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ol className="flex flex-col gap-6">
            {steps.map((step) => (
              <li key={step.number} className="flex gap-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {step.number}
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted-foreground" lang="ko">
                      {step.titleKo}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                  <p className="text-xs text-muted-foreground" lang="ko">
                    {step.descriptionKo}
                  </p>
                  <div>
                    {step.action.href ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={step.action.href}>{step.action.label}</Link>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        {step.action.label}
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </section>
  );
}
