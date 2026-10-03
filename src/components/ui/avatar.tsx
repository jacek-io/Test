import { cn, initials } from "@/lib/utils";

const sizes = {
  xs: "size-6 text-[10px]",
  sm: "size-7 text-[11px]",
  md: "size-8 text-xs",
  lg: "size-10 text-sm",
  xl: "size-12 text-base",
};

export function Avatar({
  name,
  size = "md",
  tone = "muted",
  className,
}: {
  name: string;
  size?: keyof typeof sizes;
  tone?: "muted" | "primary" | "brand";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold uppercase tracking-wide",
        tone === "primary" && "bg-primary text-primary-foreground",
        tone === "brand" && "bg-accent text-accent-foreground",
        tone === "muted" && "bg-muted text-muted-foreground",
        sizes[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

export function AvatarStack({ names, max = 4, size = "sm" }: { names: string[]; max?: number; size?: keyof typeof sizes }) {
  const shown = names.slice(0, max);
  const rest = names.length - shown.length;
  return (
    <span className="inline-flex items-center -space-x-2">
      {shown.map((n) => (
        <Avatar key={n} name={n} size={size} className="ring-2 ring-card" />
      ))}
      {rest > 0 && (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-secondary font-medium text-muted-foreground ring-2 ring-card",
            sizes[size],
          )}
        >
          +{rest}
        </span>
      )}
    </span>
  );
}
