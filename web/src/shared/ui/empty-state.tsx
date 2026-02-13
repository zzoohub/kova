import * as React from "react";
import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  titleKo: string;
  description: string;
  descriptionKo: string;
  action?: React.ReactNode;
};

export function EmptyState({
  icon: Icon,
  title,
  titleKo,
  description,
  descriptionKo,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4">
        <Icon className="size-12 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground" lang="ko">
        {titleKo}
      </p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      <p className="max-w-sm text-sm text-muted-foreground" lang="ko">
        {descriptionKo}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
