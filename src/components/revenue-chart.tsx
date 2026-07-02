"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { revenueData } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm font-medium text-card-foreground">
          {entry.dataKey === "revenue" ? "Revenue" : "Expenses"}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function RevenueChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-card-foreground">Revenue vs Expenses</h3>
        <p className="text-sm text-muted-foreground">Monthly trend, 2024</p>
      </div>
      <div className="flex items-center gap-5 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 rounded-full bg-[var(--chart-navy)]" />
          <span className="text-xs text-muted-foreground">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 rounded-full bg-[var(--chart-turquoise)]" />
          <span className="text-xs text-muted-foreground">Expenses</span>
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={revenueData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeWidth={1} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => formatCurrency(v)}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--chart-navy)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "var(--chart-navy)", stroke: "var(--card)", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="var(--chart-turquoise)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "var(--chart-turquoise)", stroke: "var(--card)", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
