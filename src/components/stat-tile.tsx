import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatTileProps {
  label: string;
  value: string;
  delta: number;
  upIsGood?: boolean;
}

export function StatTile({ label, value, delta, upIsGood = true }: StatTileProps) {
  const isPositive = delta > 0;
  const isGood = upIsGood ? isPositive : !isPositive;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-card-foreground">{value}</p>
      <div className="mt-2 flex items-center gap-1.5">
        {isPositive ? (
          <TrendingUp className={cn("w-4 h-4", isGood ? "text-[var(--st-live-dot)]" : "text-[var(--st-fail-dot)]")} />
        ) : (
          <TrendingDown className={cn("w-4 h-4", isGood ? "text-[var(--st-live-dot)]" : "text-[var(--st-fail-dot)]")} />
        )}
        <span
          className={cn(
            "text-sm font-medium",
            isGood ? "text-[var(--st-live-fg)]" : "text-[var(--st-fail-fg)]"
          )}
        >
          {isPositive ? "+" : ""}{delta}%
        </span>
        <span className="text-xs text-muted-foreground">vs last year</span>
      </div>
    </div>
  );
}
