"use client";

interface Item {
  name?: string | number;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
}

/** One tooltip, every series. Values lead, labels follow. Keyed by a short stroke, not a box. */
export function ChartTooltip({
  active,
  payload,
  label,
  labelMap,
  formatter,
}: {
  active?: boolean;
  payload?: ReadonlyArray<Item>;
  label?: string | number;
  labelMap?: Record<string, string>;
  formatter?: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-36 rounded-lg border bg-popover px-3 py-2 text-popover-foreground shadow-lg">
      {label !== undefined && <p className="mb-1.5 text-xs font-medium text-muted-foreground">{String(label)}</p>}
      <ul className="space-y-1">
        {payload.map((item) => {
          const key = String(item.dataKey ?? item.name);
          const v = typeof item.value === "number" ? (formatter ? formatter(item.value) : item.value) : item.value;
          return (
            <li key={key} className="flex items-center justify-between gap-4 text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span className="h-0.5 w-3 rounded-full" style={{ background: item.color }} aria-hidden />
                {labelMap?.[key] ?? key}
              </span>
              <span className="tabular font-semibold">{v}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ChartLegend({ items }: { items: Array<{ label: string; color: string; shape?: "line" | "rect" }> }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-1.5">
          <span
            className={i.shape === "line" ? "h-0.5 w-3 rounded-full" : "size-2.5 rounded-[3px]"}
            style={{ background: i.color }}
            aria-hidden
          />
          {i.label}
        </li>
      ))}
    </ul>
  );
}
