import { cn } from "@/lib/utils";

type Tone = "primary" | "brand" | "success" | "warning" | "danger" | "auto";
type Fixed = Exclude<Tone, "auto">;

export function utilizationTone(value: number): Fixed {
  if (value >= 85) return "success";
  if (value >= 78) return "warning";
  return "danger";
}

const fill: Record<Fixed, string> = {
  primary: "bg-primary",
  brand: "bg-brand-strong",
  success: "bg-success-dot",
  warning: "bg-warning-dot",
  danger: "bg-danger-dot",
};
const track: Record<Fixed, string> = {
  primary: "bg-primary/15",
  brand: "bg-brand/35",
  success: "bg-success-dot/20",
  warning: "bg-warning-dot/25",
  danger: "bg-danger-dot/20",
};

/** Meter: the track is a lighter step of the same hue so the state reads across the whole bar. */
export function Progress({
  value,
  tone = "primary",
  className,
  label,
}: {
  value: number;
  tone?: Tone;
  className?: string;
  label?: string;
}) {
  const t = tone === "auto" ? utilizationTone(value) : tone;
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
      aria-label={label}
      className={cn("h-1.5 w-full overflow-hidden rounded-full", track[t], className)}
    >
      <div className={cn("h-full rounded-full", fill[t])} style={{ width: `${v}%` }} />
    </div>
  );
}
