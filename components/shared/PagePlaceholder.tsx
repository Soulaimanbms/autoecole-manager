interface PagePlaceholderProps {
  title: string;
  description?: string;
  label?: string;
}

export function PagePlaceholder({ title, description, label }: PagePlaceholderProps) {
  return (
    <div className="space-y-6">
      <header>
        {label && (
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted">
            {label}
          </div>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">{title}</h1>
        {description && (
          <p className="text-sm text-muted mt-1">{description}</p>
        )}
      </header>
      <section className="bg-white rounded-xl border border-default p-6 text-sm text-muted">
        Ce module sera disponible dans une prochaine version.
      </section>
    </div>
  );
}
