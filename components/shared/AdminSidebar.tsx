"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Users, Shield, LogOut, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  onNavigate?: () => void;
}

const ITEMS = [
  { label: "Vue d'ensemble", href: "/admin", icon: <BarChart3 className="h-4 w-4" /> },
  { label: "Écoles", href: "/admin/schools", icon: <Building2 className="h-4 w-4" /> },
  { label: "Utilisateurs", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
];

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.replace("/login");
  };

  return (
    <aside className="flex flex-col h-full w-60 bg-white border-r border-default p-5">
      <div className="mb-8 flex items-center gap-2.5 px-1">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center shadow-sm">
          <Shield className="h-4 w-4 text-white" aria-hidden />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-text-primary leading-tight">
            Administration
          </div>
          <div className="text-[10px] text-muted">Super admin</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="text-[9px] font-bold uppercase tracking-widest text-muted px-3 mb-1">
          Super admin
        </div>
        <ul className="space-y-0.5">
          {ITEMS.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href ||
                  pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                    active
                      ? "bg-accent-dim text-accent-text font-semibold border-l-2 border-accent rounded-l-none pl-[10px]"
                      : "text-text-body hover:bg-bg-hover hover:text-text-primary",
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-default">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted hover:bg-bg-hover hover:text-error transition-all"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
