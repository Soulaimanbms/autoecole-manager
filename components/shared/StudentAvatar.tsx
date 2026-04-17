import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface StudentAvatarProps {
  initials: string;
  photoUrl?: string | null;
  size?: AvatarSize;
  className?: string;
  alt?: string;
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: "w-8 h-8 rounded-lg text-[10px]",
  md: "w-10 h-10 rounded-xl text-xs",
  lg: "w-14 h-14 rounded-xl text-sm",
  xl: "w-20 h-20 rounded-2xl text-base",
};

export function StudentAvatar({
  initials,
  photoUrl,
  size = "md",
  className,
  alt,
}: StudentAvatarProps) {
  const base =
    "inline-flex shrink-0 items-center justify-center overflow-hidden bg-accent-dim text-accent-text font-bold select-none";
  const sizeCls = SIZE_CLASSES[size];

  if (photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={photoUrl}
        alt={alt ?? initials}
        className={cn(base, sizeCls, "object-cover", className)}
      />
    );
  }
  return (
    <span className={cn(base, sizeCls, className)} aria-label={alt ?? initials}>
      {initials.slice(0, 2).toUpperCase()}
    </span>
  );
}
