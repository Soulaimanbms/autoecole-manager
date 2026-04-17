import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  label?: string;
  showPct?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  label,
  showPct,
  className,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("w-full", className)}>
      {(label || showPct) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-[10px] text-muted font-medium">{label}</span>
          )}
          {showPct && (
            <span className="text-[10px] text-muted font-medium ml-auto">
              {pct}%
            </span>
          )}
        </div>
      )}
      <div className="h-1.5 w-full bg-bg-hover rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
