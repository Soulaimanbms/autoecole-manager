import { MessageCircle } from "lucide-react";

interface WhatsAppLinkProps {
  phone: string;
  message?: string;
  className?: string;
}

export function WhatsAppLink({ phone, message, className }: WhatsAppLinkProps) {
  const normalized = phone.replace(/\D/g, "").replace(/^0/, "212");
  const url = message
    ? `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${normalized}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "inline-flex items-center gap-1.5 text-xs text-accent-text font-medium hover:underline"
      }
    >
      <MessageCircle className="h-3.5 w-3.5" />
      WhatsApp
    </a>
  );
}
