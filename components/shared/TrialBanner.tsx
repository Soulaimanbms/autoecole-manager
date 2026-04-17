import Link from "next/link";
import { Clock, AlertTriangle } from "lucide-react";
import { cn, daysSince } from "@/lib/utils";

interface TrialBannerProps {
  trialEndsAt: Date | string;
  className?: string;
}

export function TrialBanner({ trialEndsAt, className }: TrialBannerProps) {
  const end =
    typeof trialEndsAt === "string" ? new Date(trialEndsAt) : trialEndsAt;
  const daysLeft = -daysSince(end); // inverse: future date → positive days left
  const effective = Number.isFinite(daysLeft) ? Math.max(0, daysLeft) : 0;
  const urgent = effective <= 3;

  return (
    <div
      className={cn(
        "sticky top-0 z-50 w-full border-b flex items-center justify-center gap-3 px-4 py-2 text-xs font-semibold",
        urgent
          ? "bg-error-bg border-error/30 text-error-text"
          : "bg-warning-bg border-warning/30 text-warning-text",
        className,
      )}
      role="status"
    >
      {urgent ? (
        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
      ) : (
        <Clock className="h-4 w-4 shrink-0" aria-hidden />
      )}
      <span>
        Essai Starter — il vous reste{" "}
        <span className="tabular-nums font-bold">{effective}</span>{" "}
        {effective === 1 ? "jour" : "jours"}
      </span>
      <Link
        href="/settings?tab=abonnement"
        className={cn(
          "ml-2 rounded-lg border px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors",
          urgent
            ? "border-error/40 bg-white hover:bg-error/5"
            : "border-warning/40 bg-white hover:bg-warning/5",
        )}
      >
        Passer Pro
      </Link>
    </div>
  );
}
