"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Shield } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AdminSidebar } from "@/components/shared/AdminSidebar";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  userInitials: string;
  userEmail?: string;
  children: React.ReactNode;
}

const ADMIN_TITLES: Record<string, string> = {
  "/admin": "Vue d'ensemble",
  "/admin/schools": "Écoles",
  "/admin/users": "Utilisateurs",
};

function pickAdminTitle(pathname: string): string {
  const match = Object.keys(ADMIN_TITLES)
    .filter((k) => pathname === k || pathname.startsWith(k + "/"))
    .sort((a, b) => b.length - a.length)[0];
  return match ? ADMIN_TITLES[match] : "";
}

export function AdminShell({
  userInitials,
  userEmail,
  children,
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();
  const title = pickAdminTitle(pathname);

  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <div className="flex flex-1 min-h-0">
        <div className="hidden md:block fixed left-0 top-0 h-screen z-30">
          <AdminSidebar />
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="p-0 w-60 sm:max-w-[15rem]">
            <SheetTitle className="sr-only">Menu administration</SheetTitle>
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="flex-1 flex flex-col min-w-0 md:ml-60">
          <header className="h-16 bg-white border-b border-default sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 rounded-lg text-muted hover:bg-bg-hover hover:text-text-primary transition-all"
                aria-label="Ouvrir le menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted" aria-hidden />
                <span className="text-sm font-semibold text-muted uppercase tracking-wider truncate">
                  {title}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                type="button"
                className="relative p-2 rounded-lg text-muted hover:bg-bg-hover hover:text-text-primary transition-all"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>
              <div className="w-px h-6 bg-default hidden md:block" />
              <Link
                href="/admin"
                className="flex items-center gap-2 group"
                aria-label="Profil"
              >
                <div className="w-8 h-8 rounded-lg bg-[#0f172a] text-white font-bold text-xs flex items-center justify-center">
                  {userInitials}
                </div>
                {userEmail && (
                  <div
                    className={cn(
                      "hidden md:block text-xs text-muted max-w-[180px] truncate group-hover:text-text-primary transition-colors",
                    )}
                  >
                    {userEmail}
                  </div>
                )}
              </Link>
            </div>
          </header>
          <main className="flex-1 min-w-0">
            <div className="max-w-[1400px] mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
