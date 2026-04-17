import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-xl bg-bg-hover flex items-center justify-center text-muted mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">
        {title}
      </h3>
      <p className="text-sm text-muted max-w-xs">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 btn-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
