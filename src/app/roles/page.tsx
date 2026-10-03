import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, Users } from "lucide-react";
import { SENIORITY_LABEL, STAGE_LABEL, STAGE_ORDER, getTeam, openRoles, type RoleStage } from "@/lib/data";
import { median } from "@/lib/metrics";
import { cn, daysSince, stagger } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { StatTile } from "@/components/stat-tile";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { FAMILY_COLOR } from "@/components/role-mix";

export const metadata: Metadata = { title: "Open roles" };

const STAGE_TONE: Record<RoleStage, string> = {
  sourcing: "bg-muted-foreground/60",
  screening: "bg-chart-3",
  interviewing: "bg-brand-strong",
  offer: "bg-success-dot",
};

export default function RolesPage() {
  const urgent = openRoles.filter((r) => r.urgent).length;
  const offers = openRoles.filter((r) => r.stage === "offer").length;
  const med = median(openRoles.map((r) => daysSince(r.openedAt)));
  const stale = openRoles.filter((r) => daysSince(r.openedAt) > 45).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Open roles" description={`${openRoles.length} positions across ${new Set(openRoles.map((r) => r.teamId)).size} teams`} />

      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4" aria-label="Hiring metrics">
        <StatTile label="Open roles" value={openRoles.length} hint={`${new Set(openRoles.map((r) => r.teamId)).size} teams hiring`} style={stagger(1)} />
        <StatTile label="Urgent" value={urgent} hint="blocking delivery" style={stagger(2)} />
        <StatTile label="Median days open" value={med} unit="d" hint={stale ? `${stale} open > 45 days` : "none older than 45 days"} style={stagger(3)} />
        <StatTile label="Offers out" value={offers} hint="awaiting candidate reply" style={stagger(4)} />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Hiring pipeline">
        {STAGE_ORDER.map((stage, col) => {
          const items = openRoles
            .filter((r) => r.stage === stage)
            .sort((a, b) => Number(b.urgent) - Number(a.urgent) || daysSince(b.openedAt) - daysSince(a.openedAt));
          return (
            <div key={stage} className="enter space-y-3" style={stagger(col + 3)}>
              <div className="flex items-center gap-2 px-1">
                <span className={cn("size-2 rounded-full", STAGE_TONE[stage])} aria-hidden />
                <h2 className="text-sm font-semibold">{STAGE_LABEL[stage]}</h2>
                <span className="tabular ml-auto rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">{items.length}</span>
              </div>
              {items.length === 0 ? (
                <Card className="border border-dashed bg-transparent shadow-none [box-shadow:none]">
                  <EmptyState icon={BriefcaseBusiness} title="Empty" className="py-8" />
                </Card>
              ) : (
                <ul className="space-y-3">
                  {items.map((r) => {
                    const team = getTeam(r.teamId)!;
                    const age = daysSince(r.openedAt);
                    return (
                      <li key={r.id}>
                        <Card className="hover-lift gap-3 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="flex items-center gap-2 text-sm font-medium">
                                <span aria-hidden className="size-2 shrink-0 rounded-[3px]" style={{ background: FAMILY_COLOR[r.family] }} />
                                <span className="truncate">{r.title}</span>
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">{SENIORITY_LABEL[r.seniority]}</p>
                            </div>
                            {r.urgent && <Badge variant="danger">Urgent</Badge>}
                          </div>
                          <Link href={`/teams/${team.id}`} className="flex items-center gap-2 text-xs hover:underline">
                            <Users className="size-3.5 text-muted-foreground" />
                            <span className="font-medium">{team.name}</span>
                            <span className="truncate text-muted-foreground">· {team.client}</span>
                          </Link>
                          <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                            <span className="tabular">{r.candidates} candidate{r.candidates === 1 ? "" : "s"}</span>
                            <span className={cn("tabular font-medium", age > 45 ? "text-danger" : age > 30 ? "text-warning" : "")}>{age}d open</span>
                          </div>
                        </Card>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
