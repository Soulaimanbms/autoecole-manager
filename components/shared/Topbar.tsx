"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { TopbarSearch } from "@/components/shared/TopbarSearch";

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/students": "Élèves",
  "/sessions": "Séances",
  "/payments": "Paiements",
  "/exams": "Examens",
  "/instructors": "Moniteurs",
  "/expenses": "Dépenses",
  "/waiting-list": "Liste d'attente",
  "/settings": "Paramètres",
  "/support": "Support",
};

function pickTitle(pathname: string): string {
  if (/^\/students\/[^/]+$/.test(pathname)) return "Profil élève";
  const exact = ROUTE_TITLES[pathname];
  if (exact) return exact;
  const match = Object.keys(ROUTE_TITLES)
    .filter((k) => pathname.startsWith(k + "/") || pathname === k)
    .sort((a, b) => b.length - a.length)[0];
  return match ? ROUTE_TITLES[match] : "";
}

interface TopbarProps {
  userInitials: string;
  schoolName: string;
  onHamburger?: () => void;
  hasAlerts?: boolean;
}

export function Topbar({
  userInitials,
  schoolName,
  onHamburger,
  hasAlerts,
}: TopbarProps) {
  const pathname = usePathname();
  const title = pickTitle(pathname);

  return (
    <header className="h-16 bg-white border-b border-default sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        {onHamburger && (
          <button
            type="button"
            onClick={onHamburger}
            className="md:hidden p-2 rounded-lg text-muted hover:bg-bg-hover hover:text-text-primary transition-all"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div className="text-sm font-semibold text-muted uppercase tracking-wider truncate">
          {title}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <TopbarSearch className="hidden md:block" />
        <button
          type="button"
          className="relative p-2 rounded-lg text-muted hover:bg-bg-hover hover:text-text-primary transition-all"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {hasAlerts && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error animate-pulse" />
          )}
        </button>
        <div className="w-px h-6 bg-default hidden md:block" />
        <Link
          href="/settings"
          className="flex items-center gap-2 group"
          aria-label="Profil"
        >
          <div className="w-8 h-8 rounded-lg bg-accent-dim text-accent-text font-bold text-xs flex items-center justify-center">
            {userInitials}
          </div>
          <div className="hidden md:block text-xs text-muted max-w-[120px] truncate group-hover:text-text-primary transition-colors">
            {schoolName}
          </div>
        </Link>
      </div>
    </header>
  );
}
