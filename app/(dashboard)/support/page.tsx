import { HelpCircle, MessageCircle, Mail, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">Compte</div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Support</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-default p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-info-bg flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-info" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">Chat en direct</h3>
            <p className="text-sm text-text-body mt-1">Notre équipe est disponible du lundi au vendredi de 9h à 18h.</p>
          </div>
          <button className="btn-primary">Démarrer le chat</button>
        </div>

        <div className="bg-white rounded-xl border border-default p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-accent-dim flex items-center justify-center">
            <Mail className="h-5 w-5 text-accent-text" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">Email support</h3>
            <p className="text-sm text-text-body mt-1">Envoyez-nous un email et nous répondons sous 24h.</p>
            <p className="text-sm font-semibold text-accent-text mt-2">support@autoecole.ma</p>
          </div>
          <a href="mailto:support@autoecole.ma" className="btn-secondary inline-flex items-center gap-2 text-xs">
            <ExternalLink className="h-3.5 w-3.5" />Envoyer un email
          </a>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-default p-6">
        <div className="flex items-center gap-3 mb-5">
          <HelpCircle className="h-5 w-5 text-muted" />
          <h3 className="text-base font-semibold text-text-primary">Questions fréquentes</h3>
        </div>
        <div className="space-y-4">
          {[
            { q: "Comment ajouter un nouvel élève ?", a: "Depuis la page Élèves, cliquez sur « Nouvel élève » et remplissez le formulaire." },
            { q: "Comment planifier une séance récurrente ?", a: "Lors de la création d'une séance, activez l'option « Récurrent » et définissez le nombre de semaines." },
            { q: "Comment générer un reçu de paiement ?", a: "Dans le profil de l'élève, onglet Paiements, cliquez sur l'icône PDF à côté de chaque paiement." },
            { q: "Comment mettre à niveau mon plan ?", a: "Contactez le support par email ou chat pour passer au plan Pro." },
          ].map((faq, i) => (
            <div key={i} className="py-4 border-b border-default last:border-0">
              <div className="text-sm font-semibold text-text-primary mb-1">{faq.q}</div>
              <div className="text-sm text-text-body">{faq.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
