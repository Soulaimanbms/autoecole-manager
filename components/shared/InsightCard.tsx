import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type AccentColor = "green" | "red" | "amber" | "blue";

interface InsightCardProps {
  label: string;
  value: number | string;
  subtitle?: string;
  icon: ReactNode;
  accentColor: AccentColor;
  href?: string;
  trend?: { value: number; positive: boolean };
}

const COLOR_MAP: Record<AccentColor, { icon: string; trend: string }> = {
  green: { icon: "bg-success-bg text-success", trend: "text-success-text" },
  red: { icon: "bg-error-bg text-error", trend: "text-error-text" },
  amber: { icon: "bg-warning-bg text-warning", trend: "text-warning-text" },
  blue: { icon: "bg-info-bg text-info", trend: "text-info-text" },
};

function CardContent({
  label,
  value,
  subtitle,
  icon,
  accentColor,
  trend,
}: InsightCardProps) {
  const colors = COLOR_MAP[accentColor];
  return (
    <div className="bg-white rounded-xl border border-default p-5 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start">
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center",
            colors.icon,
          )}
        >
          {icon}
        </div>
        {trend && (
          <span
            className={cn(
              "text-[9px] font-bold rounded-full px-2 py-0.5",
              trend.positive
                ? "bg-success-bg text-success-text"
                : "bg-error-bg text-error-text",
            )}
          >
            {trend.positive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-text-primary mt-3">{value}</div>
      <div className="text-xs text-muted mt-0.5">{label}</div>
      {subtitle && (
        <div className="text-[10px] text-muted mt-3 pt-3 border-t border-default">
          {subtitle}
        </div>
      )}
    </div>
  );
}

export function InsightCard(props: InsightCardProps) {
  if (props.href) {
    return (
      <Link href={props.href} className="block">
        <CardContent {...props} />
      </Link>
    );
  }
  return <CardContent {...props} />;
}
