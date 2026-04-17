"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  GraduationCap,
  UserCog,
  TrendingDown,
  Clock,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Principal",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
      { label: "Élèves", href: "/students", icon: <Users className="h-4 w-4" /> },
      { label: "Séances", href: "/sessions", icon: <Calendar className="h-4 w-4" /> },
      { label: "Paiements", href: "/payments", icon: <CreditCard className="h-4 w-4" /> },
      { label: "Examens", href: "/exams", icon: <GraduationCap className="h-4 w-4" /> },
    ],
  },
  {
    title: "Gestion",
    items: [
      { label: "Moniteurs", href: "/instructors", icon: <UserCog className="h-4 w-4" /> },
      { label: "Dépenses", href: "/expenses", icon: <TrendingDown className="h-4 w-4" /> },
      { label: "Liste d'attente", href: "/waiting-list", icon: <Clock className="h-4 w-4" /> },
    ],
  },
  {
    title: "Compte",
    items: [
      { label: "Paramètres", href: "/settings", icon: <Settings className="h-4 w-4" /> },
      { label: "Support", href: "/support", icon: <HelpCircle className="h-4 w-4" /> },
    ],
  },
];

interface SidebarProps {
  schoolName: string;
  onNavigate?: () => void;
}

export function Sidebar({ schoolName, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    window.location.replace("/login");
  };

  return (
    <aside className="flex flex-col h-full w-60 bg-white border-r border-default p-5">
      <div className="mb-8 flex items-center gap-2.5 px-1">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white" aria-hidden>
            <path d="M5 17h14M6 13l1.5-5.5A2 2 0 019.4 6h5.2a2 2 0 011.9 1.5L18 13M6 13h12v4H6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="8.5" cy="17" r="1.5" fill="currentColor" />
            <circle cx="15.5" cy="17" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-text-primary leading-tight truncate">
            Auto-École
          </div>
          <div className="text-[10px] text-muted truncate" title={schoolName}>
            {schoolName}
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-2">
            <div className="text-[9px] font-bold uppercase tracking-widest text-muted px-3 mb-1 mt-5">
              {group.title}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
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
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-default space-y-2">
        <Link
          href="/students?new=1"
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          Nouvel élève
        </Link>
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
