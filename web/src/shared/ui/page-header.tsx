import * as React from "react";

type PageHeaderProps = {
  title: string;
  titleKo: string;
  description?: string;
  action?: React.ReactNode;
};

export function PageHeader({
  title,
  titleKo,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground" lang="ko">
          {titleKo}
        </p>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
