export function StyleAttributeBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-md bg-secondary px-2.5 py-1.5">
      <span className="text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
