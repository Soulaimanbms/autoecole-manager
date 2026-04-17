import { ShieldAlert, Phone } from "lucide-react";
import { SignOutButton } from "@/components/shared/SignOutButton";

export const dynamic = "force-dynamic";

export default function SuspendedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-bg-page">
      <div className="w-full max-w-md bg-white rounded-2xl border border-error/30 shadow-lg p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-error-bg text-error-text flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2 tracking-tight">
          Compte suspendu
        </h1>
        <p className="text-sm text-text-body leading-relaxed">
          L&apos;accès à votre compte a été temporairement suspendu. Veuillez
          contacter notre équipe pour plus d&apos;informations ou pour régulariser
          votre situation.
        </p>

        <div className="mt-6 rounded-xl bg-bg-hover p-4 text-left">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">
            Support
          </div>
          <a
            href="tel:+212522000000"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary hover:text-accent-text transition-colors"
          >
            <Phone className="h-4 w-4" />
            +212 522 00 00 00
          </a>
        </div>

        <div className="mt-6 flex items-center gap-2 justify-center">
          <a
            href="mailto:support@autoecole-manager.ma"
            className="inline-flex items-center justify-center bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all active:scale-95"
          >
            Contacter le support
          </a>
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
