import { cn } from "@/lib/utils";
import type { TransactionStatus } from "@/lib/data";

const statusConfig: Record<TransactionStatus, { dotClass: string; bgClass: string; fgClass: string; label: string }> = {
  completed: {
    dotClass: "bg-[var(--st-live-dot)]",
    bgClass: "bg-[var(--st-live-bg)]",
    fgClass: "text-[var(--st-live-fg)]",
    label: "Completed",
  },
  pending: {
    dotClass: "bg-[var(--st-build-dot)]",
    bgClass: "bg-[var(--st-build-bg)]",
    fgClass: "text-[var(--st-build-fg)]",
    label: "Pending",
  },
  failed: {
    dotClass: "bg-[var(--st-fail-dot)]",
    bgClass: "bg-[var(--st-fail-bg)]",
    fgClass: "text-[var(--st-fail-fg)]",
    label: "Failed",
  },
};

export function StatusPill({ status }: { status: TransactionStatus }) {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", config.bgClass, config.fgClass)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dotClass)} />
      {config.label}
    </span>
  );
}
