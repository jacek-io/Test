"use client";

import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TrendPoint } from "@/lib/data";
import { ChartLegend, ChartTooltip } from "@/components/charts/chart-tooltip";

const LABELS = { deployed: "Deployed", bench: "Bench" };

/** Stacked headcount per month: deployed + bench = total. One axis, part-to-whole over time. */
export function CapacityChart({ data }: { data: TrendPoint[] }) {
  const last = data[data.length - 1];
  return (
    <div className="flex h-full flex-col gap-3">
      <ChartLegend
        items={[
          { label: LABELS.deployed, color: "var(--chart-1)" },
          { label: LABELS.bench, color: "var(--chart-2)" },
        ]}
      />
      <div className="min-h-[240px] w-full flex-1 sm:min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 18, right: 8, bottom: 0, left: -16 }} barCategoryGap="30%">
            <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeWidth={1} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: "var(--chart-axis)" }}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              interval={0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickCount={5}
              width={48}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.6 }}
              isAnimationActive={false}
              content={<ChartTooltip labelMap={LABELS} />}
            />
            <Bar dataKey="deployed" stackId="a" fill="var(--chart-1)" maxBarSize={24} isAnimationActive={false} />
            <Bar
              dataKey="bench"
              stackId="a"
              fill="var(--chart-2)"
              maxBarSize={24}
              radius={[4, 4, 0, 0]}
              stroke="var(--card)"
              strokeWidth={2}
              isAnimationActive={false}
            >
              {/* Direct label only on the latest month: total headcount */}
              <LabelList
                dataKey="bench"
                position="top"
                offset={6}
                content={(props) => {
                  const { x, y, width, index } = props as { x?: number; y?: number; width?: number; index?: number };
                  if (index !== data.length - 1 || x === undefined || y === undefined || width === undefined) return null;
                  return (
                    <text
                      x={x + width / 2}
                      y={y - 6}
                      textAnchor="middle"
                      className="fill-foreground"
                      fontSize={11}
                      fontWeight={600}
                    >
                      {last.deployed + last.bench}
                    </text>
                  );
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
