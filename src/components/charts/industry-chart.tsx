"use client";

import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltip } from "@/components/charts/chart-tooltip";

export interface IndustryRow {
  label: string;
  people: number;
  teams: number;
}

/** Magnitude comparison: horizontal bars, one hue, value at the tip. */
export function IndustryChart({ data }: { data: IndustryRow[] }) {
  const height = data.length * 34 + 8;
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 36, bottom: 0, left: 0 }} barCategoryGap="28%">
          <XAxis type="number" hide domain={[0, (max: number) => Math.ceil(max * 1.1)]} />
          <YAxis
            type="category"
            dataKey="label"
            width={118}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "var(--foreground)" }}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.6 }}
            isAnimationActive={false}
            content={<ChartTooltip labelMap={{ people: "People", teams: "Teams" }} />}
          />
          <Bar dataKey="people" fill="var(--chart-1)" maxBarSize={18} radius={[0, 4, 4, 0]} isAnimationActive={false}>
            <LabelList
              dataKey="people"
              position="right"
              offset={8}
              className="fill-foreground"
              fontSize={12}
              fontWeight={600}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
