"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";
import { TrialBanner } from "@/components/shared/TrialBanner";
import { ImpersonationBanner } from "@/components/shared/ImpersonationBanner";
import type { SubscriptionStatus } from "@/types";

interface AppShellProps {
  schoolName: string;
  userInitials: string;
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt?: Date | string | null;
  impersonating?: boolean;
  impersonatingSchoolName?: string | null;
  hasAlerts?: boolean;
  children: React.ReactNode;
}

export function AppShell({
  schoolName,
  userInitials,
  subscriptionStatus,
  trialEndsAt,
  impersonating,
  impersonatingSchoolName,
  hasAlerts,
  children,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-bg-page">
      <ImpersonationBanner
        impersonating={impersonating}
        schoolName={impersonatingSchoolName}
      />
      {subscriptionStatus === "trial" && trialEndsAt && (
        <TrialBanner trialEndsAt={trialEndsAt} />
      )}

      <div className="flex flex-1 min-h-0">
        <div className="hidden md:block fixed left-0 top-0 h-screen z-30">
          <Sidebar schoolName={schoolName} />
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="p-0 w-60 sm:max-w-[15rem]">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <Sidebar
              schoolName={schoolName}
              onNavigate={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>

        <div className="flex-1 flex flex-col min-w-0 md:ml-60">
          <Topbar
            userInitials={userInitials}
            schoolName={schoolName}
            onHamburger={() => setMobileOpen(true)}
            hasAlerts={hasAlerts}
          />
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
