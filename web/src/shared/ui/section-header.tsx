import Link from "next/link";

type SectionHeaderProps = {
  title: string;
  titleKo: string;
  href?: string;
  count?: number;
};

export function SectionHeader({
  title,
  titleKo,
  href,
  count,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <p className="text-xs text-muted-foreground" lang="ko">
          {titleKo}
        </p>
      </div>
      {href && (
        <Link
          href={href}
          className="shrink-0 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          View all{count !== undefined ? ` (${count})` : ""}
        </Link>
      )}
    </div>
  );
}
