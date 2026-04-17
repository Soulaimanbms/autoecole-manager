import Link from "next/link";
import { EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImpersonationBannerProps {
  impersonating?: boolean;
  schoolName?: string | null;
  className?: string;
}

export function ImpersonationBanner({
  impersonating,
  schoolName,
  className,
}: ImpersonationBannerProps) {
  if (!impersonating) return null;
  return (
    <div
      className={cn(
        "sticky top-0 z-50 w-full bg-[#0f172a] text-white border-b border-white/10 flex items-center justify-center gap-3 px-4 py-2 text-xs font-semibold",
        className,
      )}
      role="status"
    >
      <EyeOff className="h-3.5 w-3.5 text-accent shrink-0" aria-hidden />
      <span>
        Mode impersonation
        {schoolName ? (
          <>
            {" "}
            — <span className="text-accent">{schoolName}</span>
          </>
        ) : null}
      </span>
      <Link
        href="/api/admin/impersonation/stop"
        className="ml-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors"
      >
        Quitter
      </Link>
    </div>
  );
}
