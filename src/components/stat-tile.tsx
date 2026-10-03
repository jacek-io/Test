import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Sparkline } from "@/components/charts/sparkline";
import { cn } from "@/lib/utils";

export function StatTile({
  label,
  value,
  unit,
  delta,
  deltaLabel = "vs last month",
  upIsGood = true,
  trend,
  hint,
  className,
  style,
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;
  deltaLabel?: string;
  upIsGood?: boolean;
  trend?: number[];
  hint?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const direction = delta === undefined || delta === 0 ? "flat" : delta > 0 ? "up" : "down";
  const good = direction === "flat" ? null : (direction === "up") === upIsGood;
  const DeltaIcon = direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : Minus;

  return (
    <Card className={cn("enter relative justify-between gap-4 p-5", className)} style={style}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
        {trend && <Sparkline data={trend} className="h-7 w-14 text-muted-foreground/60 sm:w-20" />}
      </div>
      <div>
        <p className="flex items-baseline gap-1.5 text-[28px] font-semibold leading-none tracking-tight">
          {value}
          {unit && <span className="text-base font-medium text-muted-foreground">{unit}</span>}
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          {delta !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium",
                good === null && "bg-muted text-muted-foreground",
                good === true && "bg-success-bg text-success",
                good === false && "bg-danger-bg text-danger",
              )}
            >
              <DeltaIcon className="size-3" aria-hidden />
              {direction === "flat" ? "0" : `${delta > 0 ? "+" : ""}${delta}`}
            </span>
          )}
          <span className="truncate text-muted-foreground">{delta !== undefined ? deltaLabel : hint}</span>
        </div>
      </div>
    </Card>
  );
}
