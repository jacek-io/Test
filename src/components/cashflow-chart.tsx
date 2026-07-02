"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { cashFlowData } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm font-medium text-card-foreground">
          {entry.dataKey === "inflow" ? "Inflow" : "Outflow"}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function CashflowChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-card-foreground">Cash Flow</h3>
        <p className="text-sm text-muted-foreground">Monthly inflow vs outflow</p>
      </div>
      <div className="flex items-center gap-5 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[var(--chart-navy)]" style={{ opacity: 0.15 }} />
          <span className="text-xs text-muted-foreground">Inflow</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-[var(--chart-turquoise)]" style={{ opacity: 0.15 }} />
          <span className="text-xs text-muted-foreground">Outflow</span>
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={cashFlowData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-navy)" stopOpacity={0.12} />
                <stop offset="100%" stopColor="var(--chart-navy)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-turquoise)" stopOpacity={0.12} />
                <stop offset="100%" stopColor="var(--chart-turquoise)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="inflow"
              stroke="var(--chart-navy)"
              strokeWidth={2}
              fill="url(#inflowGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "var(--chart-navy)", stroke: "var(--card)", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="outflow"
              stroke="var(--chart-turquoise)"
              strokeWidth={2}
              fill="url(#outflowGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "var(--chart-turquoise)", stroke: "var(--card)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
