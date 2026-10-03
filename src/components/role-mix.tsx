import { FAMILY_LABEL, FAMILY_ORDER, type RoleFamily } from "@/lib/data";
import type { FamilyCount } from "@/lib/metrics";
import { cn } from "@/lib/utils";

/** Series colour follows the entity (role family), never its rank. */
export const FAMILY_COLOR: Record<RoleFamily, string> = {
  engineering: "var(--chart-1)",
  qa: "var(--chart-2)",
  product: "var(--chart-3)",
  design: "var(--chart-4)",
  other: "var(--chart-5)",
};

/** Single stacked bar — part-to-whole, 2px surface gaps between segments. */
export function RoleMixBar({
  mix,
  className,
  height = "h-2",
  label = "Role mix",
}: {
  mix: FamilyCount[];
  className?: string;
  height?: string;
  label?: string;
}) {
  const total = mix.reduce((a, m) => a + m.count, 0);
  if (!total) return <div className={cn("w-full rounded-full bg-muted", height, className)} />;
  return (
    <div
      role="img"
      aria-label={`${label}: ${mix
        .filter((m) => m.count)
        .map((m) => `${FAMILY_LABEL[m.family]} ${m.count}`)
        .join(", ")}`}
      className={cn("flex w-full gap-0.5 overflow-hidden rounded-full", height, className)}
    >
      {mix
        .filter((m) => m.count > 0)
        .map((m) => (
          <span
            key={m.family}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{ width: `${(m.count / total) * 100}%`, background: FAMILY_COLOR[m.family] }}
          />
        ))}
    </div>
  );
}

export function RoleMixLegend({ mix, className }: { mix: FamilyCount[]; className?: string }) {
  const total = mix.reduce((a, m) => a + m.count, 0);
  return (
    <ul className={cn("grid gap-x-6 gap-y-2 text-[13px]", className)}>
      {FAMILY_ORDER.map((family) => {
        const m = mix.find((x) => x.family === family);
        const count = m?.count ?? 0;
        return (
          <li key={family} className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: FAMILY_COLOR[family] }} aria-hidden />
              <span className="truncate text-muted-foreground">{FAMILY_LABEL[family]}</span>
            </span>
            <span className="tabular shrink-0 font-medium">
              {count}
              <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                {total ? Math.round((count / total) * 100) : 0}%
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
